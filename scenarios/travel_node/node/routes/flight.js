

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("Received FirstName: "+req.body.fn+", LastName: "+req.body.ln+" ID: "+req.body.id);
};

exports.book = function(req, res){
  // Three submitted values
  var fn = req.body.fn;
  var ln = req.body.ln;
  var id = req.body.id;
   
  var retStr = "Received FirstName: "+req.body.fn+", LastName: "+req.body.ln+" ID: "+req.body.id; 

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


  var service = java.newInstanceSync("edu.purdue.cs.absoa.samples.simple.ServiceStub","http://localhost:8080/axis2/services/main_service");  
  var serviceClient = service._getServiceClient();

  // Generate data.txt file
  var info = "firstname = "+fn+"\nlastname = "+ln+"\nid = "+id+"\n"; 
  var fs = require('fs');
  fs.writeFile("data.txt", info, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
  }); 

  
  res.render('test', { title: 'Expedia', retStr: "Yay, working" });    
 
};
