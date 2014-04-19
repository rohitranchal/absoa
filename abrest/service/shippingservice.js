// This is a bank RESTful service
var restify = require('restify');
var fs = require('fs');
var portscanner = require('portscanner');
var async = require('async');
var abClient = require('../ab-service-communication/client');
var spawn = require('child_process').spawn;


var server = restify.createServer({
	    name : "shippingservice"
});
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());


// Variable
var service_port = 1300;
var ip_addr = 'localhost';

// User pays money to service
server.put('/ship',function (req, res, next) {

	if (req.params.abfile === undefined) {
		console.log('ERROR: AB Not Received');
		return next(new restify.InvalidArgumentError('Active Bundle must be supplied'))
	}

	var abfile = req.params.abfile;
	console.log('LOG: Received AB');
	// Decode base64 to buffer
	var abbuf = new Buffer(abfile,'base64');

	// Get a port not in use after 4000
	portscanner.findAPortNotInUse(4000, 5000, '127.0.0.1', function(error, port) {

		// Create ab jar name
		var abname = "ab_"+port+".jar";
		// Write buffer to jar file
		fs.writeFileSync(abname,abbuf);

		// Run the Active Bundle
		var child =	spawn("java",["-jar",abname,port]);
		console.log("LOG: Started AB");
		var pid = child.pid;

		child.stdout.setEncoding("ASCII");
		child.stdout.on('data', function (data) {
			console.log("LOG(AB): ");
			console.log(data);
		});
		child.stderr.on('data', function (data) {
			console.log("ERROR(AB): ");
			console.log(data);
		});
		child.on('close', function (){
			console.log('LOG: Terminated AB');
		});

		var ifStarted = 0;

		async.whilst(
				function () { return ifStarted==0; },
				function (callback) {
					// Check if AB is running very 10 ms
					portscanner.checkPortStatus(port, '127.0.0.1', function(error, status) {
						if(status == 'open'){
							ifStarted = 1;
						}
						setTimeout(callback, 10);
					});
				},
				function (err) {
					// AB is running
					// TODO: Query the Active Bundle to get the shipping address, email
					var attr1 = "ab.user.name";
					var attr2 = "ab.user.address";
					var inputList = new Array();
					inputList.push(attr1);
					inputList.push(attr2);

					abClient.getValue(inputList,port,function(response){
						var name = response[0];
						var address = response[1];

						process.kill(pid);
						var buf = fs.readFileSync(abname);
						var abfileRet = buf.toString('base64');
						// Delete active bundle
						fs.unlink(abname);

						// Generate a fake package id.
						var ship_id = Math.floor((Math.random()*10000000)+1);
						ship_id = leftPad(ship_id);

						console.log("LOG: Package #"+ship_id+" has been shipped for customer "+name+" at address: "+address);

						// Send OK back, as well as the active bundle
						res.send(200, abfileRet);
						return next();
					});
				});
	})
})

function leftPad (str, length) {
	str = str == null ? '' : String(str);
	pad = '';
	padLength = length - str.length;

	while(padLength--) {
		pad += '0';
	}

	return pad + str;
}

server.listen(service_port ,ip_addr, function(){
	console.log('LOG: Service %s listening at %s', server.name , server.url);
});
