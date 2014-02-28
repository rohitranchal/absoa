var db = require('../db');

exports.create_account = function(req, res) {
	//res.send("Create Account: respond with a resource");
	res.render('register', {title: 'E-Commerce'});
}

exports.add_account = function(req, res) {
	var uname = req.body.uname;
	var pass = req.body.pass;
	console.log('req body uname: ' + req.body.uname);
	db.insert_account(uname, pass, function() {
		res.send('User successfully added to db');
	});
}
