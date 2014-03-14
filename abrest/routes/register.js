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

	// Check user input
	var err_msg = new Array();

	if(req.files.abfile.size == 0) {
		err_msg.push("ERROR: AB is unspecified");
	} else {
		var abpath = tmppath.split("/").slice(0,-1).join("/") + "/" + uname + ".jar";
		fs.rename(tmppath, abpath, function(err) {
			if (err) throw err;
	  		console.log('renamed complete');
		});
	}

	if(uname.length == 0){
		err_msg.push("ERROR: Username can't be empty");
	}

	if(pass.length == 0){
		err_msg.push("ERROR: Password can't be empty");
	}

	if(err_msg.length == 0){
		console.log('req body uname: ' + req.body.uname);
		db.insert_account(uname, pass, abpath, function(cb) {
			if(cb == 1){
				//res.send('User successfully added to db');
				var succ_msg = new Array();
				succ_msg.push( "Registration successful, login...");
				res.render('register', {title: 'E-Commerce', message: succ_msg});
			} else {
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
	} else {
		console.log('ERROR: register failed');
		if (fs.existsSync(abpath)) {
			response.errors.push("File name already exists,updating");
			fs.unlink(abpath, function (err) {
				if (err) response.errors.push("Error : " + err);
				console.log('successfully deleted : '+ newPath );
			});
		}
		res.render('register', {title: 'E-Commerce',error: err_msg});
	}
}
