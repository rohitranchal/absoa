var thrift = require('thrift');

var abservice = require('./ABService.js');
var ttypes = require('./ActiveBundle_types.js');
var async = require('async');

// function get_data :
// Input: a list of attributes, e.g. name, credit_card_number; port number
// Output: a list the results

exports.get_data = function(attrs,port,callback) {

	var connection = thrift.createConnection('localhost', port);
	var client = thrift.createClient(abservice, connection);

	var retMap = new Array();

	connection.on('error', function(err) {
		console.error(err);
	});

		// AuthenticateChallenge
		client.authenticateChallenge(function(err, response) {
			if(err) {
				console.error(err);
			} else {
				var encoded_msg = response;
				// Decode
				var decoded_msg = new Buffer(encoded_msg, 'base64');
				//console.log('Client: decoded auth challenge: ', decoded_msg.toString());

				// Sign and encode
				var signed_chall = signData(decoded_msg);

				// Get Certificate
				var cert = getCert();

				// Get session
				client.authenticateResponse(encoded_msg, signed_chall, cert, function(err,response){
					var session_key = response.sessionKey;
					var session_id = response.sessionID;
					//console.log("Session ID: " + session_id);
					var i = 0;
					async.whilst(
						function () { return i < attrs.length; },
						function (callback) {
								client.getValue(session_id, attrs[i], function(err,data){
									retMap[i] = data;
									i++;
									callback();
								});
						},
						function (err) {
							callback(retMap);
						}
						);
				});
			}
		});
	};

function signData(msg) {
	var crypto = require('crypto');
	var signer = crypto.createSign('RSA-SHA256');
	signer.write(msg);
	var fs = require('fs');
	var svc_key = fs.readFileSync("ab_client/resources/ecom-private.pem");
	//var svc_cert = process.env.ECOM_CERT;
	var private_key = svc_key.toString('ascii');
	var signed_data = signer.sign(private_key,'base64')
	//console.log("Signed challenge: " + signed_data.toString());
	return signed_data;
}

function getCert() {
	var fs = require('fs');
	var stream = fs.readFileSync("ab_client/resources/ecom-cert.pem");
	var cert_data = stream.toString('base64');
	return cert_data;
}


