// This is a bank RESTful service
var restify = require('restify');
var server = restify.createServer({
	    name : "bankapp"
});
var bank = require('./routes/bank');

// Variable
var service_port = 5001;
var ip_addr = 'localhost';

// User pays money to service
server.put('/pay/:creditcard/:csv/:total',bank.deduct);

server.listen(service_port ,ip_addr, function(){
	    console.log('Service %s listening at %s', server.name , server.url);
});
