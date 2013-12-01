package edu.purdue.cs.absoa;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.net.URL;

public class ABSession 
{
	private static byte[] sessionKey;
	private static byte[] serviceCert;
	
	public void setSessionKey(byte[] sKey)
	{
		sessionKey = sKey;
	}

	public byte[] getSessionKey()
	{
		return sessionKey;
	}

	public void setServiceCert(byte[] sCert)
	{
		serviceCert = sCert;
	}

	public byte[] getServiceCert()
	{
		return serviceCert;
	}	
	
	public static String serialize(String data) 
	{
		java.util.Date date= new java.util.Date();
		System.out.println("Serialize Time: " + date);
		
		String filename = "Logs.xml";		
		URL url =Thread.currentThread().getContextClassLoader().getResource(filename);		
		try {
		    BufferedWriter out = new BufferedWriter(new FileWriter(url.getFile()));
		    out.write(date.toString());
		    out.flush();
		    out.close();
		} catch (Exception e) {
		    e.printStackTrace();
		}	
		return date.toString();
	}
	
}