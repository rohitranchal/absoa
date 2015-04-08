package edu.purdue.absoa;

import java.io.InputStream;
import java.security.MessageDigest;
import java.util.Base64.Encoder;

import javassist.ClassPool;
import javassist.CtClass;

public class ABIntegrity {
	private static byte[] initial_aggregate = null;
	private static byte[] aggregate = null;
	private static ClassPool classPool;
    private static MessageDigest md;
	
	public static void initialize() {
		try {
			classPool = ClassPool.getDefault();
			md = MessageDigest.getInstance("SHA-256");
			CtClass initClass = classPool.get("edu.purdue.absoa.Server");
		    md.update(initClass.toBytecode());
			aggregate = md.digest();
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	public static void setInitialAggregate() {
		initial_aggregate = aggregate.clone();
	}
	
	public static void restoreInitialAggregate() {
		aggregate = initial_aggregate.clone();
	}
	
	public static byte[] checkIntegrity(String input, String type) {
		try {
			if (type.equals("class")) {
				CtClass cls = classPool.get(input);				
			    md.update(cls.toBytecode());
			} else if (type.equals("file")) {
				InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(input);
				byte[] fb = new byte[is.available()];
			    is.read(fb);
			    is.close();
			    md.update(fb);
			} else if (type.equals("string")) {
				md.update(input.getBytes());
			}
		    byte[] digest = md.digest();

			for (int i = 0; i < aggregate.length; i++) {
	    	    aggregate[i] += digest[i];
			}
			return aggregate;
		} catch (Exception e){
			e.printStackTrace();
		}
		return null;
	}
}
