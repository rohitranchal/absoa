
exports.create_account = function(req, res){
	//res.send("Create Account: respond with a resource");
	res.render('register', {title: 'E-Commerce'});
};