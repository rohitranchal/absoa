var db = require('../db');

exports.create_account = function(req, res) {
	//res.send("Create Account: respond with a resource");
	res.render('register', {title: 'E-Commerce'});
}

exports.add_account = function(req, res) {
	var uname = req.body.uname;
	var pass = req.body.pass;

	// Uploaded files
	console.log('req files: ' + JSON.stringify(req.files));
	console.log('req abfile: ' + JSON.stringify(req.files.abfile));

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

	if(error.length==0){
		console.log('req body uname: ' + req.body.uname);
		db.insert_account(uname, pass, fn,function() {
			res.send('User successfully added to db');
		});
	}
	else{
		console.log('ERROR: register failed');
		res.render('register', {title: 'E-Commerce',error:error});
	}
}
