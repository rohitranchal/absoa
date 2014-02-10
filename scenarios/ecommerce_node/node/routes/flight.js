

/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.send("Received FirstName: "+req.body.fn+", LastName: "+req.body.ln+" ID: "+req.body.id);
};

exports.book = function(req, res){
	// Three submitted values
	var infoArray = new Array();
	infoArray[0] = req.body.fn;
	infoArray[1] = req.body.ln;
	infoArray[2] = req.body.id;

	var java = require("java")
	var jars_dir = process.cwd() + '/lib/';

	java.classpath.push (jars_dir+"axis2-1.6.2.jar");
	java.classpath.push (jars_dir+"active_bundle-1.0-SNAPSHOT.jar");
	java.classpath.push (jars_dir+"httpcore-4.0.jar");
	java.classpath.push (jars_dir+"apache-mime4j-core-0.7.2.jar");
	java.classpath.push (jars_dir+"jaxen-1.1.3.jar");
	java.classpath.push (jars_dir+"axiom-api-1.2.13.jar");
	java.classpath.push (jars_dir+"jsr311-api-1.0.jar");
	java.classpath.push (jars_dir+"axiom-impl-1.2.13.jar"); 
	java.classpath.push (jars_dir+"junit-3.8.1.jar");
	java.classpath.push (jars_dir+"libthrift-0.9.1.jar");
	java.classpath.push (jars_dir+"axis2-kernel-1.6.2.jar");   
	java.classpath.push (jars_dir+"neethi-3.0.2.jar");
	java.classpath.push (jars_dir+"axis2-transport-http-1.6.2.jar");
	java.classpath.push (jars_dir+"org.wso2.balana-1.0.0-wso2v7.jar");
	java.classpath.push (jars_dir+"axis2-transport-local-1.6.2.jar");        
	java.classpath.push (jars_dir+"ServiceStub.jar");
	java.classpath.push (jars_dir+"balana-distribution-1.0.0-wso2v7.jar");  
	java.classpath.push (jars_dir+"servlet-api-2.3.jar");
	java.classpath.push (jars_dir+"commons-codec-1.2.jar");   
	java.classpath.push (jars_dir+"slf4j-api-1.5.8.jar");
	java.classpath.push (jars_dir+"commons-fileupload-1.2.jar");    
	java.classpath.push (jars_dir+"slf4j-simple-1.5.8.jar");
	java.classpath.push (jars_dir+"commons-httpclient-3.1.jar");     
	java.classpath.push (jars_dir+"stax2-api-3.0.2.jar");
	java.classpath.push (jars_dir+"commons-io-1.3.2.jar");      
	java.classpath.push (jars_dir+"stax-api-1.0-2.jar");
	java.classpath.push (jars_dir+"commons-lang3-3.1.jar");
	java.classpath.push (jars_dir+"woden-api-1.0M9.jar");
	java.classpath.push (jars_dir+"commons-logging-1.1.1.jar");
	java.classpath.push (jars_dir+"woden-impl-commons-1.0M9.jar");
	java.classpath.push (jars_dir+"geronimo-activation_1.1_spec-1.1.jar");
	java.classpath.push (jars_dir+"woden-impl-dom-1.0M9.jar");
	java.classpath.push (jars_dir+"geronimo-javamail_1.4_spec-1.7.1.jar"); 
	java.classpath.push (jars_dir+"woodstox-core-asl-4.0.8.jar");
	java.classpath.push (jars_dir+"geronimo-jta_1.1_spec-1.1.jar");     
	java.classpath.push (jars_dir+"wsdl4j-1.6.2.jar");
	java.classpath.push (jars_dir+"geronimo-stax-api_1.0_spec-1.0.1.jar");
	java.classpath.push (jars_dir+"wstx-asl-3.2.9.jar");
	java.classpath.push (jars_dir+"geronimo-ws-metadata_2.0_spec-1.1.2.jar");
	java.classpath.push (jars_dir+"XmlSchema-1.4.7.jar");
	java.classpath.push (jars_dir+"httpclient-4.2.5.jar");
	java.classpath.push (jars_dir+"client-1.0-SNAPSHOT.jar");

	var arg0 = java.newInstanceSync("java.lang.String","http://localhost:8080/axis2/services/main_service");
	var service = java.newInstanceSync("edu.purdue.cs.absoa.samples.simple.ServiceStub",arg0);  
	if(service == undefined){
			console.log("ERROR: service is undefined");
	}
	else{
			console.log("OK: service is defined");
	}
	var serviceClient = service._getServiceClientSync();
	if(serviceClient == undefined){
			console.log("ERROR: serviceClient is undefined");
	}
	else{
			console.log("OK: serviceClient is defined");
	}

	var header = getAbHeader(infoArray,java);
	if(header==undefined){
		console.log("ERROR: header is undefined");
	}
	else{
		console.log("OK: header is defined");
	}
	serviceClient.addHeaderSync(header);
	abNewStr = service.bookServiceSync("flight");
	getReturnedAB(abNewStr,java);
	res.render('test', { title: 'Expedia', retStr: "Yay, working" });    
};

