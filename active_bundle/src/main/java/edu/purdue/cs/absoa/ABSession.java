package edu.purdue.cs.absoa;

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
}