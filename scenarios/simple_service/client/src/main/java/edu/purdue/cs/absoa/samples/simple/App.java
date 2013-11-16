package edu.purdue.cs.absoa.samples.simple;

import java.io.File;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axiom.om.util.Base64;
import org.apache.commons.io.FileUtils;

public class App {

	/*
	 * Here we are sending the name of the user in the request.
	 * 
	 * When using an AB: The name will be added to the active bundle and sent.
	 * The request will not contain the name value in plain.
	 */
	public static void main(String[] args) throws Exception {
		// Invoke service
		ServiceStub service = new ServiceStub(
				"http://localhost:8080/axis2/services/service");

		service._getServiceClient().addHeader(getAbHeader());

		String ret = service.sayHello("Alice");
		System.out.println(ret);
	}

	private static OMElement getAbHeader() throws Exception {

		// Read the AB and add it to the header
		File abFile = new File("AB.jar");
		byte[] abBytes = FileUtils.readFileToByteArray(abFile);
		String abB64Str = Base64.encode(abBytes);

		OMFactory omFactory = OMAbstractFactory.getOMFactory();
		OMElement header = omFactory.createOMElement(new QName(
				"http://absoa.cs.purdue.edu/ns/", "ActiveBundle", "ab"), null);
		header.setText(abB64Str);

		return header;
	}
}
