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

exports.get_accounts = function(cb) {
	var sql = 'SELECT * FROM Account WHERE id = 1';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		records.user = rows[0].username;
		records.pass = rows[0].password;
		cb(records);
	});
}

exports.insert_account = function(new_user, new_pass, done) {
	var sql = "INSERT INTO Account(username, password) VALUES('" + new_user + "','" + new_pass + "')";
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if(err) throw err;
		done();
	});
}
