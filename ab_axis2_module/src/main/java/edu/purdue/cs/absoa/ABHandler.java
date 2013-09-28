package edu.purdue.cs.absoa;

import org.apache.axis2.AxisFault;
import org.apache.axis2.context.MessageContext;
import org.apache.axis2.description.HandlerDescription;
import org.apache.axis2.description.Parameter;
import org.apache.axis2.engine.Handler;

public class ABHandler implements Handler {

	public void cleanup() {
		// TODO Auto-generated method stub

	}

	public void flowComplete(MessageContext arg0) {
		// TODO Auto-generated method stub

	}

	public HandlerDescription getHandlerDesc() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	public Parameter getParameter(String arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public void init(HandlerDescription arg0) {
		// TODO Auto-generated method stub

	}

	public InvocationResponse invoke(MessageContext arg0) throws AxisFault {
		System.out.println("Testing");
		return null;
	}

}
