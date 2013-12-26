package edu.purdue.cs.absoa;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TTransportException;

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
		} else {
			ABPort = 5555;
		}		
		
		ABAuthorize.ABTest();
		
//		ABServiceHandler.setABData("ab.user.name", "AB Owner");
//		ABServiceHandler.setABData("ab.user.zip", "47906");
//		ABServiceHandler.setABData("ab.user.data", "AB sensitive data");
	    
		Server srv = new Server();
		srv.start();
	}
}
