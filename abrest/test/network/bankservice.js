// This is a bank RESTful service
var restify = require('restify');

var server = restify.createServer({
	    name : "bankservice"
});
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());


// Variable
var service_port = 1200;
var ip_addr = 'localhost';

// User pays money to service
server.put('/pay',function (req, res, next) {
	if (req.params.abfile === undefined) {
		console.log('ERROR: AB Not Received');
		return next(new restify.InvalidArgumentError('Active Bundle must be supplied'))
	}
	var retMsg = {
		'abfile':abfileRet
	}
	res.send(200, req.params.abfile);

	return next();
	// Total money to be deducted from the user's bank account
});

server.listen(service_port ,ip_addr, function(){
	console.log('LOG: Service %s listening at %s', server.name , server.url);
});
