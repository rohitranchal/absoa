
exports.index = function(req, res){
	// session info
	var login = req.session.login;
	var user = req.session.user;

	res.render('index', { title: 'E-Commerce', login:login, user:user});
};
