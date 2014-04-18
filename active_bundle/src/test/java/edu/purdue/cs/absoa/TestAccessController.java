package edu.purdue.cs.absoa;

import java.io.File;
import java.net.URL;

import junit.framework.TestCase;

import org.apache.commons.io.FileUtils;

import edu.purdue.cs.absoa.ABAccessController;

public class TestAccessController extends TestCase {
	
	public void testEvaluateServiceCreditCardLimitPolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_creditcard_limit.xml");
		URL reqPath = getClass().getClassLoader().getResource("requests/test/req1.xml");
		
		ABAccessController controller = new ABAccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("requests/test/req1.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
	
	public void testEvaluateServiceCreditCardTypePolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_creditcard_type.xml");
		URL reqPath = getClass().getClassLoader().getResource("requests/test/req2.xml");
		
		ABAccessController controller = new ABAccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("requests/test/req2.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
	
	public void testEvaluateServiceShippingPreferencePolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_shipping_preference.xml");
		URL reqPath = getClass().getClassLoader().getResource("requests/test/req3.xml");
		
		ABAccessController controller = new ABAccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("requests/test/req3.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
}
