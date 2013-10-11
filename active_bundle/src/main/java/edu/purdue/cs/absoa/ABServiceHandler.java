package edu.purdue.cs.absoa;

import java.util.UUID;

import org.apache.thrift.TException;

import edu.purdue.cs.absoa.ABService.Iface;
//import edu.purdue.cs.absoa.*;

public class ABServiceHandler implements ABService.Iface 
{
	public String authenticate(String str) throws TException 
	{
		return generateToken() + " " + str;		
	}

	public String hello(String str) throws TException 
	{
		if (str == "hello") return "hi";
		else return "bye";
	}
	
	public String generateToken()
	{	
    	String id = UUID.randomUUID().toString();
    	return id;    	
    }
}
