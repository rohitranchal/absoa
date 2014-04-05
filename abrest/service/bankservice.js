// This is a bank RESTful service
var restify = require('restify');
var fs = require('fs');
//var bank = require('./routes/bankapp');
var db = require('../db/bankdb');

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

	// TODO: Query the Active Bundle to get the user's Name, Credit Card No., CSV
	var name = "user1";
	var creditcard = "1111222233334444";
	var csv = "123";
	var money = req.params.amount;

	console.log("Terminate Active Bundle");
	child.kill();	
	var buf = fs.readFileSync(abname);
	var abfileRet = buf.toString('base64');
	// Delete active bundle
	fs.unlink(abname);

	db.deduct(name,creditcard,csv,money, function(cb){
		if(cb==0){
			var err_msg = "ERROR: Payment processing failed";
			console.log(err_msg);
			res.send(400, err_msg);
		}
		else if(cb==-1){
			var err_msg = "ERROR: Incorrect credit card information. Payment failed";
			console.log(err_msg);
			res.send(400, err_msg);
		}
		else if(cb==1){
			console.log("LOG: $%d was successfully deducted from %s's account.",money,name);
			res.send(200, abfileRet);
		}
	});

	return next();
	// Total money to be deducted from the user's bank account

})

server.listen(service_port ,ip_addr, function(){
	console.log('Service %s listening at %s', server.name , server.url);
});
