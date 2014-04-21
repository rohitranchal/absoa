// This is a bank RESTful service
var restify = require('restify');

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
server.put('/ship/:name',function (req, res, next) {
	var name = req.params.name;
	var address = req.params.address;

	// Generate a fake package id.
	var ship_id = Math.floor((Math.random()*10000000)+1);
	ship_id = leftPad(ship_id);

	console.log("LOG: Package #"+ship_id+" has been shipped for customer "+name+" at address: "+address);

	// Send OK back, as well as the active bundle
	var retMsg = {
		'RESPONSE' : 'OK'
	}
	res.send(200, retMsg);
	return next();
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
