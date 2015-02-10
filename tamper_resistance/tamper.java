import java.security.MessageDigest;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;
import javax.crypto.SealedObject;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;

//somewhere in the constructor
Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

/////////////////////////////


byte[] hash = null; /*this holds the hash of the whole bytecode for the HelloHandler class*/


/*Get the whole bytecode for the class and generate a hash using SHA-256*/

try {
	ClassPool classPool = ClassPool.getDefault();
    CtClass cls = classPool.get("HelloHandler");
    byte[] bytecode = cls.toBytecode();
                        
    MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
    messageDigest.update(bytecode);
    hash = messageDigest.digest();
                        
    /*I was using a simple running sum of the hash values at each point to construct the key, but we will modify this */
	for (int i = 0; i < agent.gHash.length; i++) {
    	    agent.gHash[i] += hash[i];
    }
                        
} catch (Exception e){e.printStackTrace();}
           


/*This is where the content is encrypted using AES and the hash as the key */
byte[] ciphertext = null;
SealedObject so = null;

try {
            
	byte[] ivBytes = new byte[]{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
    SecretKeySpec   key = new SecretKeySpec(agent.gHash, "AES");
    IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding", "BC");
    cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
            
    
	//The content is in res           
	String res = numSolutions + "";
                
    so = new SealedObject(res, cipher);
            
} catch(Exception e){e.printStackTrace();}
           




//Decryption

SealedObject responseMsg = (SealedObject) bridge.sendMessage(msg, 1000000); //Here the content comes as a SealedObject

byte[] ivBytes = new byte[]{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
SecretKeySpec   key = new SecretKeySpec(gHash, "AES");
IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding", "BC");
cipher.init(Cipher.DECRYPT_MODE, key, ivSpec);
                
String res = (String) responseMsg.getObject(cipher);



//This loads the class into JVM if not loaded already
ClassLoader myClassLoader = ClassLoader.getSystemClassLoader();
Class myClass = myClassLoader.loadClass("HelloHandler");

/* A simple case of tampering with a method of the HelloHandler class */

//tamper//
try {
	ClassPool classPool = ClassPool.getDefault();
    CtClass cls = classPool.get("HelloHandler");
    cls.defrost();
    CtMethod method = cls.getDeclaredMethod("getNumSolutions");                            
	method.insertBefore("{System.out.println(\"code injected\");}"); /* This inserts a print statement at the beginning of the method */
} catch (Exception e){e.printStackTrace();}
//end tamper//