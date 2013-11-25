package edu.purdue.cs.absoa;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.util.Iterator;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.util.Base64;
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

	public InvocationResponse invoke(MessageContext mc) throws AxisFault {
		
		Iterator abHeaderIt = mc.getEnvelope().getHeader().getChildrenWithName(new QName(
				"http://absoa.cs.purdue.edu/ns/", "ActiveBundle", "ab"));
		if(abHeaderIt.hasNext()) {
			try {
				OMElement abHeader = (OMElement)abHeaderIt.next();
				String abB64Str = abHeader.getText();
				byte[] abBytes = Base64.decode(abB64Str);
				
				//TODO: Need to check whether this is available
				int port = 5000 + (int) (Math.random() * 2500);
				
				//Create temp ab directory if it is not there
				File tmpABDir = new File("/tmp/AB/");
				if(!tmpABDir.exists()) {
					tmpABDir.mkdir();
				}
				
				String abName = tmpABDir.getAbsolutePath() + "/AB" + port + ".jar";
				File abFile = new File(abName);
				abFile.createNewFile();
				abFile.deleteOnExit();
				FileOutputStream fos = new FileOutputStream(abFile);
				fos.write(abBytes);
				fos.flush();
				fos.close();
				
				
				Process process = Runtime.getRuntime().exec("java -jar " + abFile.getAbsolutePath() + " " + port);
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				String line = reader.readLine(); //Blocks for AB to start
				if(line.startsWith("Starting server on port:")) {
					System.out.println("Active Bundle Started!");
				}
				
				mc.getOptions().setProperty("abProcess", process);
				mc.getOptions().setProperty("abPort", new Integer(port));
				mc.getOptions().setProperty("abTempDir", tmpABDir.getAbsolutePath());
				mc.getOptions().setProperty("abFilePath", abFile.getAbsolutePath());
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} else {
			System.out.println("ActiveBundle header not present!");
		}
		
		
		return InvocationResponse.CONTINUE;
	}

	public void setName(String name) {
		this.name = name;
	}
}
