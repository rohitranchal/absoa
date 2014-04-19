package edu.purdue.cs.absoa;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.X509Certificate;

import javax.crypto.Cipher;

import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class ABClient 
{
	private void invoke() throws Exception
	{
		TTransport transport;
		try {
			transport = new TSocket("localhost", 5555);
			TProtocol protocol = new TBinaryProtocol(transport);
			ABService.Client client = new ABService.Client(protocol);
			transport.open();

			ABSLA abSLA = client.getSLA();			
			System.out.println("AB SLA num requests: " + abSLA.numRequests);			
			
			String encodedMsg = client.authenticateChallenge();
			//	System.out.println("Received token: " + encodedMsg);
			byte[] tok = dataDecode(encodedMsg);
			System.out.println("Decoded token: " + tok);

			byte[] signedChall = signData(tok);
				System.out.println("Signed token: " + signedChall);			
			String encodedSignedChall = dataEncode(signedChall);
			System.out.println("Encoded Signed token: " + encodedSignedChall);			

			String storePath = "service1/abstore.ks";			
			byte[] serviceCert = loadCertificateStore(storePath);
			//	System.out.println("Certificate: " + serviceCert);			
			String encodeCert = dataEncode(serviceCert);
			//	System.out.println("Encoded Certificate: " + encodeCert);

			//String encodedSessionID = client.authenticateResponse(encodedMsg, encodedSignedChall, encodeCert);
			ABObject abSessionObject = client.authenticateResponse(encodedMsg, encodedSignedChall, encodeCert);
			
			System.out.println("AB Object received on service: " + abSessionObject.sessionID + abSessionObject.sessionKey);

			KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
			char[] password = "absoa1".toCharArray();			
			InputStream fStream;			
			try {
				fStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("service1/abstore.ks");
				kStore.load(fStream, password);
				fStream.close();
			} catch(Exception e) {
				e.printStackTrace();
			}			
			Key myKey =  kStore.getKey("service1", password);
			PrivateKey myPrivateKey = (PrivateKey)myKey;

			if(abSessionObject != null) {
				byte[] sessionKey = dataDecode(abSessionObject.sessionKey);
				byte[] decryptedText = null;
				try {
					final Cipher cipher = Cipher.getInstance("RSA");
					cipher.init(Cipher.DECRYPT_MODE, myPrivateKey);
					decryptedText = cipher.doFinal(sessionKey);
				} catch (Exception ex) {
					ex.printStackTrace();
				}					
				System.out.println("Session key received on Service: " + new String(decryptedText));
				String abName = client.getValue(abSessionObject.sessionID, "ab.user.name");
				String abAddr = client.getValue(abSessionObject.sessionID, "ab.user.shipping.address");
				String abShipPref = client.getValue(abSessionObject.sessionID, "ab.user.shipping.preference");
				String abCCard = client.getValue(abSessionObject.sessionID, "ab.user.creditcard");
				String abCCardType = client.getValue(abSessionObject.sessionID, "ab.user.creditcard.type");
				System.out.println("AB Data Name: " + abName + " Addr: " + abAddr + " CCard: " + abCCard + " CardType: " + abCCardType + " ShipPref: " + abShipPref);
				//System.out.println("AB Data Name: " + abName + " Addr: " + abAddr + " CCard: " + abCCard + " CardType: " + abCCardType);
			} else 	System.out.println("Null Session ID received on Service ");

			transport.close();
		} catch (TTransportException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		}
	}	

	private byte[] loadCertificateStore(String path) throws Exception
	{
		final InputStream storeFile;			
		storeFile = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);

		final KeyStore kStore = KeyStore.getInstance("JKS");
		String storePass = "absoa1";
		kStore.load(storeFile, storePass.toCharArray());
		X509Certificate serviceCert = (X509Certificate)kStore.getCertificate("service1");

		//ByteArrayOutputStream bos = new ByteArrayOutputStream();
		OutputStream bos = new ByteArrayOutputStream();
		//ObjectOutputStream out = new ObjectOutputStream(bos); 
		bos.write(serviceCert.getEncoded());
		//out.writeObject(serviceCert);
		//byte[] data = bos.toByteArray();
		byte[] data = bos.toString().getBytes();
		bos.close();
		return data;
	}

	private byte[] signData(byte[] msg) throws Exception
	{
		KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
		char[] password = "absoa1".toCharArray();
		InputStream fStream;
		try {
			fStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("service1/abstore.ks");
			kStore.load(fStream, password);
			fStream.close();

			Key myKey =  kStore.getKey("service1", password);
			PrivateKey myPrivateKey = (PrivateKey)myKey;

			Signature mySign = Signature.getInstance("SHA256withRSA");
			mySign.initSign(myPrivateKey);
			mySign.update(msg);
			byte[] byteSignedData = mySign.sign();	  
			return byteSignedData;
		} catch (Exception e) {			
			e.printStackTrace();
		}
		return null;	
	}

	private String dataEncode(byte[] byteTok) throws Exception
	{
		return new BASE64Encoder().encode(byteTok);	
	}

	private byte[] dataDecode(String strData) throws Exception
	{
		return new BASE64Decoder().decodeBuffer(strData);
	}

	public static void main(String[] args) throws Exception 
	{
		ABClient abClient = new ABClient();		
		abClient.invoke();
	}
}
