package edu.purdue.cs.absoa;

import org.apache.axis2.AxisFault;
import org.apache.axis2.context.MessageContext;
import org.apache.axis2.description.Parameter;
import org.apache.axis2.engine.Handler;
import org.apache.axis2.handlers.AbstractHandler;

public class ABHandler extends AbstractHandler implements Handler {

	private String name = "ABHandler";

	public String getName() {
		return this.name;
	}

	public Parameter getParameter(String arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public InvocationResponse invoke(MessageContext arg0) throws AxisFault {
		System.out.println("Testing");
		return InvocationResponse.CONTINUE;
	}

	public void setName(String name) {
		this.name = name;
	}
}
