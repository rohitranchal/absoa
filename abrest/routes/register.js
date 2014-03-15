var db = require('../db');
var fs = require('fs');

exports.create_account = function(req, res) {
	//res.send("Create Account: respond with a resource");
	res.render('register', {title: 'E-Commerce'});
}

exports.add_account = function(req, res) {
	var uname = req.body.uname;
	var pass = req.body.pass;
	var abpath= req.files.abfile.path;

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
		// Uploaded files
		//console.log('req files: ' + JSON.stringify(req.files));
		//console.log('req abfile: ' + JSON.stringify(req.files.abfile));

		db.insert_account(uname, pass, abpath, function(cb) {
			if(cb == 1){
				res.send('User successfully added to db');
			}
			else{
				// Delete uploaded AB jar file
				
				if (fs.existsSync(abpath)) {
					res.errors.push("File name already exists,updating");
					fs.unlink(abpath, function (err) {
						if (err) response.errors.push("Erorr : " + err);
						console.log('successfully deleted : '+ newPath );
					});
				}
				res.send('ERROR: Cannot create user. User already exists.');
			}
		});
	}
	else{
		console.log('ERROR: register failed');
		if (fs.existsSync(abpath)) {
			response.errors.push("File name already exists,updating");
			fs.unlink(abpath, function (err) {
				if (err) response.errors.push("Erorr : " + err);
				console.log('successfully deleted : '+ newPath );
			});
		}
		res.render('register', {title: 'E-Commerce',error:error});
	}
}
