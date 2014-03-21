var http = require('http');

var db = require('../db');

exports.verify = function(req, res) {
	var uname = req.body.user.name;
	var pass = req.body.user.pass;

	console.log('verify user: ' + uname);
	db.verify_user(uname, pass,function(cb) {
		// Indicates that the user's password is correct
		if (cb==1) {
			// Successful login, start corresponding AB, create session, redirect to catalog
			db.get_abpath(uname, function(abpath) {
				if (abpath) {
					console.log('abpath: ' + abpath);
					// start ab
					var exec = require('child_process').exec;
					ab_exec = "java -jar " + abpath;
					ab_proc = exec(ab_exec);
					ab_proc.stdout.on('data', function (data) {
					  console.log(data);
					});
					ab_proc.stderr.on('data', function (data) {
					  console.log(data);
					});

					db.set_account_status(uname, ab_proc.pid);

					console.log(uname + ": Login Successful");

					req.session.user = uname;
					req.session.login = 'yes';
					res.redirect('/catalog');

				} else {
					var err_msg = new Array();
					err_msg.push("AB not found for this user");
					res.render('index', {title: 'E-Commerce',error:err_msg});				}
			});

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
	db.get_account(req.session.user, function(acc){
		var ab_pid = acc['status'];
		if (ab_pid != -1) {
			try {
				process.kill(ab_pid);
			} catch(e) {
				console.error(e + ' Exception: Killing AB process with pid: ' + ab_pid);
			}
		}
	});

	db.set_account_status(req.session.user, -1);

	console.log(req.session.user + ": Logout Successful");

	req.session.user = '';
	req.session.login = 'no';
	res.redirect('/');
}
