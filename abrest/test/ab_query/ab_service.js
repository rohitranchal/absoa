// This is a bank RESTful service
var restify = require('restify');
var fs = require('fs');
var portscanner = require('portscanner');
var async = require('async');
var abClient = require('../../ab-service-communication/client');

var spawn = require('child_process').spawn;



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
var portQ = new Queue();
//var queryList = ["name","creditcard","shipping.preference","shipping.address","creditcard.type"];
var queryList = ["creditcard","shipping.preference","creditcard.type"];


var index;
for(index=4000;index<5000;index++){
	portQ.enqueue(index);
}

// User pays money to service
server.get('/get',function (req, res, next) {
	// Pick a port to use for AB
	var port;
	var ifAvailable = 0;

	async.whilst(
		function () { return ifAvailable==0; },
		function (callback) {
			port = portQ.dequeue();
			portscanner.checkPortStatus(3000, '127.0.0.1', function(error, status) {
				// Status is 'open' if currently in use or 'closed' if available
				if(status=="closed"){
					ifAvailable = 1;
				}
				else{
					// This port is in use, put it back to port queue
					portQ.enqueue(port);
				}
			callback();
			})
		},	
		// Found a port that is available
		function (err) {
			// Create ab jar name
			var abname = "../../abfiles/ab_"+port+".jar";

			var exist = fs.existsSync(abname)
			if(!exist){
				fs.writeFileSync(abname, fs.readFileSync("../../abfiles/user1.jar"));
			}

			// Run the Active Bundle
			var child =	spawn("java",["-jar",abname,port]);
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
			child.on('close', function (code, signal) {
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
						// TODO: Query the Active Bundle to get the user's Name, Credit Card No.,

						var inputList = new Array();
						var i;
						for(i=0;i<queryList.length;i++){
							inputList.push("ab.user."+queryList[i]);
						}

						abClient.getValue(inputList,port,function(response){
							var msg;
							for( msg in response){
								console.log(response[msg]);
							}

							process.kill(pid);

							// AB is stopped, put the port back into portQ so that other concurrent
							// request can use
							portQ.enqueue(port);

							res.send(200);

							return next();
							// Total money to be deducted from the user's bank account
						});
					});
		})
})

function Queue()
{
	this.stac=new Array();
	this.dequeue=function(){
		return this.stac.pop();
	}
	this.enqueue=function(item){
		this.stac.unshift(item);
	}
}


server.listen(service_port ,ip_addr, function(){
	console.log('LOG: Service %s listening at %s', server.name , server.url);
});
