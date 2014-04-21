// This is a bank RESTful service
var restify = require('restify');
var db = require('../../db/bankdb');

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
server.put('/pay/:username/:creditcard/:money',function (req, res, next) {
	var name = req.params.username;
	var creditcard = req.params.creditcard;
	var money = req.params.money;

	db.deduct(name,creditcard,money, function(cb){
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
				'RESPONSE': 'OK'
			}
			res.send(200, retMsg);
		}
	});

	return next();
	// Total money to be deducted from the user's bank account
})


server.listen(service_port ,ip_addr, function(){
	console.log('LOG: Service %s listening at %s', server.name , server.url);
});
