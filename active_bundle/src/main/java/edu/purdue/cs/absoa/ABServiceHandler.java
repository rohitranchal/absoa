package edu.purdue.cs.absoa;

import java.security.*;
import java.security.cert.*;
import java.util.UUID;
import java.io.*;
import java.util.*;

import javax.crypto.*;

import sun.misc.BASE64Encoder;
import sun.misc.BASE64Decoder;

import org.apache.thrift.TException;

//import edu.purdue.cs.absoa.ABService.Iface;
import edu.purdue.cs.absoa.ABService;

public class ABServiceHandler implements ABService.Iface 
{
	private static Set<String> issuedTokenSet = new HashSet<String>();	
	private static HashMap<String, String> abData = new HashMap<String, String>();
	
	/**
	 * This is the list of sessions maintained by the Active Bundle with services it interacts with.
	 */
	private static HashMap<String, ABSession> sessionList = new HashMap<String, ABSession>();

	public static void setABData(String abkey, String abvalue)
	{
		abData.put(abkey, abvalue);
	}

	public static String getABData(String abkey)
	{
		return abData.get(abkey);
	}

	public String authenticateChallenge() throws TException
	{		
		String strTok = generateToken();
		System.out.println("Generated token: " + strTok);
		issuedTokenSet.add(strTok);
		String encodedTok;
		try {
			encodedTok = dataEncode(strTok.getBytes());
			//	System.out.println("Encoded token: " + encodedTok);
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
			//	System.out.println("Decode Chall: " + decodeChall);			
			byte[] decodeCert = dataDecode(certificate);
			//	System.out.println("Decode Cert: " + decodeCert);			
			byte[] decodeToken = dataDecode(challenge);

			//String storePath = "/Users/rohitranchal/Dropbox/Developer/workspace/absoa/keys/CA/ABCACert.cert";
			String storePath = "CA/ABCACert.cert";
			byte[] CACert = loadCertificateFile(storePath);

			if (validateSignature(decodeToken, decodeChall, decodeCert, CACert)) {
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
		ByteArrayInputStream bis = new ByteArrayInputStream(certificate);
		ObjectInput in = new ObjectInputStream(bis);
		X509Certificate cert = (X509Certificate) in.readObject(); 
		//System.out.println("service issued dn: " + cert.getIssuerDN());
		bis.close();			
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
				throw new CertificateException("Certificate not singed by AB CA",e);
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

			ByteArrayInputStream bis = new ByteArrayInputStream(serviceCert);
			ObjectInput in = new ObjectInputStream(bis);
			X509Certificate cert = (X509Certificate) in.readObject(); 
			bis.close();			
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
}
