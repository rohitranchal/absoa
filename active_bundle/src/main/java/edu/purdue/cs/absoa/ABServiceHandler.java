package edu.purdue.cs.absoa;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.apache.thrift.TException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
//import edu.purdue.cs.absoa.ABService.Iface;

public class ABServiceHandler implements ABService.Iface 
{
	private static Set<String> issuedTokenSet = new HashSet<String>();	
	private static HashMap<String, String> abData = new HashMap<String, String>();
	private static HashMap<String, String> abSLA = new HashMap<String, String>();
	private static HashMap<String, ABSession> sessionList = new HashMap<String, ABSession>();
	private static boolean mode; // For node, this mode set to 1

	public ABServiceHandler()
	{
		/*
		 * Read data and sla from respective files
		 */
		mode = true;
		InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("data.txt");
		//System.out.println(is == null);	
		ABDataParser parser = new ABDataParser(is, "data");		
		try {
			parser.processLineByLine();

			is = Thread.currentThread().getContextClassLoader().getResourceAsStream("sla.txt");
			parser = new ABDataParser(is, "sla");
			parser.processLineByLine();

			/*
			 * Check policy requirements
			 */		
			Date currDate = new Date();
			String expiration = getABSLA("ab.expiretime");
			Date expireDate = new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss", Locale.ENGLISH).parse(expiration);
			if (currDate.compareTo(expireDate) > 0)
			{
				System.out.println("currDate is after expireDate");
				// Need to do exit here and AB should delete itself
				System.exit(1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}		


	}

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

	public String authenticateChallenge() throws TException
	{	
		String strTok = generateToken();
		//String strTok = "active bundle";
		System.out.println("Generated token: " + strTok);
		issuedTokenSet.add(strTok);
		String encodedTok;
		try {
			encodedTok = dataEncode(strTok.getBytes());
			//	System.out.println("Encoded token: " + encodedTok);
			ABSession abs = new ABSession();
			String dt = abs.serialize(strTok);
			return encodedTok;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}		
	}

	public ABObject authenticateResponse(String challenge, String signedChallenge, String certificate) throws TException 
	{		
		try {
			System.out.println("Encoded Signed Chall: " + signedChallenge);
			byte[] decodeChall = dataDecode(signedChallenge);
			System.out.println("Decode Chall: " + decodeChall);			
			byte[] decodeCert = dataDecode(certificate);
			System.out.println("Decode Cert: " + decodeCert);			
			byte[] decodeToken = dataDecode(challenge);

			//String storePath = "/Users/rohitranchal/Dropbox/Developer/workspace/absoa/keys/CA/ABCACert.cert";
			String storePath = "CA/ABCACert.cert";
			byte[] CACert = loadCertificateFile(storePath);

			if (validateSignature(decodeToken, decodeChall, decodeCert, CACert)) {
				System.out.println("Token sign and Service cert verified");
				byte[] sessionKey = generateSessionKey(decodeCert);
				String sessionID = generateToken();				
				//	System.out.println("Session ID Created: " + sessionID);
				//sessionIDList.put(certificate, sessionID);				
				ABSession abs = new ABSession();
				abs.setSessionKey(sessionKey);
				abs.setServiceCert(decodeCert);
				// we need to look up this cert based on session ID
				sessionList.put(sessionID, abs); 				
				ABObject abo = new ABObject(sessionID, dataEncode(sessionKey));

				return abo;
				//return dataEncode(sessionID);
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
		//final FileInputStream certFile = new FileInputStream(path);
		final InputStream certFile;			
		certFile = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
		X509Certificate caCert = (X509Certificate)certificatefactory.generateCertificate(certFile);
		//		
		//		System.out.println("---Certificate---");
		//        System.out.println("type = " + caCert.getType());
		//        System.out.println("version = " + caCert.getVersion());
		//        System.out.println("subject = " + caCert.getSubjectDN().getName());
		//        System.out.println("valid from = " + caCert.getNotBefore());
		//        System.out.println("valid to = " + caCert.getNotAfter());
		//        System.out.println("serial number = " + caCert.getSerialNumber().toString(16));
		//        System.out.println("issuer = " + caCert.getIssuerDN().getName());
		//        System.out.println("signing algorithm = " + caCert.getSigAlgName());
		//        System.out.println("public key algorithm = " + caCert.getPublicKey().getAlgorithm());

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
		X509Certificate cert;
		
		if (mode) {			
			InputStream bis = new ByteArrayInputStream(certificate); 
			//Certificate cert = CertificateFactory.getInstance("X.509").generateCertificate(bis);
			CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
			cert = (X509Certificate)certFactory.generateCertificate(bis);			
			bis.close();			
		} else {
			ByteArrayInputStream bis = new ByteArrayInputStream(certificate);
			ObjectInput in = new ObjectInputStream(bis);
			cert = (X509Certificate) in.readObject(); 
			//System.out.println("service issued dn: " + cert.getIssuerDN());
			bis.close(); 
		}
		
		try {
			cert.checkValidity(); // checks that the cert is valid against current datatime
		} catch(Exception e) {
			throw new CertificateException("Service Certificate has expired",e);
		}

		ByteArrayInputStream cabis = new ByteArrayInputStream(CAcertificate);
		ObjectInput cain = new ObjectInputStream(cabis);
		X509Certificate cacert = (X509Certificate) cain.readObject(); 
		//System.out.println("CA subject dn: " + cacert.getSubjectDN());
		cabis.close();  

		if(cert.getIssuerDN().equals(cacert.getSubjectDN())) {
			try {
				cert.verify(cacert.getPublicKey());                             
			} catch(Exception e) {
				throw new CertificateException("Certificate not signed by AB CA",e);
			}

			PublicKey pubKey = cert.getPublicKey();
			Signature verifySign = Signature.getInstance("SHA256withRSA");
			verifySign.initVerify(pubKey);
			//verifySign.update(tokenList.get("service1").getBytes());
			if (issuedTokenSet.contains(new String(token))) {
				verifySign.update(token);
				return verifySign.verify(signedMessage);                                        
			} else System.out.println("Wrong token");                       
		} else System.out.println("Service Issuer doesn't match CA Subject");

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

			System.out.println("Session Key created on server: " + new String(data));

			X509Certificate cert;
			if (mode) {
				InputStream bis = new ByteArrayInputStream(serviceCert); 
				CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
				cert = (X509Certificate)certFactory.generateCertificate(bis);			
				bis.close();
			} else {
				ByteArrayInputStream bis = new ByteArrayInputStream(serviceCert);
				ObjectInput in = new ObjectInputStream(bis);
				cert = (X509Certificate) in.readObject(); 
				bis.close();			
			}

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
		if(sessionList.containsKey(sessionID)) {
			if(!abData.isEmpty()) return ABServiceHandler.getABData(new String(dataKey));
			else return null;
		} else 
			return null;			
	}	

	public static String generateToken()
	{	
		String id = UUID.randomUUID().toString();
		return id;    	
	}

	private static String dataEncode(byte[] byteTok) throws Exception
	{
		return new BASE64Encoder().encode(byteTok);	
	}

	private static byte[] dataDecode(String strData) throws Exception
	{
		return new BASE64Decoder().decodeBuffer(strData);
	}

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
}
