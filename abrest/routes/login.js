var db = require('../db');

exports.verify = function(req, res) {
	var uname = req.body.user.name;
	var pass = req.body.user.pass;
/*
	// Check user input
	var error = new Array();
	if(uname.length == 0){
		var errMsg = "ERROR: Username can not be NULL";
		error.push(errMsg);
	}
	if(pass.length == 0){
		var errMsg = "ERROR: Username can not be NULL";
		error.push(errMsg);
	}
*/
	console.log('verify user: ' + uname);
	db.verify_user(uname, pass,function(cb) {
		// Indicates that the user's password is correct
		if(cb==1){
			//res.send('Password is correct');
			res.render('browse', {title: 'E-Commerce',user:uname});
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
