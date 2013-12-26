package edu.purdue.cs.absoa;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.wso2.balana.Balana;
import org.wso2.balana.PDP;
import org.wso2.balana.PDPConfig;
import org.wso2.balana.ParsingException;
import org.wso2.balana.ctx.AbstractResult;
import org.wso2.balana.ctx.AttributeAssignment;
import org.wso2.balana.ctx.ResponseCtx;
import org.wso2.balana.finder.AttributeFinder;
import org.wso2.balana.finder.AttributeFinderModule;
import org.wso2.balana.finder.impl.FileBasedPolicyFinderModule;
import org.wso2.balana.xacml3.Advice;

public class ABAuthorize 
{
	private static Balana balana;

	public static void ABTest()
	{
		initBalana();

		//String userName = "bob";
		//String userName = "peter";
		//String request = createXACMLRequest(userName, "Food", 2, 40);
		String request1 = createXACMLRequest1("ab.user.data", "ab.read", "service1fpr");

		//PDP pdp = getPDPNewInstance();
		PDP pdp = new PDP(balana.getPdpConfig());

		System.out.println("\n======================== XACML Request ====================");
		System.out.println(request1);
		System.out.println("===========================================================");

		//String response = pdp.evaluate(request);
		String response = pdp.evaluate(request1);

		System.out.println("\n======================== XACML Response ===================");
		System.out.println(response);
		System.out.println("===========================================================");

		try {
			ResponseCtx responseCtx = ResponseCtx.getInstance(getXACMLResponse(response));
			AbstractResult result  = responseCtx.getResults().iterator().next();
			if(AbstractResult.DECISION_PERMIT == result.getDecision()){
				System.out.println("\n Authorized to perform this action\n\n");				
			} else {
				System.out.println("\n NOT authorized to perform this action\n");
				List<Advice> advices = result.getAdvices();
				for(Advice advice : advices){
					List<AttributeAssignment> assignments = advice.getAssignments();
					for(AttributeAssignment assignment : assignments){
						System.out.println("Advice :  " + assignment.getContent() +"\n\n");
					}
				}
			}
		} catch (ParsingException e) {
			e.printStackTrace();
		}
	}

	private static void initBalana(){
		try{
			// using file based policy repository. so set the policy location as system property
			String policyLocation = (new File(".")).getCanonicalPath() + File.separator + "src/main/resources/policies";

			System.out.println("policy location: " + policyLocation);

			System.setProperty(FileBasedPolicyFinderModule.POLICY_DIR_PROPERTY, policyLocation);
		} catch (IOException e) {
			System.err.println("Can not locate policy repository");
		}
		// create default instance of Balana
		balana = Balana.getInstance();
	}

	/**
	 * Returns a new PDP instance with new XACML policies
	 *
	 * @return a  PDP instance
	 */
	private static PDP getPDPNewInstance(){

		PDPConfig pdpConfig = balana.getPdpConfig();

		// registering new attribute finder. so default PDPConfig is needed to change
		AttributeFinder attributeFinder = pdpConfig.getAttributeFinder();
		List<AttributeFinderModule> finderModules = attributeFinder.getModules();
		finderModules.add(new SampleAttributeFinderModule());
		attributeFinder.setModules(finderModules);

		return new PDP(new PDPConfig(attributeFinder, pdpConfig.getPolicyFinder(), null, true));
	}
	
	/**
	 * Creates DOM representation of the XACML request
	 *
	 * @param response  XACML request as a String object
	 * @return XACML request as a DOM element
	 */
	public static Element getXACMLResponse(String response) {

		ByteArrayInputStream inputStream;
		DocumentBuilderFactory dbf;
		Document doc;

		inputStream = new ByteArrayInputStream(response.getBytes());
		dbf = DocumentBuilderFactory.newInstance();
		dbf.setNamespaceAware(true);

		try {
			doc = dbf.newDocumentBuilder().parse(inputStream);
		} catch (Exception e) {
			System.err.println("DOM of request element can not be created from String");
			return null;
		} finally {
			try {
				inputStream.close();
			} catch (IOException e) {
				System.err.println("Error in closing input stream of XACML response");
			}
		}
		return doc.getDocumentElement();
	}    

	public static String createXACMLRequest(String userName, String resource, int amount, int totalAmount){

		return "<Request xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\" CombinedDecision=\"false\" ReturnPolicyIdList=\"false\">\n" +
				"<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:action\">\n" +
				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\" IncludeInResult=\"false\">\n" +
				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">buy</AttributeValue>\n" +
				"</Attribute>\n" +
				"</Attributes>\n" +
				"<Attributes Category=\"urn:oasis:names:tc:xacml:1.0:subject-category:access-subject\">\n" +
				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-id\" IncludeInResult=\"false\">\n" +
				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + userName +"</AttributeValue>\n" +
				"</Attribute>\n" +
				"</Attributes>\n" +
				"<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:resource\">\n" +
				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\" IncludeInResult=\"false\">\n" +
				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + resource + "</AttributeValue>\n" +
				"</Attribute>\n" +
				"</Attributes>\n" +
				"<Attributes Category=\"http://kmarket.com/category\">\n" +
				"<Attribute AttributeId=\"http://kmarket.com/id/amount\" IncludeInResult=\"false\">\n" +
				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#integer\">" + amount + "</AttributeValue>\n" +
				"</Attribute>\n" +
				"<Attribute AttributeId=\"http://kmarket.com/id/totalAmount\" IncludeInResult=\"false\">\n" +
				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#integer\">" + totalAmount + "</AttributeValue>\n" +
				"</Attribute>\n" +
				"</Attributes>\n" +
				"</Request>";

	}

	public static String createXACMLRequest1(String resource, String action, String fpr)
	{		
		String xmlReq = ""; 
		String strReq = "";
		StringBuilder sb;
		try {
			xmlReq = (new File(".")).getCanonicalPath() + File.separator + "src/main/resources/xacml-req.xml";
			BufferedReader br = new BufferedReader(new FileReader(new File(xmlReq)));
			String line;
			sb = new StringBuilder();
			while((line=br.readLine())!= null){
			    sb.append(line.trim());
			}
			strReq = sb.toString();
			strReq = strReq.replace("#ABACTION#", action);
			strReq = strReq.replace("#ABCLIENT#", fpr);
			strReq = strReq.replace("#ABRESOURCE#", resource);
		} catch (IOException e) {
			e.printStackTrace();
		}		
		
		return strReq;		
		
//		String reqStr = "<Request xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\" CombinedDecision=\"false\" ReturnPolicyIdList=\"false\">\n" +
//				"<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:action\">\n" +
//				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\" IncludeInResult=\"false\">\n" +
//				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + action + "</AttributeValue>\n" +
//				"</Attribute>\n" +
//				"</Attributes>\n" +
//				"<Attributes Category=\"urn:oasis:names:tc:xacml:1.0:subject-category:access-subject\">\n" +
//				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-id\" IncludeInResult=\"false\">\n" +
//				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + fpr + "</AttributeValue>\n" +
//				"</Attribute>\n" +
//				"</Attributes>\n" +
//				"<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:resource\">\n" +
//				"<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\" IncludeInResult=\"false\">\n" +
//				"<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + resource + "</AttributeValue>\n" +
//				"</Attribute>\n" +
//				"</Attributes>\n" +
//				"</Request>";		
	}
}
