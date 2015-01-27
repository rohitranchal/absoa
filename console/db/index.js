var debug = require('debug')('console');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'abconsole',
	multipleStatements: true
});
connection.connect();

/* Get info for all services */
exports.get_services = function(cb) {
	var query = "SELECT * FROM Service";
	debug('Get services: ' + query);
	connection.query(query, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

/* Update service params */
exports.update_service = function(obj) {
	var query = "UPDATE Service SET rating= " + obj.rating + ", trust_level=" + obj.trust + ", req_data='" + obj.data + "' WHERE id=" + obj.sid;
	debug('Update service: ' + query);
	connection.query(query, function(err, rows, fields) {
		if (err) throw err;
	});
}

/* Get services of a scenario */
exports.get_scenario_services = function(services, cb) {
	var query = 'SELECT * FROM Service WHERE id IN (' + services + ')';
	debug('Get scenario services: ' + query);
	connection.query(query, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

/* ================================================ */

/*
 * Returns the set of services that called the given
 */
exports.get_caller_services = function(service, cb) {
	var sql = 'SELECT id, trust_level from Service WHERE ID IN (SELECT DISTINCT from_service FROM Interaction WHERE to_service=' + service + ')';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_services_of_scenario = function(services, cb) {
	var sql = 'SELECT * FROM Service WHERE id IN (' + services + ')';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.add_service = function(name, trust_level) {
	connection.query("INSERT INTO Service(name, trust_level) VALUES ('" + name + "'," + trust_level + ")", function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.get_service = function(id, cb) {
	connection.query("SELECT * FROM Service WHERE id =" + id, function(err, rows, fields) {
		if (err) throw err;
		if(rows.length > 0) {
			cb(rows[0]);
		} else {
			cb(null);
		}

	});
}



exports.get_service_id = function(name, cb) {
	var sql = "SELECT id FROM Service WHERE name='" + name + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows[0].id);
	});
}


exports.update_service_params = function(sid, val, done) {
	var sql = "UPDATE Service SET params ='" + val + "' WHERE id=" + sid;
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		done();
	});
}

exports.get_service_trust_level_for_module = function(id, trust_module, cb) {
	connection.query("SELECT trust_level FROM Service_Trust WHERE service_id=" + id + " AND trust_module = '" + trust_module + "'", function(err, rows, fields) {
		if (err) throw err;
		if(rows.length == 0) {
			cb(-1);
		} else {
			cb(rows[0]);
		}
	});
}

//Returns trust levels for multiple services
exports.get_services_trust_level_for_module = function(ids, trust_module, cb) {
	var sql = "SELECT Service.id, Service.display_name, trust_level " +
				"FROM Service_Trust JOIN Service ON Service_Trust.service_id = Service.id " +
				"WHERE service_id IN (" + ids.join() + ") AND trust_module = '" + trust_module + "'";

	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		if(rows.length == 0) {
			cb(trust_module, -1);
		} else {
			cb(trust_module,  rows);
		}
	});
}

exports.get_trust_configuration = function(module_name, cb) {
	var sql = "SELECT data FROM Trust_Configurations WHERE id = '" + module_name + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err)
			throw err;
		cb(rows[0]);
	});
}

exports.set_trust_configuration = function(module_name, data) {
	var sql = "INSERT INTO Trust_Configurations VALUES('" + module_name + "','" + data + "') ON DUPLICATE KEY UPDATE data = '" + data + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err)
			throw err;
	});
}

