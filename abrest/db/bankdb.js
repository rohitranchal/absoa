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


exports.deduct = function(name,creditcard,total, done) {

	var sql = "UPDATE BankAccount SET amount=amount-"+total+" WHERE creditcard='"+creditcard+"' AND name='"+name+"';";
	connection.query(sql, function(err, rows, fields) {
		if(err) done(0);
		else if(rows.length==0) done(-1);
		else done(1);
	});
}
