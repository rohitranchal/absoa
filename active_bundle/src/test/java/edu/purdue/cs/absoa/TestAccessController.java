package edu.purdue.cs.absoa;

import java.io.File;
import java.net.URL;

import junit.framework.TestCase;

import org.apache.commons.io.FileUtils;

import edu.purdue.cs.absoa.ABAccessController;

public class TestAccessController extends TestCase {
	
	public void testEvaluateServiceCreditCardPolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_creditcard_limit.xml");
		URL reqPath = getClass().getClassLoader().getResource("req1.xml");
		
		ABAccessController controller = new ABAccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req1.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
}
