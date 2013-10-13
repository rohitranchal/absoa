package edu.purdue.cs.absoa;

import java.util.UUID;

import org.apache.thrift.TException;

//import edu.purdue.cs.absoa.ABService.Iface;
import edu.purdue.cs.absoa.ABService;

public class ABServiceHandler implements ABService.Iface 
{
	public String authenticateChallenge() throws TException 
	{
		String tok = generateToken();
		// save token
		return tok;		
	}

	public String authenticateResponse(String signedChallenge, String certificate) throws TException 
	{
		// verify the signed token using the certificate
		// generate a sessID and save it in a table with whom the session was created
		// base 64 encoded
		String sessionID = generateToken();
		return sessionID;
	}
	
	public String getValue(String certificate, String sessionID, String key) throws TException {
		return null;
	}	
	
	public String generateToken()
	{	
    	String id = UUID.randomUUID().toString();
    	return id;    	
    }

	
}
