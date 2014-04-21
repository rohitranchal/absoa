var db = require('../db');
var fs = require('fs');
var restify = require('restify');

exports.purchase = function(req, res){
	// session info
	var login = 'yes';
	var user = 'user1';
	var name = 'Alice';
	var creditcard = '1111222233334444';
	var money = 1;

	var bankclient = restify.createStringClient({
		url: 'http://localhost:1200'
	});

	bankclient.put('/pay/'+name+"/"+creditcard+"/"+money, null, function(err, request, response, data) {
		if(err) {
			var err_msg = new Array();
			err_msg.push("ERROR: "+data);
			console.log("ERROR: "+data);
			res.render('checkoutfailed', {title: 'E-Commerce',error:err_msg,login:login,user:user});				
		}
		else {
			// Payment was successful, now use shipping service
			//
			var shipclient = restify.createStringClient({
				url: 'http://localhost:1300'
			});

			var option =
			{ "address" : "University Street, West Lafayette, IN"
			}
			shipclient.put('/ship/'+name, option, function(err, request, response, data) {
				if(err) {
					var err_msg = new Array();
					err_msg.push("ERROR: "+data);
					console.log("ERROR: "+data);
					res.render('checkoutfailed', {title: 'E-Commerce',error:err_msg,login:login,user:user});				
				}

				res.render('checkoutsucceed',{title: 'E-Commerce',login: login,user:user});				
			})
		}
	});


};
