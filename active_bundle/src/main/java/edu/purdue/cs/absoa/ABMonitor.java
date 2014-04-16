package edu.purdue.cs.absoa;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

public class ABMonitor {

	private static URL monitor_state;
	private static URL monitor_log;
	
	public ABMonitor() throws Exception
	{
		monitor_state = new URL("http://localhost:7000/ab_state");
		monitor_log = new URL("http://localhost:7000/ab_log");
	}
	
	public boolean ABState() throws Exception
	{
		
        URLConnection abmon = monitor_state.openConnection();
        BufferedReader in = new BufferedReader(new InputStreamReader(abmon.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) 
            System.out.println(inputLine);
        in.close();
        
        return true;
	}
	
	public boolean ABLog() throws Exception
	{
        URLConnection abmon = monitor_log.openConnection();
        BufferedReader in = new BufferedReader(new InputStreamReader(abmon.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) 
            System.out.println(inputLine);
        in.close();
        
        return true;
	}
}