exports.set_service_trust_level_for_module = function(id, trust_module, trust_level) {
	var sql = "INSERT INTO Service_Trust(service_id, trust_module, trust_level, last_updated) " +
				"VALUES (" + id + " ,'" + trust_module + "', " + trust_level + " , NOW()) " +
				"ON DUPLICATE KEY UPDATE trust_level =" + trust_level + ", last_updated=NOW()";

	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

//TODO: Update the following to describe a service grade from the point of view of the monitor
exports.set_service_trust_level = function(id, trust_level) {
	//TODO Check and remove
	// connection.query("UPDATE Service SET trust_level= " + trust_level + " WHERE id=" + id, function(err, rows, fields) {
	// 	if (err) throw err;
	// });
}

exports.set_service_status = function(id, status_val) {
	connection.query("UPDATE Service SET status= " + status_val + " WHERE id=" + id, function(err, rows, fields) {
		if (err) throw err;
	});
}


exports.set_interaction_trust_level_for_module = function(interaction_id, trust_module, from_pre, from_post, to_pre, to_post) {
	var sql = "INSERT INTO Interaction_Trust(interaction_id, trust_module, from_pre, from_post, to_pre, to_post) " +
				"VALUES ('" + interaction_id + "' ,'" + trust_module + "', " + from_pre +
					" , " + from_post + " , " + to_pre  + " , " + to_post+ ") ";

	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.add_interaction = function(from, to, start, end, data, feedback, cb) {

	if(typeof from == 'undefined') {
		from = null;
	}

	if(typeof to == 'undefined') {
		to = null;
	}

	if(typeof start == 'undefined') {
		start = null;
	}

	if(typeof end == 'undefined') {
		end = null;
	}

	if(typeof data == 'undefined') {
		data = null;
	}

	if(typeof feedback == 'undefined') {
		feedback = null;
	}

	var interaction_id = uuid.v4();

	var sql = "INSERT INTO Interaction(id, from_service, to_service, start, end," +
					"data, feedback) " +
				"VALUES ('" +
					interaction_id + "','" + from + "','" + to  + "'," +  start  + "," + end + ",'" +
					data + "','" + feedback + "')";

	connection.query(sql, function(err, rows, fields) {
		if (err) {
			throw err;
		} else {

			// get interaction id here
			cb(interaction_id);
		}
	});
}

/*
 * Return interaction record details for the given id
 */
exports.get_interaction_data = function(interaction_id, cb) {
	var sql =  "SELECT * FROM Interaction WHERE id = '" + interaction_id + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows[0]);
	});
}

exports.get_interactions = function(cb) {
	var sql = "SELECT f.display_name AS from_service, t.display_name AS to_service, i.start, i.end, (i.end - i.start) AS duration, i.ts, i.data, i.feedback " +
				"FROM Interaction i INNER JOIN Service f ON f.id = i.from_service INNER JOIN Service t ON t.id = i.to_service WHERE i.start IS NOT NULL ORDER BY i.start";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_servicce_interactions = function(from, to, size, cb) {
		var sql =  "SELECT * FROM Interaction WHERE from_service = '" + from + "' and to_service = '" + to + "' and feedback <> 'null' order by ts DESC LIMIT " + size;
		connection.query(sql, function(err, rows, fields) {
			if (err) throw err;
			cb(rows);
		});
	}

exports.add_stat = function(service, data) {

	var sql = "INSERT INTO Heartbeat_Data(service, data) " +
				"VALUES ('" + service + "','" + data  + "')";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.add_inflow_data = function(service, request_ts, from_ip, protocol, data) {

	var sql = "INSERT INTO Inflow_Data(service, request_ts, from_ip, protocol, data) " +
				"VALUES ('" + service + "','" + request_ts + "','" + from_ip + "','" + protocol + "','" + data  + "')";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}


exports.get_all_hb_items = function(cb) {
	var sql = "SELECT id, ts, service FROM Heartbeat_Data";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_hb_item_data = function(id, cb) {
	var sql = "SELECT * FROM Heartbeat_Data WHERE id=" + id;
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_hb_service_data = function(service, cb) {
	var sql = "SELECT * FROM Heartbeat_Data WHERE service='" + service + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.inflow_service_req_rates = function(service, cb) {
	var sql = "SELECT request_ts DIV 1000 as second, COUNT(*) as count" +
				" FROM Inflow_Data " +
				" WHERE service='" + service + "'" +
				" GROUP BY request_ts DIV 1000 " +
				" ORDER BY request_ts DIV 1000 DESC LIMIT 20";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}


exports.get_interaction_trust_data_to_service = function(service, cb) {
	var sql = 'SELECT * FROM Interaction JOIN Interaction_Trust ON Interaction.id = Interaction_Trust.interaction_id ' + 
			'WHERE Interaction.start IS NOT NULL AND Interaction.to_service = ' + service + 
			' ORDER BY Interaction.start';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_interaction_trust_data_from_service = function(service, cb) {
	var sql = 'SELECT * FROM Interaction JOIN Interaction_Trust ON Interaction.id = Interaction_Trust.interaction_id ' + 
			'WHERE Interaction.start IS NOT NULL AND Interaction.from_service = ' + service + 
			' ORDER BY Interaction.start';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_interaction_trust_modules_to_service = function(service, cb) {
	var sql = 'SELECT DISTINCT trust_module FROM Interaction JOIN Interaction_Trust ON Interaction.id = Interaction_Trust.interaction_id ' + 
			'WHERE Interaction.start IS NOT NULL AND Interaction.to_service = ' + service + 
			' ORDER BY Interaction.start';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_interaction_trust_modules_from_service = function(service, cb) {
	var sql = 'SELECT DISTINCT trust_module FROM Interaction JOIN Interaction_Trust ON Interaction.id = Interaction_Trust.interaction_id ' + 
			'WHERE Interaction.start IS NOT NULL AND Interaction.from_service = ' + service + 
			' ORDER BY Interaction.start';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}