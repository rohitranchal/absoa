package edu.purdue.absoa;

import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TTransportException;

public class Server {

	public static int ABPort;

	private void start() {
		try {
			TServerSocket serverTransport = new TServerSocket(ABPort);
			ABService.Processor processor = new ABService.Processor(new ABServiceHandler());
			TServer server = new TThreadPoolServer(new TThreadPoolServer.Args(
					serverTransport).processor(processor));
			System.out.println("Starting AB on port: " + ABPort);
			server.serve();
		} catch (TTransportException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		if (args.length != 0) {
			ABPort = Integer.parseInt(args[0]);
		} else {
			ABPort = 5555;
		}
	    
		Server srv = new Server();
		srv.start();
	}
}
