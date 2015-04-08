package edu.purdue.absoa;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;
import java.util.HashMap;
import java.util.Iterator;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.thrift.TException;
import org.json.JSONObject;

public class ABServiceHandler implements ABService.Iface {

	private static HashMap<String, String> abData;
	ABVerification abv;
	private static SecretKeySpec skey;    				
	private static Cipher cipher;
	private static int secret_mode = 0;
	Decoder decoder;

	public ABServiceHandler() {
		abData = new HashMap<String, String>();
		decoder = java.util.Base64.getDecoder();
				
		try {
			InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("cipher.json");
			BufferedReader streamReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			StringBuilder responseStrBuilder = new StringBuilder();
			String inputStr;
			while ((inputStr = streamReader.readLine()) != null) {
				responseStrBuilder.append(inputStr);
			}
			JSONObject jObj = new JSONObject(responseStrBuilder.toString());
			Iterator<?> keys = jObj.keys();
			while(keys.hasNext()) {
				String key = (String)keys.next();
				String value = jObj.getString(key);
				abData.put(key, value);					
			}
			ABIntegrity.initialize();
			abv = new ABVerification();
			ABIntegrity.setInitialAggregate();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String getValue(String request, String signature, String certificate) throws TException {
		ABIntegrity.restoreInitialAggregate();
		byte[] sig = decoder.decode(signature);
		byte[] cert = decoder.decode(certificate);
		if (abv.verify(request, sig, cert)) {
			byte[] secret = ABIntegrity.checkIntegrity("edu.purdue.absoa.ABVerification", "class");
			if (secret_mode == 1) {
				generateSecret(request, secret);
				return "Secret generated for request: " + request;
			} else {
				return disseminate(request, secret);	
			}    		    		
		} else {
			return null;
		}
	}

	private static String disseminate(String request, byte[] secret) {	
		try {
			skey = new SecretKeySpec(secret, "AES");			
			cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
			Decoder decoder = java.util.Base64.getDecoder();
			byte[] ct = decoder.decode(getABData(request));
			cipher.init(Cipher.DECRYPT_MODE, skey);
			byte[] pt = cipher.doFinal(ct);
			return new String(pt, "UTF-8");
		} catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}

	public static void generateSecret(String request, byte[] secret) {
		Encoder encoder = java.util.Base64.getEncoder();
		byte[] encSec  = encoder.encode(secret);	
		try {
			Files.write(Paths.get(request),encSec);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static String getABData(String abkey)
	{
		return abData.get(abkey);
	}
}
