var db = require('../db');
var fs = require('fs');
var restify = require('restify');

exports.purchase = function(req, res){
	// session info
	var login = 'yes';
	var user = 'user1';
	var money = 1;

	// TODO: Get AB file

	db.get_abpath(user,function(abpath){
		if (abpath) {
			var buf = fs.readFileSync(abpath);
			var stats = fs.statSync(abpath);
			var fileSize = stats["size"]

		var abfileStr = buf.toString('base64');

	var bankclient = restify.createStringClient({
		url: 'http://localhost:1200'
	});

	var option =
	{ 'abfile': abfileStr, 
		'amount': money ,
		'content-encoding': 'gzip'
	};

	var start_timestamp = new Date().getTime(); 

	bankclient.put('/pay', option, function(err, request, response, data) {
		var end_timestamp = new Date().getTime(); 
		var elapse = end_timestamp - start_timestamp;
		console.log("Elapse(ms): "+elapse);
		console.log("File Size(byte): "+fileSize);
		var throughput = fileSize*8*2/1000/(elapse/1000);
		console.log("Throughput(kbit/second): "+throughput.toFixed(3));
		res.render('checkoutsucceed',{title: 'E-Commerce',login: login,user:user});				
	});

		} else {
			var err_msg = new Array();
			err_msg.push("AB not found for this user");
			res.render('checkoutfailed', {title: 'E-Commerce', login: login, user: user, error:err_msg});				
		}

	});

};
