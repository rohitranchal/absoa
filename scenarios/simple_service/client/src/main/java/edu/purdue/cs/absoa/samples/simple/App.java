package edu.purdue.cs.absoa.samples.simple;

/**
 * Hello world!
 * 
 */
public class App {
	public static void main(String[] args) throws Exception {
		// Invoke service
		ServiceStub service = new ServiceStub(
				"http://localhost:8080/axis2/services/service");
		String ret = service.sayHello("Alice");
		System.out.println(ret);
	}
}
