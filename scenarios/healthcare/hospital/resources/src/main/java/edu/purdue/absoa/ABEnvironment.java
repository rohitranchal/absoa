package edu.purdue.absoa;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;

public class ABEnvironment {
	
	private static String monitorAddress = "http://localhost:3000";

	public static String getServiceTrust(String serviceName) {
		try {
			URL url = new URL(monitorAddress + "/get_service_trust?service_name=" + serviceName);
			URI uri = new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), url.getQuery(), url.getRef());
			url = uri.toURL();
			URLConnection connection = url.openConnection();
			BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine = null, result = null;
	        while ((inputLine = br.readLine()) != null) {
	        	result = inputLine;
	        }
	        br.close();
			return result;
		} catch (Exception e) {
			e.printStackTrace();			
		}
		return null;
	}
	
	public static String getServiceContext(String serviceName) {
		try {
			URL url = new URL(monitorAddress + "/get_service_context?service_name=" + serviceName);
			URI uri = new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), url.getQuery(), url.getRef());
			url = uri.toURL();
			URLConnection connection = url.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine = null, result = null;
	        while ((inputLine = in.readLine()) != null) {
	        	result = inputLine;
	        }
	        in.close();
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}	
}
