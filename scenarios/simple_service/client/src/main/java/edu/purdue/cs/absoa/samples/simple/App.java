package edu.purdue.cs.absoa.samples.simple;

/**
 * Hello world!
 * 
 */
public class App {
	
	/*
	 * Here we are sending the name of the user in the request.
	 * 
	 * When using an AB: The name will be added to the active bundle and sent.
	 * The request will not contain the name value in plain.
	 * 
	 */
	public static void main(String[] args) throws Exception {
		// Invoke service
		ServiceStub service = new ServiceStub(
				"http://localhost:8080/axis2/services/service");
		
		//TODO: Setup the AB and add it to the header 
//		service._getServiceClient().addHeader(header);
		
		String ret = service.sayHello("Alice");
		System.out.println(ret);
	}
}
