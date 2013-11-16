package edu.purdue.cs.absoa.samples.simple;

import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;

import edu.purdue.cs.absoa.ABService;

public class Service {

	public String sayHello(String input) {
		System.out.println("Mark");

		TTransport transport;
		try {
			Thread.sleep(1000);
			transport = new TSocket("localhost", 5555);
			TProtocol protocol = new TBinaryProtocol(transport);
			ABService.Client client = new ABService.Client(protocol);
			transport.open();

			String encodedMsg = client.authenticateChallenge();
			System.out.println("Challenge from AB: " + encodedMsg);

			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "Hi : " + input + "!!!";
	}

}
