// This is a bank RESTful service
var portscanner = require('portscanner');
var async = require('async');
var abClient = require('../ab-service-communication/client');

var spawn = require('child_process').spawn;


// Get a port not in use after 4000
portscanner.findAPortNotInUse(4000, 5000, '127.0.0.1', function(error, port) {

	// Create ab jar name
	var abname = "../abfiles/user1.jar";

	// Run the Active Bundle
	console.log("Start Active Bundle");
	var child =	spawn("java",["-jar",abname,port]);
	var pid = child.pid;

	child.stdout.setEncoding("ASCII");
	child.stdout.on('data', function (data) {
		console.log(data);
	});
	child.stderr.on('data', function (data) {
		console.log(data);
	});
	child.on('close', function (code, signal) {
		console.log('AB process terminated in Bank Service');
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
				});
				setTimeout(callback, 10);
			},
			function (err) {
				// AB is running
				// TODO: Query the Active Bundle to get the user's Name, Credit Card No., CSV

				var attr1 = "ab.user.creditcard";
				var inputList = new Array();
				inputList.push(attr1);

				var start_timestamp = new Date().getTime();
				abClient.getValue(inputList,port,function(response){
					var end_timestamp = new Date().getTime();
					var diff = end_timestamp - start_timestamp;
					console.log("Time diff:"+diff);
					var creditcard = response[0];
					console.log(creditcard);

					process.kill(pid);
				});
			});
})
