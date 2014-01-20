package edu.purdue.cs.absoa.samples.simple;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.X509Certificate;
import java.util.Iterator;

import javax.crypto.Cipher;
import javax.xml.namespace.QName;

import org.apache.axiom.om.OMElement;
import org.apache.axis2.context.MessageContext;
import org.apache.axis2.description.AxisService;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import edu.purdue.cs.absoa.ABObject;
import edu.purdue.cs.absoa.ABService;

public class MainService {

	public String sayHello(String input) {

		MessageContext msgCtx = MessageContext.getCurrentMessageContext();
		AxisService myService = msgCtx.getAxisService();
		ClassLoader clsLoader = myService.getClassLoader();

		Integer abPort = (Integer) msgCtx.getOptions().getProperty("abPort");

		System.out.println("Mark");

		TTransport transport;
		try {
			transport = new TSocket("localhost", abPort.intValue());
			TProtocol protocol = new TBinaryProtocol(transport);
			ABService.Client client = new ABService.Client(protocol);
			transport.open();

			String encodedMsg = client.authenticateChallenge();
			// System.out.println("Received token: " + encodedMsg);
			byte[] tok = dataDecode(encodedMsg);
			System.out.println("Decoded token: " + tok);

			byte[] signedChall = signData(clsLoader, tok);
			// System.out.println("Signed token: " + signedChall);
			String encodedSignedChall = dataEncode(signedChall);
			System.out.println("Encoded Signed token: " + encodedSignedChall);

			String storePath = "service1/abstore.ks";
			byte[] serviceCert = loadCertificateStore(clsLoader, storePath);
			// System.out.println("Certificate: " + serviceCert);
			String encodeCert = dataEncode(serviceCert);
			// System.out.println("Encoded Certificate: " + encodeCert);

			// String encodedSessionID = client.authenticateResponse(encodedMsg,
			// encodedSignedChall, encodeCert);
			ABObject abSessionObject = client.authenticateResponse(encodedMsg,
					encodedSignedChall, encodeCert);

			System.out.println("AB Object received on service: "
					+ abSessionObject.sessionID + abSessionObject.sessionKey);

			KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
			char[] password = "absoa1".toCharArray();
			InputStream fStream;
			try {
				fStream = clsLoader.getResourceAsStream("service1/abstore.ks");
				kStore.load(fStream, password);
				fStream.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			Key myKey = kStore.getKey("service1", password);
			PrivateKey myPrivateKey = (PrivateKey) myKey;

			if (abSessionObject != null) {
				byte[] sessionKey = dataDecode(abSessionObject.sessionKey);
				byte[] decryptedText = null;
				try {
					final Cipher cipher = Cipher.getInstance("RSA");
					cipher.init(Cipher.DECRYPT_MODE, myPrivateKey);
					decryptedText = cipher.doFinal(sessionKey);
				} catch (Exception ex) {
					ex.printStackTrace();
				}
				System.out.println("Session key received on Service: "
						+ new String(decryptedText));
				String state = client.getValue(abSessionObject.sessionID,
						"state");
				String zip = client.getValue(abSessionObject.sessionID, "zip");
				System.out.println("AB Data State: " + state + " Zip: " + zip);
			} else {
				System.out.println("Null Session ID received on Service ");
			}

			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "Hi : " + input + "!!!";
	}

	public String bookService(String input) {

		MessageContext msgCtx = MessageContext.getCurrentMessageContext();
		AxisService myService = msgCtx.getAxisService();
		ClassLoader clsLoader = myService.getClassLoader();

		Integer abPort = (Integer) msgCtx.getOptions().getProperty("abPort");

		System.out.println("BookService");

		String ABReturn = "";
		OMElement abHeader = null;

		TTransport transport;
		try {
			System.out.println("localhost: "+abPort.intValue());
			transport = new TSocket("localhost", abPort.intValue());
			TProtocol protocol = new TBinaryProtocol(transport);
			ABService.Client client = new ABService.Client(protocol);
			transport.open();

			String encodedMsg = client.authenticateChallenge();
			byte[] tok = dataDecode(encodedMsg);
			System.out.println("Decoded token: " + tok);

			byte[] signedChall = signData(clsLoader, tok);
			String encodedSignedChall = dataEncode(signedChall);
			System.out.println("Encoded Signed token: " + encodedSignedChall);

			String storePath = "service1/abstore.ks";
			byte[] serviceCert = loadCertificateStore(clsLoader, storePath);
			String encodeCert = dataEncode(serviceCert);
			
			ABObject abSessionObject = client.authenticateResponse(encodedMsg,
					encodedSignedChall, encodeCert);
			System.out.println("AB Object received on service: "
					+ abSessionObject.sessionID + abSessionObject.sessionKey);

			KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
			char[] password = "absoa1".toCharArray();
			InputStream fStream;
			try {
				fStream = clsLoader.getResourceAsStream("service1/abstore.ks");
				kStore.load(fStream, password);
				fStream.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			Key myKey = kStore.getKey("service1", password);
			PrivateKey myPrivateKey = (PrivateKey) myKey;

			if (abSessionObject != null) {
				byte[] sessionKey = dataDecode(abSessionObject.sessionKey);
				byte[] decryptedText = null;
				try {
					final Cipher cipher = Cipher.getInstance("RSA");
					cipher.init(Cipher.DECRYPT_MODE, myPrivateKey);
					decryptedText = cipher.doFinal(sessionKey);
				} catch (Exception ex) {
					ex.printStackTrace();
				}
				System.out.println("Session key received on Service: "
						+ new String(decryptedText));

				
				// Pretend to extract information from AB as a normal service
				String name = client
						.getValue(abSessionObject.sessionID, "name");
				String id = client.getValue(abSessionObject.sessionID, "id");

				
				// Check if each service is requested by the client
				String check_service = "";
				if ((check_service=client
						.getValue(abSessionObject.sessionID, "flight_service")).equals("true")) {
					
					System.out.println("MainService Name: flight_service");
					
					edu.purdue.cs.absoa.samples.simple.ServiceStub service = new edu.purdue.cs.absoa.samples.simple.ServiceStub(
							"http://localhost:8081/axis2/services/flight_service");
					// Retrieve the active bundle
					Iterator abHeaderIt = msgCtx
							.getEnvelope()
							.getHeader()
							.getChildrenWithName(
									new QName("http://absoa.cs.purdue.edu/ns/",
											"ActiveBundle", "ab"));
					if(abHeaderIt.hasNext()){
						 abHeader = (OMElement) abHeaderIt.next();
					}
					else{
						System.err.println("MainService: ActiveBundle header not present!");
					}
					
					// Add AB as header
					service._getServiceClient().addHeader(abHeader);
					ABReturn = service.flightService("flight");
				}

			} else {
				System.out.println("Null Session ID received on Service ");
			}

			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ABReturn;
	}

	private byte[] loadCertificateStore(ClassLoader clsLoader, String path)
			throws Exception {
		// final FileInputStream storeFile = new FileInputStream(path);
		final InputStream storeFile;
		storeFile = clsLoader.getResourceAsStream(path);

		final KeyStore kStore = KeyStore.getInstance("JKS");
		String storePass = "absoa1";
		kStore.load(storeFile, storePass.toCharArray());
		X509Certificate serviceCert = (X509Certificate) kStore
				.getCertificate("service1");

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream out = new ObjectOutputStream(bos);
		out.writeObject(serviceCert);
		byte[] data = bos.toByteArray();
		bos.close();
		return data;
	}

	private byte[] signData(ClassLoader clsLoader, byte[] msg) throws Exception {
		KeyStore kStore = KeyStore.getInstance(KeyStore.getDefaultType());
		char[] password = "absoa1".toCharArray();
		InputStream fStream;
		try {
			fStream = clsLoader.getResourceAsStream("service1/abstore.ks");
			kStore.load(fStream, password);
			fStream.close();

			Key myKey = kStore.getKey("service1", password);
			PrivateKey myPrivateKey = (PrivateKey) myKey;

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

	private String dataEncode(byte[] byteTok) throws Exception {
		return new BASE64Encoder().encode(byteTok);
	}

	private byte[] dataDecode(String strData) throws Exception {
		return new BASE64Decoder().decodeBuffer(strData);
	}

}
