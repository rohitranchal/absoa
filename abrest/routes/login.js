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
		// WARNING: This is unfinished, return value is not correct
		if(cb.result==1){
			res.send('Password is correct');
		}
		else{
			res.send('Password is wrong');
		}
	});
}
