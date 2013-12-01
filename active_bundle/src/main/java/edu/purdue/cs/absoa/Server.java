package edu.purdue.cs.absoa;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TBinaryProtocol.Factory;
import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TTransportException;

import edu.purdue.cs.absoa.ABService;

public class Server {

	private static int ABPort;

	private void start() {
		try {
			TServerSocket serverTransport = new TServerSocket(ABPort);
			ABService.Processor processor = new ABService.Processor(new ABServiceHandler());
			TServer server = new TThreadPoolServer(new TThreadPoolServer.Args(
					serverTransport).processor(processor));
			System.out.println("Starting server on port: " + ABPort);
			server.serve();
		} catch (TTransportException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		if (args.length != 0) {
			ABPort = Integer.parseInt(args[0]);
			// ABServiceHandler.setABData("ab.user.name", args[0]);
			// ABServiceHandler.setABData("ab.user.zip", args[1]);
			// ABServiceHandler.setABData("ab.user.data", args[2]);
		} else {
			ABPort = 5555;
		}
		
//		ABServiceHandler.setABData("ab.user.name", "AB Owner");
//		ABServiceHandler.setABData("ab.user.zip", "47906");
//		ABServiceHandler.setABData("ab.user.data", "AB sensitive data");
	    
		Server srv = new Server();
		srv.start();

	}
}
