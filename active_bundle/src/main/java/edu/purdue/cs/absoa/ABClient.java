package edu.purdue.cs.absoa;
import java.net.SocketException;
import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;

import edu.purdue.cs.absoa.ABService;

public class ABClient 
{
	private void invoke() 
	{
		TTransport transport;
		try {
			transport = new TSocket("localhost", 5555);

			TProtocol protocol = new TBinaryProtocol(transport);

			ABService.Client client = new ABService.Client(protocol);
			transport.open();

			String tok = client.authenticate("trying auth");
			System.out.println("Authenticate token: " + tok);
			String hello = client.hello("hello");
			System.out.println("Server said: " + hello);
			
			transport.close();
		} catch (TTransportException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) 
	{
		ABClient c = new ABClient();
		c.invoke();

	}
}
