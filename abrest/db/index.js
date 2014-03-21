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

exports.get_abpath = function(uname, cb) {
	var sql = "SELECT active_bundle FROM Account WHERE username ='" + uname + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		abpath = rows[0].active_bundle;
		cb(abpath);
	});
}

exports.get_account = function(uname, cb) {
	var sql = "SELECT * FROM Account WHERE username ='" + uname + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		if(rows.length > 0) {
			cb(rows[0]);
		} else {
			cb(null);
		}
	});
}

exports.verify_user = function(uname,pass,cb) {

	var sql = "SELECT password FROM Account WHERE username='"+uname+"'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		// No such user
		if(rows.length<=0){
			result=0;
		}
		else{
			var realpass = rows[0].password;
			var result;
			// Password is correct
			if(realpass==pass){
				result=1;
			}
			// Password is wrong
			else{
				result=-1;
			}
		}
		cb(result);
	});
}

exports.insert_account = function(new_user, new_pass,path, done) {

	var sql = "INSERT INTO Account(username, password,active_bundle, status) VALUES ('" + new_user + "','" + new_pass + "','"+path+"', '-1')";
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if(err) done(0);
		else done(1);
	});
}

exports.get_item_info = function(cb) {
	var sql = 'SELECT * FROM Item';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_one_item = function(id,cb) {
	var sql = 'SELECT * FROM Item WHERE id='+id;
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		//console.log("rows: "+rows.length);
		cb(rows);
	});
}

exports.set_account_status = function(uname, pid) {
	var sql = "UPDATE Account SET status=" + pid + " WHERE username='" + uname +"'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}