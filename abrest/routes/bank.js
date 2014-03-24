var db = require('../db/bankdb');

exports.deduct = function (req, res, next) {
	  var creditcard = req.params.creditcard;
	  var csv = req.params.csv;
	  var total = req.params.total;
		db.deduct( creditcard,csv,total, function(cb){
			if(cb==0){
				console.log("ERROR: Can not pay the money");
			}
			else if(cb==1){
				console.log("LOG: Money paid successfully");
			}
		});
		console.log();
}
