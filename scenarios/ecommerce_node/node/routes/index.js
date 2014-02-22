
/*
 * GET home page.
 */

exports.index = function(req, res){
	// Fake list of available goods
	// Will find more sophisticated way to create such a list
	var items = [
		['MacBookAir',1800,0,1],
		['Nexus 5',300,0,1],
		['IPhone 5S',600,0,1]
	];
	res.render('index', { title: 'E-commerce',items:items});
};

exports.login = function(req, res){
	res.render('login', { title: 'Login'});
}

exports.checkuser = function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	// TODO: Check email/password in the database to verify user
	 
	// TODO: If the user has been found

	// TODO: If the user is not found
	res.render('test', { retStr: 'check user'});
}
