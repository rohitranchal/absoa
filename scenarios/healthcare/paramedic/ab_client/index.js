var thrift = require('thrift');
var abservice = require('./ABService.js');
var ttypes = require('./ActiveBundle_types.js');
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');

var svc_key = fs.readFileSync("ab_client/resources/paramedic-private.pem");
var private_key = svc_key.toString('ascii');
var stream = fs.readFileSync("ab_client/resources/paramedic.pem");
var cert = stream.toString('base64');
var signed_req;

var ab_data = [];

exports.get_data = function(req_arr, port, callback) {
	var connection = thrift.createConnection('localhost', port);
	var client = thrift.createClient(abservice, connection);	

	connection.on('error', function(err) {
		console.error(err);
	});

	var i = 0;
	async.whilst(
		function () { return i < req_arr.length; },
		function (callback) {
			signed_req = signData(req_arr[i]);
			client.getValue(req_arr[i], signed_req, cert, function(err, data) {
				ab_data[i] = data;
				i++;
				callback();
			});
		},
		function (err) {
			callback(ab_data);
		}
	);
};

exports.get_value = function(req,port,callback) {
	var connection = thrift.createConnection('localhost', port);
	var client = thrift.createClient(abservice, connection);	

	connection.on('error', function(err) {
		console.error(err);
	});
	signed_req = signData(req);
	client.getValue(req, signed_req, cert, function(err, data) {
		callback(data);
	});
};

function signData(msg) {
	var signer = crypto.createSign('RSA-SHA256');
	signer.write(msg);
	return signer.sign(private_key,'base64');
}

function getCert() {
	var stream = fs.readFileSync("ab_client/resources/service1.pem");
	var cert_data = stream.toString('base64');
	return cert_data;
}
