var db = require('../db');
var fs = require('fs');

exports.create_account = function(req, res) {
	//res.send("Create Account: respond with a resource");
	res.render('register', {title: 'E-Commerce'});
}

exports.add_account = function(req, res) {
	var uname = req.body.uname;
	var pass = req.body.pass;
	var tmppath = req.files.abfile.path;

	var abpath = tmppath.split("/").slice(0,-1).join("/") + "/" + uname + ".jar";
	fs.rename(tmppath, abpath, function(err) {
		if (err) throw err;
  		console.log('renamed complete');
	});

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
		db.insert_account(uname, pass, abpath, function(cb) {
			if(cb == 1){
				res.send('User successfully added to db');
			}
			else{
				// Delete uploaded AB jar file

				if (fs.existsSync(abpath)) {
					response.errors.push("File name already exists,updating");
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
