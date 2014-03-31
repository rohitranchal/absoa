var db = require('../db');
var fs = require('fs');
var restify = require('restify');

exports.purchase = function(req, res){
	// session info
	var login = req.session.login;
	var user = req.session.user;
	var money = req.body.total;

	//res.send(user+" "+money);


	// TODO: Get AB file

	db.get_abpath(user,function(abpath){
		if (abpath) {
			var buf = fs.readFileSync(abpath);
			var abfileStr = buf.toString('base64');

			var client = restify.createStringClient({
				url: 'http://localhost:6001'
			});

			var option =
			{ 'abfile': abfileStr, 
				'amount': money ,
				'content-encoding': 'gzip'
			};

			client.put('/pay', option, function(err, request, response, data) {
				if(err) {
					var err_msg = new Array();
					err_msg.push("ERROR: "+data);
					console.log("ERROR: "+data);
					res.render('checkoutfailed', {title: 'E-Commerce',error:err_msg,login:login,user:user});				
				}
				else {
					var abbuf = new Buffer(data,'base64');
					// Write buffer to jar file
					fs.writeFileSync(abpath,abbuf);
					res.render('checkoutsucceed',{title: 'E-Commerce',login: login,user:user});				
				}
			});

		} else {
			var err_msg = new Array();
			err_msg.push("AB not found for this user");
			res.render('checkoutfailed', {title: 'E-Commerce', login: login, user: user, error:err_msg});				
		}

	});

};
