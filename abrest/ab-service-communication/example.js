var crypto = require('crypto');
var fs = require('fs');

var pem = fs.readFileSync('service1/private.pem');
var key = pem.toString('ascii');
var keyBuf = new Buffer(key,'base64');

var pem = fs.readFileSync('service1/service1.pem');
var pub = pem.toString('ascii');
var data = 'abcdefg';
var signer = crypto.createSign('RSA-SHA256');

signer.write(data,"ascii");
var sig = signer.sign(key,'hex');
console.log("Signed Data: "+sig);
