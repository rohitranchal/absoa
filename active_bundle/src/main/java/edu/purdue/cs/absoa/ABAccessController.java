package edu.purdue.cs.absoa;

import java.io.ByteArrayInputStream;
import java.util.HashSet;
import java.util.Set;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMXMLBuilderFactory;
import org.wso2.balana.Balana;
import org.wso2.balana.PDP;
import org.wso2.balana.PDPConfig;
import org.wso2.balana.finder.PolicyFinder;
import org.wso2.balana.finder.PolicyFinderModule;
import org.wso2.balana.finder.impl.FileBasedPolicyFinderModule;

public class ABAccessController {

	public String evaluate(String policy, String request) {
		PDP pdp = this.getPDPInstance(policy);
		return this.evaluate(request, pdp);
	}
	
	private String evaluate(String request, PDP pdp) {
		String res = pdp.evaluate(request);
		ByteArrayInputStream in = new ByteArrayInputStream(res.getBytes());
		OMElement elem = OMXMLBuilderFactory.createOMBuilder(in).getDocumentElement();
		
		OMElement tmp = elem.getFirstChildWithName(new QName("urn:oasis:names:tc:xacml:3.0:core:schema:wd-17", "Result"));
		tmp = tmp.getFirstChildWithName(new QName("urn:oasis:names:tc:xacml:3.0:core:schema:wd-17", "Decision"));
		return tmp.getText();
	}
	
	private PDP getPDPInstance(String policyLocation) {
		PolicyFinder finder= new PolicyFinder();
        Set<String> policyLocations = new HashSet<String>();
        policyLocations.add(policyLocation);
        FileBasedPolicyFinderModule testPolicyFinderModule = new FileBasedPolicyFinderModule(policyLocations);
        Set<PolicyFinderModule> policyModules = new HashSet<PolicyFinderModule>();
        policyModules.add(testPolicyFinderModule);
        finder.setModules(policyModules);

        Balana balana = Balana.getInstance();
        PDPConfig pdpConfig = balana.getPdpConfig();
        pdpConfig = new PDPConfig(pdpConfig.getAttributeFinder(), finder,
        pdpConfig.getResourceFinder(), true);
        return new PDP(pdpConfig);
	}
}
