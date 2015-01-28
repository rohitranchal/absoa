package edu.purdue.cs.absoa;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.apache.thrift.TException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class ABServiceHandler implements ABService.Iface 
{
	/* Class variables - AB data structures */
	private static Set<String> issuedTokenSet = new HashSet<String>();	
	private static HashMap<String, String> abData = new HashMap<String, String>();
	private static HashMap<String, String> abSLA = new HashMap<String, String>();
	private static HashMap<String, ABSession> sessionList = new HashMap<String, ABSession>();

	/* Getters and setters for data structures */
	public static void setABData(String abkey, String abvalue)
	{
		abData.put(abkey, abvalue);
	}

	public static String getABData(String abkey)
	{
		return abData.get(abkey);
	}

	public static void setABSLA(String abkey, String abvalue)
	{
		abSLA.put(abkey, abvalue);
	}

	public static String getABSLA(String abkey)
	{
		return abSLA.get(abkey);
	}
	
	/* Constructor - Initialize AB */
	public ABServiceHandler()
	{
		/* Read data from data file */
		InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("data.txt");
		ABDataParser parser = new ABDataParser(is, "data");
		try {
			parser.processLineByLine();
			
			/* Read sla from sla file */
			is = Thread.currentThread().getContextClassLoader().getResourceAsStream("sla.txt");
			parser = new ABDataParser(is, "sla");
			parser.processLineByLine();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/* AB API */
	public ABSLA getSLA() throws TException 
	{
		ABSLA abSLA = new ABSLA();
		String str = getABSLA("ab.activetime");
		abSLA.activeTime = Integer.parseInt(str);
		str = getABSLA("ab.numrequests");
		abSLA.numRequests = Integer.parseInt(str);
		abSLA.expirationTime = getABSLA("ab.expiretime");
		return abSLA;
	}

	public String authenticateChallenge() throws TException
	{	
		// java.util.Date start = new java.util.Date();
		// System.out.println(Server.ABPort + ": Authenticate Challenge Start: " + start.getTime());
		String strTok = generateToken();
//		System.out.println("Server: authChallenge token: " + strTok);
		issuedTokenSet.add(strTok);
		try {
			String encodedTok = dataEncode(strTok.getBytes());
			// java.util.Date end = new java.util.Date();
			// System.out.println(Server.ABPort + ": Authenticate Challenge End: " + end.getTime());
			return encodedTok;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public ABObject authenticateResponse(String challenge, String signedChallenge, String certificate) throws TException 
	{	
		// java.util.Date start = new java.util.Date();
		// System.out.println(Server.ABPort + ": Authenticate Response Start: " + start.getTime());
		try {
			byte[] decodeChall = dataDecode(signedChallenge);	
			byte[] decodeCert = dataDecode(certificate);
			byte[] decodeToken = dataDecode(challenge);

			String storePath = "CA/ABCACert.cert";
			byte[] CACert = loadCertificateFile(storePath);

			if (validateSignature(decodeToken, decodeChall, decodeCert, CACert)) {
				System.out.println("AB: authenticated");
				byte[] sessionKey = generateSessionKey(decodeCert);
				String sessionID = generateToken();
				ABSession abs = new ABSession();
				abs.setSessionKey(sessionKey);
				abs.setServiceCert(decodeCert);
				sessionList.put(sessionID, abs); 				
				ABObject abo = new ABObject(sessionID, dataEncode(sessionKey));
//				System.out.println("AB: authResponse - sessionID: " + sessionID + " - sessionKey: " + sessionKey);
				// java.util.Date end = new java.util.Date();
				// System.out.println(Server.ABPort + ": Authenticate Response End: " + end.getTime());
				return abo;
			} else {			
				return null; 
			}
		} catch (Exception e) {
			e.printStackTrace();			
			return null;
		}		
	}

	private byte[] loadCertificateFile(String path) throws Exception
	{
		CertificateFactory certificatefactory = CertificateFactory.getInstance("X.509");
		final InputStream certFile = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
		X509Certificate caCert = (X509Certificate)certificatefactory.generateCertificate(certFile);
		certFile.close();

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream out = new ObjectOutputStream(bos);   
		out.writeObject(caCert);
		byte[] data = bos.toByteArray(); 
		bos.close();		
		return data;
	}

	private static boolean validateSignature(byte[] token, byte[] signedMessage, byte[] certificate, byte[] CAcertificate) throws Exception
	{
		InputStream bis = new ByteArrayInputStream(certificate);
		CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
		X509Certificate cert = (X509Certificate)certFactory.generateCertificate(bis);
		bis.close();
				
//		ByteArrayInputStream bis = new ByteArrayInputStream(certificate);
//		ObjectInput in = new ObjectInputStream(bis);
//		X509Certificate cert = (X509Certificate) in.readObject(); 
//		bis.close();

		try {
			cert.checkValidity();
		} catch(Exception e) {
			throw new CertificateException("Service Certificate has expired", e);
		}

		ByteArrayInputStream cabis = new ByteArrayInputStream(CAcertificate);
		ObjectInput cain = new ObjectInputStream(cabis);
		X509Certificate cacert = (X509Certificate) cain.readObject();
		cabis.close();  

		if(cert.getIssuerDN().equals(cacert.getSubjectDN())) {
			try {
				cert.verify(cacert.getPublicKey());                             
			} catch(Exception e) {
				throw new CertificateException("Certificate not signed by AB CA", e);
			}

			PublicKey pubKey = cert.getPublicKey();
			Signature verifySign = Signature.getInstance("SHA256withRSA");
			verifySign.initVerify(pubKey);
			if (issuedTokenSet.contains(new String(token))) {
				verifySign.update(token);
				return verifySign.verify(signedMessage);                                  
			} else {
				System.out.println("Wrong token");                       
			}
		} else {
			System.out.println("Service Issuer doesn't match CA Subject");
		}

		return false;
	}

	private static byte[] generateSessionKey(byte[] serviceCert)
	{
		try {			
			KeyGenerator keygenerator = KeyGenerator.getInstance("AES");
			SecretKey aesKey = keygenerator.generateKey();

			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			ObjectOutputStream out = new ObjectOutputStream(bos);   
			out.writeObject(aesKey);
			byte[] data = bos.toByteArray(); 
			bos.close();

			InputStream bis = new ByteArrayInputStream(serviceCert); 
			CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
			X509Certificate cert = (X509Certificate)certFactory.generateCertificate(bis);			
			bis.close();
			
//			ByteArrayInputStream bis = new ByteArrayInputStream(serviceCert);
//			ObjectInput in = new ObjectInputStream(bis);
//			X509Certificate cert = (X509Certificate)in.readObject(); 
//			bis.close();

			PublicKey serviceKey = cert.getPublicKey();
			byte[] cipherText = null;
			try {
				final Cipher cipher = Cipher.getInstance("RSA");
				cipher.init(Cipher.ENCRYPT_MODE, serviceKey);
				cipherText = cipher.doFinal(data);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return cipherText;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}	

	public String getValue(String sessionID, String dataKey) throws TException 
	{	
//		java.util.Date start = new java.util.Date();
//		System.out.println(Server.ABPort + ": Get Value Start: " + start.getTime());
		if(sessionList.containsKey(sessionID)) {
			if (dataKey.equals("ab.user.creditcard")) {
				String policy = "policies/policy_creditcard_limit.xml";
				String req = "requests/req_creditcard_limit.xml";
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("#ABRESOURCE#", "ab.user.creditcard");
				params.put("#ABCLIENT#", "bankfpr");
				params.put("#ABENVIRONMENT#", "9999");
				String resp = PDP(policy, req, params);
				if (resp.equals("Permit") && !abData.isEmpty()) {
//					java.util.Date end = new java.util.Date();
//					System.out.println(Server.ABPort + ": Get Value End: " + end.getTime());
					System.out.println("AB: Data - " + ABServiceHandler.getABData(new String(dataKey)));
					return ABServiceHandler.getABData(new String(dataKey));
				} else return null;				
			} else if (dataKey.equals("ab.user.creditcard.type")) {
				String policy = "policies/policy_creditcard_type.xml";
				String req = "requests/req_creditcard_type.xml";
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("#ABRESOURCE#", "ab.user.creditcard.type");
				params.put("#ABCLIENT#", "ecomfpr");
				String resp = PDP(policy, req, params);
				if (resp.equals("Permit") && !abData.isEmpty()) {
//					java.util.Date end = new java.util.Date();
//					System.out.println(Server.ABPort + ": Get Value End: " + end.getTime());
					System.out.println("AB: Data - " + ABServiceHandler.getABData(new String(dataKey)));
					return ABServiceHandler.getABData(new String(dataKey));
				} else return null;			
			} else if (dataKey.equals("ab.user.shipping.preference")) {
				String policy = "policies/policy_shipping_preference.xml";
				String req = "requests/req_shipping_preference.xml";
				HashMap<String, String> params = new HashMap<String, String>();
				params.put("#ABRESOURCE#", "ab.user.shipping.preference");
				params.put("#ABCLIENT#", "shipfpr");
				String resp = PDP(policy, req, params);
				if (resp.equals("Permit") && !abData.isEmpty()) {
//					java.util.Date end = new java.util.Date();
//					System.out.println(Server.ABPort + ": Get Value End: " + end.getTime());
					System.out.println("AB: Data - " + ABServiceHandler.getABData(new String(dataKey)));
					return ABServiceHandler.getABData(new String(dataKey));
				} else return null;			
			} else {			
				if (!abData.isEmpty()) {
//					java.util.Date end = new java.util.Date();
//					System.out.println(Server.ABPort + ": Get Value End: " + end.getTime());
					System.out.println("AB: Data - " + ABServiceHandler.getABData(new String(dataKey)));
					return ABServiceHandler.getABData(new String(dataKey));
				} else return null;
			}
		}
		return null;			
	}

	/* Helper utilities */
	public static String generateToken()
	{	
		String id = UUID.randomUUID().toString();
		return id;    	
	}
	
	public String PDP(String policy, String req, HashMap<String, String> params)
	{
		InputStream policyStream = getClass().getClassLoader().getResourceAsStream(policy);
		InputStream reqStream = getClass().getClassLoader().getResourceAsStream(req);

		String polStr = streamToString(policyStream);
		StringBuffer sb = new StringBuffer(polStr);
		String polPath = null;
		try {
			polPath = writeToFile(sb);
		} catch (IOException e) {
			e.printStackTrace();
		}

		ABAccessController controller = new ABAccessController();
		String request = streamToString(reqStream);
		for (Map.Entry<String, String> entry : params.entrySet()) {
			request = request.replace(entry.getKey(), entry.getValue());
		}
		String res = controller.evaluate(polPath, request);
		return res;		 
	}

	private static String streamToString(java.io.InputStream is) {
		Scanner scanner = new Scanner(is);
		Scanner s = scanner.useDelimiter("\\A");
		String str = s.hasNext() ? s.next() : "";
		scanner.close();
		s.close();
		return str;
	}

	public static String writeToFile(StringBuffer sb) throws IOException {
		File tempFile = File.createTempFile("temp", ".tmp");
		FileWriter fileWriter = new FileWriter(tempFile, true);
		String tmpPath = tempFile.getAbsolutePath();
		BufferedWriter bw = new BufferedWriter(fileWriter);
		bw.write(sb.toString());
		bw.close();
		tempFile.deleteOnExit();
		return tmpPath;
	}

	private static String dataEncode(byte[] byteTok) throws Exception
	{
		return new BASE64Encoder().encode(byteTok);	
	}

	private static byte[] dataDecode(String strData) throws Exception
	{
		return new BASE64Decoder().decodeBuffer(strData);
	}

	public boolean append(String key, String data) throws TException
	{
		return true;
	}
}
