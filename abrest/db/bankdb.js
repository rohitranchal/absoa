var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'soa_ab',
	multipleStatements: true
});

connection.connect();

var records = new Object();


exports.deduct = function(creditcard, csv,total, done) {

	var sql = "UPDATE Bank SET amount=amount-"+total+" WHERE creditcardnumber='"+creditcard+"' AND csv='"+csv+"';";
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if(err) done(0);
		else done(1);
	});
}
