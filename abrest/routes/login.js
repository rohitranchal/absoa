var http = require('http');

var db = require('../db');

exports.verify = function(req, res) {
	var uname = req.body.user.name;
	var pass = req.body.user.pass;

	console.log('verify user: ' + uname);
	db.verify_user(uname, pass,function(cb) {
		// Indicates that the user's password is correct
		if (cb==1) {
			// Why are items fetched here?
			// db.get_item_info(function(cb) {
			// 		// Login is successful. Redirect to catalog
			// 		db.get_abpath

			// 		req.session.user = uname;
			// 		req.session.login = 'yes';
			// 		res.redirect('/catalog');
			// });

			// Successful login, start corresponding AB, create session, redirect to catalog
			db.get_abpath(uname, function(abpath) {
				console.log('abpath: ' + abpath);
				// start ab
				var exec = require('child_process').exec;
				ab_exec = "java -jar " + abpath;
				ab_proc = exec(ab_exec, function callback(error, stdout, stderr) {
				    console.log(stderr);
				});
			});
			req.session.user = uname;
			req.session.login = 'yes';
			res.redirect('/catalog');

		} else if (cb==-1) {
			var err_msg = new Array();
			err_msg.push("Wrong password");
			res.render('index', {title: 'E-Commerce',error:err_msg});
		} else if (cb==0) {
			var err_msg = new Array();
			err_msg.push("User not found");
			res.render('index', {title: 'E-Commerce',error:err_msg});
		}
	});
}

exports.logout = function(req, res) {
	// Stop AB process
	req.session.user = '';
	req.session.login = 'no';
	res.redirect('/');
}
