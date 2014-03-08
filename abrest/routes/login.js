var db = require('../db');
var http = require('http');

exports.verify = function(req, res) {
	var uname = req.body.user.name;
	var pass = req.body.user.pass;

	console.log('verify user: ' + uname);
	db.verify_user(uname, pass,function(cb) {
		// Indicates that the user's password is correct
		if(cb==1){
			//res.send('Password is correct');
			//res.render('browse', {title: 'E-Commerce',user:uname});
			db.get_item_info(function(cb) {
			
					//res.render('browse', {item_sell:cb,user:uname});
					// At this point, the login is successful. We should make a new http get request 
					req.session.user = uname;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
					req.session.login = 'yes';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
					res.redirect('/catalog');
			});
		}
		else if(cb==-1){
			//res.send('Password is wrong');
			var errMsg = new Array();
			errMsg.push( "Wrong password");
			res.render('index', {title: 'E-Commerce',error:errMsg});
		}
		else if(cb==0){
			//res.send('User is not found');
			var errMsg = new Array();
			errMsg.push("User not found");
			res.render('index', {title: 'E-Commerce',error:errMsg});
		}
	});
}

exports.logout = function(req, res) {
	req.session.user = '';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
	req.session.login = 'no';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
	res.redirect('/');
}
