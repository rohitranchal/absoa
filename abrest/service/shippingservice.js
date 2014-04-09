// This is a bank RESTful service
var restify = require('restify');
var fs = require('fs');

var exec = require('child_process').exec;


var server = restify.createServer({
	    name : "shippingservice"
});
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());


// Variable
var service_port = 6002;
var ip_addr = 'localhost';

// User pays money to service
server.put('/ship',function (req, res, next) {

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
	child.stdout.on('data', function (data) {
		console.log(data);
	});
	child.stderr.on('data', function (data) {
		console.log(data);
	});
	child.on('close', function (code, signal) {
		  console.log('child process terminated due to receipt of signal '+signal);
	});
	
	setTimeout(function() {
		// TODO: Query the Active Bundle to get the shipping address, email
		var attr1 = "ab.user.name";
		var attr2 = "ab.user.address";
		var inputList = new Array();
		inputList.push(attr1);
		inputList.push(attr2);

		abClient.getValue(inputList,function(response){
			var name = response[0];
			var address = response[1];

			child.kill();	
			var buf = fs.readFileSync(abname);
			var abfileRet = buf.toString('base64');
			// Delete active bundle
			fs.unlink(abname);

			// Generate a fake package id.
			var ship_id = Math.floor((Math.random()*10000000)+1);
			ship_id = leftPad(ship_id);

			console.log("Package #"+ship_id+" has been shipped for customer "+name+" at address: "+address);

			// Send OK back, as well as the active bundle
			res.send(200, abfileRet);
			return next();
		});
	},500);
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
	console.log('Service %s listening at %s', server.name , server.url);
});
