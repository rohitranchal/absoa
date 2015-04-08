package edu.purdue.absoa;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64.Decoder;

public class ABAuthentication {
	
	private static PublicKey pubKey;
	
	public ABAuthentication() {
		try {
			InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("CA_PK");
			byte[] pkBytes = new byte[is.available()];
		    is.read(pkBytes);
		    is.close();
		    ABIntegrity.checkIntegrity("CA_PK", "file");
		    Decoder decoder = java.util.Base64.getDecoder();
	    	byte[] pkb = decoder.decode(pkBytes);		    
		    X509EncodedKeySpec pkSpec = new X509EncodedKeySpec(pkb);
		    KeyFactory factory = KeyFactory.getInstance("RSA");
		    pubKey = (PublicKey)factory.generatePublic(pkSpec);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	public boolean authenticate(String request, byte[] signature, byte[] certificate) {
		try {
			InputStream is = new ByteArrayInputStream(certificate);
			CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
			X509Certificate cert = (X509Certificate)certFactory.generateCertificate(is);
			is.close();
			cert.checkValidity();
			cert.verify(pubKey);
			
			PublicKey pk = cert.getPublicKey();
			Signature verifySign = Signature.getInstance("SHA256withRSA");
			verifySign.initVerify(pk);
			verifySign.update(request.getBytes("UTF-8"));
			return verifySign.verify(signature);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return false;
	}	
}
