var thrift = require('thrift');

var abservice = require('./ABService.js');
var ttypes = require('./ActiveBundle_types.js');
var Step = require('step');

// function getValue :
// Input: a list of attributes, e.g. name, credit_card_number
// Output: a list the results

exports.getValue = function(attrs,callback){

	var connection = thrift.createConnection('localhost', 5555);
	var client = thrift.createClient(abservice, connection);


	var retMap = new Array();

	connection.on('error', function(err) {
		console.error(err);
	});

	// GetSLA
	client.getSLA(function(err, response) {
		if(err) {
			console.error(err);
		} else {
			//console.log('Client: get SLA', response);

			// AuthenticateChallenge
			client.authenticateChallenge(function(err, response) {
				if(err) {
					console.error(err);
				} else {
					var encoded_msg = response;
					// Decode
					var decoded_msg = new Buffer(encoded_msg, 'base64');
					console.log('Client: decoded auth challenge: ', decoded_msg.toString());

					// Sign and encode
					var signed_chall = signData(decoded_msg);

					// Get Certificate
					var cert = getCert();

					// Get session
					client.authenticateResponse(encoded_msg, signed_chall, cert, function(err,response){
						var session_key = response.sessionKey;
						var session_id = response.sessionID;
						console.log("Session ID: " + session_id);
						if(attrs.length==1){
							Step(
								function a(){
									client.getValue(session_id, attrs[0], this);
								}
								,
								function callBack(err,data){
									retMap[0] = data;
									console.log("Connection closed");
									connection.end();
									callback(retMap);
								}
								);
						}
						else if(attrs.length==2){
							Step(
									function a(){
										client.getValue(session_id, attrs[0], this);
									}
									,
									function b(err,data){
										retMap[0] = data;
										client.getValue(session_id, attrs[1], this);
									}
									,
									function callBack(err,data){
										retMap[1] = data;
										console.log("Connection closed");
										connection.end();
										callback(retMap);
									}
									);
						}
						else if(attrs.length==3){
							Step(
									function a(){
										client.getValue(session_id, attrs[0], this);
									}
									,
									function b(err,data){
										retMap[0] = data;
										console.log("GetValue: "+data);
										client.getValue(session_id, attrs[1], this);
									}
									,
									function c(err,data){
										retMap[1] = data;
										console.log("GetValue: "+data);
										client.getValue(session_id, attrs[2], this);
									}
									,
									function callBack(err,data){
										console.log("GetValue: "+data);
										retMap[2] = data;
										console.log("Connection closed");
										connection.end();
										callback(retMap);
									}
							);
						}
					});
				}
			});
		}
	});
}

function signData(msg) {
	var crypto = require('crypto');
	var signer = crypto.createSign('RSA-SHA256');
	signer.write(msg);
	var fs = require('fs');
	var svc_key = fs.readFileSync("resources/ecom-private.pem");
	//var svc_cert = process.env.ECOM_CERT;
	var private_key = svc_key.toString('ascii');
	var signed_data = signer.sign(private_key,'base64')
	console.log("Signed challenge: " + signed_data.toString());
	return signed_data;
}

function getCert() {
	var fs = require('fs');
	var stream = fs.readFileSync("resources/ecom-cert.pem");
	var cert_data = stream.toString('base64');
	console.log("Cert: "+cert_data);
	return cert_data;
}


