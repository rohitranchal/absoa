var db = require('../db');

exports.browse = function(req, res){
	// session info
	var login = req.session.login;
	var user = req.session.user;

	if(req.query.item){
		res.render('browse_item', {login:login,user:user});
	}
	else{
		db.get_item_info(function(cb) {
			res.render('browse', {item_sell:cb,login:login,user:user});
		});
	}
};
