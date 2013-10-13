package edu.purdue.cs.absoa;

import java.io.IOException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TBinaryProtocol.Factory;
import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TTransportException;

//import edu.purdue.cs.absoa.ABService.Processor;
import edu.purdue.cs.absoa.ABService;

public class Server 
{
	private void start() 
	{
		try {
			TServerSocket serverTransport = new TServerSocket(5555);
			ABService.Processor processor = new ABService.Processor(new ABServiceHandler());
			TServer server = new TThreadPoolServer(new TThreadPoolServer.Args(serverTransport).
					processor(processor));
			System.out.println("Starting server on port 5555 ...");
			server.serve();
		} catch (TTransportException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) 
	{
		Server srv = new Server();
		srv.start();
	}
}
