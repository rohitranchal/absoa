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
	private static HashMap<String, String> sessionIDList = new HashMap<String, String>();
	private static Set<String> issuedTokenSet = new HashSet<String>();	
	private static HashMap<String, String> abData = new HashMap<String, String>();

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
			encodedTok = dataEncode(strTok);
			//	System.out.println("Encoded token: " + encodedTok);
			return encodedTok;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}				
	}

	public String authenticateResponse(String token, String signedChallenge, String certificate) throws TException 
	{		
		try {
			System.out.println("Encoded Signed Chall: " + signedChallenge);
			String decodeChall = dataDecode(signedChallenge);
			//	System.out.println("Decode Chall: " + decodeChall);			
			String decodeCert = dataDecode(certificate);
			//	System.out.println("Decode Cert: " + decodeCert);			
			String decodeToken = dataDecode(token);

			String storePath = "/Users/rohitranchal/Dropbox/Developer/workspace/absoa/keys/CA/ABCACert.cert";			
			String CACert = loadCertificateFile(storePath);

			if (validateSignature(decodeToken, decodeChall, decodeCert, CACert)) {
				String sessionID = generateSessionKey(decodeCert);
			//	System.out.println("Session ID Created: " + sessionID);
				//sessionIDList.put(certificate, sessionID);
				sessionIDList.put(sessionID, decodeCert); // we need to look up this cert based on session ID
				return dataEncode(sessionID);
			} else return null;
		} catch (Exception e) {
			e.printStackTrace();			
			return null;
		}		
	}

	private String loadCertificateFile(String path) throws Exception
	{
		CertificateFactory certificatefactory = CertificateFactory.getInstance("X.509");
		final FileInputStream certFile = new FileInputStream(path);
		X509Certificate caCert = (X509Certificate)certificatefactory.generateCertificate(certFile);
		/*
		System.out.println("---Certificate---");
        System.out.println("type = " + caCert.getType());
        System.out.println("version = " + caCert.getVersion());
        System.out.println("subject = " + caCert.getSubjectDN().getName());
        System.out.println("valid from = " + caCert.getNotBefore());
        System.out.println("valid to = " + caCert.getNotAfter());
        System.out.println("serial number = " + caCert.getSerialNumber().toString(16));
        System.out.println("issuer = " + caCert.getIssuerDN().getName());
        System.out.println("signing algorithm = " + caCert.getSigAlgName());
        System.out.println("public key algorithm = " + caCert.getPublicKey().getAlgorithm());
		certFile.close();
		 */
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream out = new ObjectOutputStream(bos);   
		out.writeObject(caCert);
		byte[] data = bos.toByteArray(); 
		bos.close();		
		String strCert = new String(data);				
		return strCert;			
	}

	private static boolean validateSignature(String token, String signedMessage, String certificate, String CAcertificate) throws Exception
	{
		ByteArrayInputStream bis = new ByteArrayInputStream(certificate.getBytes());
		ObjectInput in = new ObjectInputStream(bis);
		X509Certificate cert = (X509Certificate) in.readObject(); 
		//System.out.println("service issued dn: " + cert.getIssuerDN());
		bis.close();			
		try {
			cert.checkValidity(); // checks that the cert is valid against current datatime
		} catch(Exception e) {
			throw new CertificateException("Service Certificate has expired",e);
		}

		ByteArrayInputStream cabis = new ByteArrayInputStream(CAcertificate.getBytes());
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
			if (issuedTokenSet.contains(token)) {
				verifySign.update(token.getBytes());
				return verifySign.verify(signedMessage.getBytes());					
			} else System.out.println("Wrong token");			
		} else System.out.println("Service Issuer doesn't match CA Subject");

		return false;		
	}

	private static String generateSessionKey(String serviceCert)
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

			ByteArrayInputStream bis = new ByteArrayInputStream(serviceCert.getBytes());
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
			
			
			
			String strKey = new String(cipherText);
			return strKey;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public String getValue(String sessionID, String abDataKey) throws TException 
	{	
		try {
			String decodedID = dataDecode(sessionID);
			String decodedABKey = dataDecode(abDataKey);
			/*
		if(sessionIDList.containsKey(decodedID)) {
			String serviceCert = sessionIDList.get(sessionID);

			ByteArrayInputStream bis = new ByteArrayInputStream(serviceCert.getBytes());
			ObjectInput in = new ObjectInputStream(bis);
			X509Certificate cert = (X509Certificate) in.readObject(); 
			bis.close();

			decodedABKey.verify(cert.getPublicKey());			
		}
			 */
			if(sessionIDList.containsKey(decodedID)) {
				if(!abData.isEmpty()) return ABServiceHandler.getABData(decodedABKey);
				else return null;
			} else return null;	
		} catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}	

	public static String generateToken()
	{	
		String id = UUID.randomUUID().toString();
		return id;    	
	}

	private static String dataEncode(String strData) throws Exception
	{
		byte[] byteTok = strData.getBytes("UTF8");		        
		return new BASE64Encoder().encode(byteTok);	
	}

	private static String dataDecode(String strData) throws Exception
	{
		byte[] byteMsg = new BASE64Decoder().decodeBuffer(strData);
		return new String(byteMsg, "UTF8");		
	}
}
