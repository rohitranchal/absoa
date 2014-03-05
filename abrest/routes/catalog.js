var db = require('../db');

exports.browse = function(req, res){
	db.get_item_info(function(cb) {
		res.render('browse', {item_sell:cb});
	});
};
