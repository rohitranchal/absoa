package edu.purdue.cs.absoa;
import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;
import java.io.FileInputStream;
import java.net.SocketException;

import java.security.*;
import java.security.cert.*;

import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;

import sun.misc.BASE64Encoder;
import sun.misc.BASE64Decoder;

import edu.purdue.cs.absoa.ABService;

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

			String encodedMsg = client.authenticateChallenge();
			//	System.out.println("Received token: " + encodedMsg);
			String strTok = dataDecode(encodedMsg);
			System.out.println("Decoded token: " + strTok);

			String signedChall = signData(strTok);
			//	System.out.println("Signed token: " + signedChall);			
			String encodeChall = dataEncode(signedChall);
			System.out.println("Encoded Signed token: " + encodeChall);

			String storePath = "/Users/rohitranchal/Dropbox/Developer/workspace/absoa/keys/service1/abstore.ks";			
			String serviceCert = loadCertificateStore(storePath);
			//	System.out.println("Certificate: " + serviceCert);			
			String encodeCert = dataEncode(serviceCert);
			//	System.out.println("Encoded Certificate: " + encodeCert);

			String encodedSessionID = client.authenticateResponse(encodedMsg, encodeChall, encodeCert);
			if(encodedSessionID != null) {
				String sessionID = dataDecode(encodedSessionID);
				if (sessionID != null) {
					System.out.println("Session ID received on Service: " + sessionID);
					String abName = client.getValue(encodedSessionID, dataEncode("ab.user.name"));
					String abZip = client.getValue(encodedSessionID, dataEncode("ab.user.zip"));
					String abData = client.getValue(encodedSessionID, dataEncode("ab.user.data"));
					System.out.println("AB Data Name: " + abName + " Zip: " + abZip + " Data: " + abData);
				}
			} else 	System.out.println("Null Session ID received on Service ");

			transport.close();
		} catch (TTransportException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		}
	}

	private String loadCertificateStore(String path) throws Exception
	{
		final FileInputStream storeFile = new FileInputStream(path);
		final KeyStore kStore = KeyStore.getInstance("JKS");
		String storePass = "absoa1";
		kStore.load(storeFile, storePass.toCharArray());
		X509Certificate serviceCert = (X509Certificate)kStore.getCertificate("service1");

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream out = new ObjectOutputStream(bos);   
		out.writeObject(serviceCert);
		byte[] data = bos.toByteArray(); 
		bos.close();		
		String strCert = new String(data);		

		return strCert;		
	}

	private String signData(String strMsg) throws Exception
	{
		// Specify the Keystore of the Service 
		KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
		char[] password = "absoa1".toCharArray();
		FileInputStream fStream;
		fStream = new FileInputStream("/Users/rohitranchal/Dropbox/Developer/workspace/absoa/keys/service1/abstore.ks");
		kStore.load(fStream, password);
		fStream.close();

		Key myKey =  kStore.getKey("service1", password);
		PrivateKey myPrivateKey = (PrivateKey)myKey;

		Signature mySign = Signature.getInstance("SHA256withRSA");
		mySign.initSign(myPrivateKey);
		mySign.update(strMsg.getBytes());
		byte[] byteSignedData = mySign.sign();	  
		return new String(byteSignedData);	
	}	

	private String dataEncode(String strData) throws Exception
	{
		byte[] byteTok = strData.getBytes("UTF8");		        
		return new BASE64Encoder().encode(byteTok);	
	}

	private String dataDecode(String strData) throws Exception
	{
		byte[] byteMsg = new BASE64Decoder().decodeBuffer(strData);
		return new String(byteMsg, "UTF8");		
	}

	public static void main(String[] args) throws Exception 
	{
		ABClient abClient = new ABClient();		
		abClient.invoke();
	}
}
