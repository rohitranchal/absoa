var thrift = require('thrift');

var abservice = require('./ABService.js');
var ttypes = require('./ActiveBundle_types.js');

var connection = thrift.createConnection('localhost', 5555);
var client = thrift.createClient(abservice, connection);

connection.on('error', function(err) {
	console.error(err);
});

// GetSLA
client.getSLA(function(err, response) {
	if(err) {
		console.error(err);
	} else {
		console.log('Client: get SLA', response);

		// AuthenticateChallenge
		client.authenticateChallenge(function(err, response) {
			if(err) {
				console.error(err);
			} else {
				console.log('Client: auth challenge', response);
				var encodedMsg = response;
				// Decode
				var decodedMsg = new Buffer(encodedMsg, 'base64');

				// Sign and encode
				var signedData = signData(decodedMsg);
				console.log("SignedData: "+signedData);

				// Get Certificate 
				var cert = getCert()
			console.log("Cert: "+cert);

		// Get session
		client.authenticateResponse(encodedMsg,signedData,cert,function(err,response){
			var sessionKey = response;
			console.log("Session: "+sessionKey);
			var dataKey = 'ab.user.name';

			// getValue
			client.getValue(sessionKey, dataKey, function(err, response) {
				if(err) {
					console.error(err);
				} else {
					console.log('Client: get value', response);
					connection.end();
				}
			});
		});
			}
		});
	}
});

function signData(msg){
	var crypto = require('crypto');
	var signer = crypto.createSign('RSA-SHA256');
	console.log("Message: "+msg);
	signer.write(msg);
	var fs = require('fs');
	var stream = fs.readFileSync("service1/ABCAKey.pem");
	var privateKey = stream.toString('ascii');
	signedData = signer.sign(privateKey,'base64')
	return signedData;
}

function getCert(){
	var fs = require('fs');
	var stream = fs.readFileSync("service1/ABCACert.pem");
	var certData = stream.toString('ascii');
	return certData;
}


