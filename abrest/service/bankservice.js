// This is a bank RESTful service
var restify = require('restify');
var fs = require('fs');
//var bank = require('./routes/bankapp');
var db = require('../db/bankdb');
var abClient = require('../ab-service-communication/client');

var exec = require('child_process').exec;


var server = restify.createServer({
	    name : "bankservice"
});
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());


// Variable
var service_port = 6001;
var ip_addr = 'localhost';

// User pays money to service
server.put('/pay',function (req, res, next) {
	console.log('Receive a request');
	if (req.params.abfile === undefined) {
		return next(new restify.InvalidArgumentError('Active Bundle must be supplied'))
	}

	var abfile = req.params.abfile;
	// Decode base64 to buffer
	var abbuf = new Buffer(abfile,'base64');
	var abname = "tmp.jar";
	// Write buffer to jar file
	fs.writeFileSync(abname,abbuf);

	// Run the Active Bundle
	var runABCmd = "java -jar "+abname;
	console.log("Start Active Bundle");
	var child =	exec(runABCmd);
	var pid = child.pid;
	child.stdout.on('data', function (data) {
		console.log(data);
	});
	child.stderr.on('data', function (data) {
		console.log(data);
	});
	child.on('close', function (code, signal) {
		  console.log('AB process terminated in Bank Service');
	});

	setTimeout(function() {
			// TODO: Query the Active Bundle to get the user's Name, Credit Card No., CSV
			//var name = "user1";
			//var creditcard = "1111222233334444";
			//var csv = "123";

			var attr1 = "ab.user.name";
			var attr2 = "ab.user.credit_card_number";
			var attr3 = "ab.user.csv";
			var inputList = new Array();
			inputList.push(attr1);
			inputList.push(attr2);
			inputList.push(attr3);

			abClient.getValue(inputList,function(response){

				var money = req.params.amount;
				var name = response[0];
				var creditcard = response[1];
				var csv = response[2];

				process.kill(pid+1);
				var buf = fs.readFileSync(abname);
				var abfileRet = buf.toString('base64');
				// Delete active bundle
				fs.unlink(abname);

				db.deduct(name,creditcard,csv,money, function(cb){
					if(cb==0){
						var err_msg = "ERROR: Payment processing failed";
						console.log(err_msg);
						var retMsg = {
							'error':err_msg
						}
						res.send(400, err_msg);
					}
					else if(cb==-1){
						var err_msg = "ERROR: Incorrect credit card information. Payment failed";
						console.log(err_msg);
						var retMsg = {
							'error':err_msg
						}
						res.send(400, err_msg);
					}
					else if(cb==1){
						console.log("LOG: $%d was successfully deducted from %s's account.",money,name);
						var retMsg = {
							'abfile':abfileRet
						}
						res.send(200, abfileRet);
					}
				});

				return next();
				// Total money to be deducted from the user's bank account
			});
		},100);

})

server.listen(service_port ,ip_addr, function(){
	console.log('Service %s listening at %s', server.name , server.url);
});