function getAbHeader(infoArray,java){
	// Generate data.txt file
	var info = "firstname = " + infoArray[0] + "\n"
	info = info + "lastname = " + infoArray[1] + "\n"
	info = info + "id = " + infoArray[2] + "\n"; 
	info = info + "flight_service = true\n"; 
	info = info + "name = Alice\n";
	info = info + "leaving_from = LAX\n";
	info = info + "destination = ORD\n";
	info = info + "from = 01/01/2014\n";
	info = info + "to = 01/03/2014\n";
	info = info + "zip = 90210\n";
	info = info + "state = CA\n";
	info = info + "hotel_service = false\n";
	info = info + "carrental_service = false\n";

	var fs = require('fs');
	fs.writeFileSync("data.txt", info, 'utf8');
	console.log("LOG: data.txt created");

	// Append data.txt to AB and generate ABNew.jar
	var dataFileArray = java.newArray("java.lang.String", ["data.txt"]);
	var JarManager = java.import("edu.purdue.cs.absoa.JarManager");  
	JarManager.mainSync(dataFileArray);
	console.log("LOG: ABNew.jar created");

	var FileUtils = java.import("org.apache.commons.io.FileUtils");
	var abFile = java.newInstanceSync("java.io.File","ABNew.jar");
	var result = 	FileUtils.readFileToByteArraySync(abFile); 
	var abBytes = java.newArray("byte",result);
	var Base64 = java.import("org.apache.axiom.util.base64.Base64Utils");
	var abB64Str = Base64.encodeSync(abBytes);
	result = Base64.encodeSync(abBytes);
	abB64Str = java.newInstanceSync("java.lang.String",result);
	var OMAbstractFactory = java.import("org.apache.axiom.om.OMAbstractFactory");
	var omFactory = OMAbstractFactory.getOMFactorySync();

	var arg0 = java.newInstanceSync("java.lang.String","http://absoa.cs.purdue.edu/ns/");
	var arg1 = java.newInstanceSync("java.lang.String","ActiveBundle");
	var arg2 = java.newInstanceSync("java.lang.String","ab");
	var qName = java.newInstanceSync("javax.xml.namespace.QName",arg0, arg1, arg2);
	var header = omFactory.createOMElementSync(qName,null);
	header.setTextSync(abB64Str);
	console.log("LOG: header created");

	return header;
}

function getReturnedAB(abString,java){
	var Base64 = java.import("org.apache.axiom.util.base64.Base64Utils");
	var ret	= Base64.decodeSync(abString);
	var abBytes = java.newArray("byte",ret);

	
	var abName = java.newInstanceSync("java.lang.String","ABReturn.jar");
	var abFile = java.newInstanceSync("java.io.File",abName);

	abFile.createNewFile();
	fos = java.newInstanceSync("java.io.FileOutputStream",abFile);
	fos.writeSync(abBytes);
	fos.flushSync();
	fos.closeSync();

}
