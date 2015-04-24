var express = require('express');
var router = express.Router();
var debug = require('debug')('console');
var fs = require('fs');
var request = require('request');
var db = require('../db')

var ab_gen = 'resources/AB-Gen.jar';
var ab_template = 'resources/AB-Template.jar';
var ab_data = 'resources/AB-Data';
var ab_path = 'resources/AB-New.jar';
var ab_record_begins = 'ab.user.';
var req_data = [ 'name', 'address', 'credit card', 'email'];

/* Load all availbale scenarios */
console.log('Loading scenarios ... ');
var files = fs.readdirSync('./scenarios/applications/');
var scenarios = [];
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/applications/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			scenarios[scenarios.length] = JSON.parse(data);
		}		
	});
}
files = fs.readdirSync('./scenarios/models/');
var models = [];
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/models/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			models[models.length] = JSON.parse(data);
		}		
	});
}

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Active Bundle Console' });
});

/* GET test page. */
router.get('/test', function(req, res) {
	var id = 4;
	db.get_service_log(id, function(rows) {
		res.send(rows[0]);
	});
});

/* GET client page */
router.get('/client', function(req, res) {
	db.get_service_data(function(rows) {
		console.log('rows: ' + rows[0].data_key + ' = ' + rows[0].data_value);
		db.get_policy(function(policies) {
			console.log('policies: ' + policies[0].id + ' ; ' + policies[0].policy + ' ; ' + policies[0].rules);
			var obj = JSON.parse(policies[0].rules);
			console.log('obj: ' + obj);
			console.log('obj data: ' + obj.rating + ' ; credit limit=' + obj.credit_limit);
				db.get_services(function(services) {
					console.log('service.display_name and req_data:  ' + services[0].display_name + ' ; ' + services[0].req_data);
					res.render('client', { title: 'Active Bundle Console', entries: rows, entries_pol: policies, entries_srv: services });
				});	
		});	
	});
});

/* GET service list page */
router.get('/service_list', function(req, res) {
	db.get_services(function(rows) {
		res.render('service_list', { title: 'Active Bundle Console', entries: rows });
	});	
});

/* GET service page */
router.get('/service', function(req, res) {
	var obj = JSON.parse(JSON.stringify(req.query));
	obj.data = [];
	obj.data = req_data;
	res.render('service', { title: 'Active Bundle Console', service: obj });	
});

/* GET scenario list page */
router.get('/scenario_list', function(req, res) {
	res.render('scenario_list', { title: 'Active Bundle Console', scenario_list: scenarios, model_list: models });
});

/* GET scenario page */
router.get('/scenario', function(req, res) {
	var sc_id = req.query.scenario_id;
	var sc_name = req.query.scenario_name;
	var ml_id = req.query.model_id;
	var ml_name = req.query.model_name;
	var list = null;
	if (typeof sc_id !== 'undefined' && sc_id !== '') {
		for(var i = 0; i < scenarios.length; i++) {
			if(scenarios[i].id == sc_id) {
				list = scenarios[i];
			}
		}
	} else if (typeof ml_id !== 'undefined' && ml_id !== '') {
		for(i = 0; i < models.length; i++) {
			if(models[i].id == ml_id) {
				list = models[i];
			}
		}
	}
	var tmp_s = list.services;
	var se_list = list.services.join(',');
	db.get_scenario_services(se_list, function(rows) {
		list.services = rows;
		res.render('scenario', list);
		list.services = tmp_s;
	});
});

/* Return scenario topology to the scenario viewer */
router.get('/scenario_topology', function(req, res) {
	var s_id = req.query.s_id;
	for(var i = 0; i < scenarios.length; i++) {
		if(scenarios[i].id == s_id) {
			var top = JSON.stringify(scenarios[i]);
			res.send(top);
		}
	}
	for(var i = 0; i < models.length; i++) {
		if(models[i].id == s_id) {
			var top = JSON.stringify(models[i]);
			res.send(top);
		}
	}
});

/* GET trust_level for a service */
router.get('/get_service_trust', function(req, res) {
	var service_id = req.query.service_id;
	if (typeof service_id !== 'undefined' && service_id !== '') {
		db.get_service_trust(service_id, function(rows) {
			var trust_level = rows[0].trust_level.toString();
			res.send(trust_level);
		});
	} else {
		res.send(400, 'ERROR: service_id undefined');
	}
});

/* GET context for a service */
router.get('/get_service_context', function(req, res) {
	var service_id = req.query.service_id;
	if (typeof service_id !== 'undefined' && service_id !== '') {
		db.get_service_context(service_id, function(rows) {
			res.send(rows[0].context);
		});
	} else {
		res.send(400, 'ERROR: service_id undefined');
	}
});

/* GET logs for services of a scenario */
router.get('/scenario_logs', function(req, res) {
	var slist = JSON.parse(req.query.service_list);
	db.get_service_list_log(slist, function(rows) {
		var logs = [];
		if (rows.length > 0) {
			for (var i=0; i<rows.length; i++) {
				logs[i] = {};
				logs[i].id = rows[i].service_id;
				logs[i].log = rows[i].log;
			}
		}
		res.send(logs);
	});
});

/* DELETE logs for services of a scenario */
router.post('/scenario_logs', function(req, res) {
	var slist = JSON.parse(req.query.service_list);
	db.clear_service_list_log(slist);
	res.send('OK');
});

/* POST start a scenario */
router.post('/try_it', function(req, res) {
	var pid = req.body.pat_id;
	var tamper = req.body.tamper;
	if (typeof pid !== 'undefined' && pid !== '') {
		request.post({
			url:req.body.link, 
			form: { pat_id:pid, tamper:tamper }
		}, function(error, response, body) {
			res.send(body);
		});
	} else {
		var service_link = req.body.link + '/?tamper=' + tamper;
		request(service_link, function (error, response, body) {
			res.send(body)
		});
	}
});

/* POST healthcare update requests */
router.post('/healthcare_update', function(req, res) {
	var patient_id = req.body.patient_id;
	var prescription = req.body.prescription;
	var test_prescription = req.body.test_prescription;
	var medical_data = req.body.medical_data;
	var name = req.body.name;
	var service_link = req.body.link;
	if (typeof patient_id !== 'undefined' && patient_id !== '') {
		var form_obj = { patient_id:patient_id };
		if (typeof prescription !== 'undefined' && prescription !== '') {
			form_obj.prescription = prescription;
		}
		if (typeof test_prescription !== 'undefined' && test_prescription !== '') {
			form_obj.test_prescription = test_prescription;
		}
		if (typeof medical_data !== 'undefined' && medical_data !== '') {
			form_obj.medical_data = medical_data;
		}
		if (typeof name !== 'undefined' && name !== '') {
			form_obj.name = name;
		}
		request.post({
			url:service_link,
			form: form_obj
		}, function(error, response, body) {
			res.send(body);
		});
	} else {
		res.send(400, 'ERROR: patient_id undefined');
	}
});

/* POST healthcare get requests */
router.post('/healthcare_get', function(req, res) {
	var patient_id = req.body.patient_id;
	var ab_request = req.body.ab_request;
	var tamper = req.body.tamper;
	var emergency = req.body.emergency;
	var service_link = req.body.link + '?patient_id=' + patient_id + '&ab_request=' + ab_request + '&tamper=' + tamper + '&emergency=' + emergency;
	if (typeof patient_id !== 'undefined' && patient_id !== '') {
		request(service_link, function (error, response, body) {
			res.send(body);
		});
	} else {		
		res.send(400, 'ERROR: patient_id undefined');
	}
});

/* POST tamper requests */
router.post('/tamper', function(req, res) {
	var status = req.body.status;
	var scenario_id = req.body.scenario_id;
	var service_link;
	if (scenario_id == 2) {
		service_link = 'http://localhost:4201/tamper?status=' + status;
		request(service_link, function (error, response, body) {
			res.send(body);
		});
	} else {
		res.send(400, 'Tamper Error');
	}
});

/* POST create ab */
router.post('/client', function(req, res) {
	var val1 = req.body.value1;
	var k1 = req.body.key1;
	var val2 = req.body.value2;
	var k2 = req.body.key2;

	console.log('[routes/index.js]: Following fields were typed: ');
	console.log('key1 =  ' + k1 + ' ; value1 = ' + val1);
	console.log('key2 =  ' + k2 + ' ; value2 = ' + val2);

	fs.writeFile(ab_data, '' , function (err) {
		if (err) return console.log(err);
	  	console.log('File {' + ab_data + '} content has been cleaned as a pre-requisite for AB ');
	});
		
	var msg = 'SUCCESS: AB has been generated';
	res.render('client', {title: 'E-Commerce', message: msg});
});

/* POST update service */
router.post('/update_service', function(req, res) {
	var obj = req.body;
	if (typeof obj.sid !== 'undefined' && obj.sid !== '') {
		db.update_service(obj);
		res.send('OK');
	} else {
		debug('POST update service: sid undefined');
		res.send(400, 'Bad Request');
	}	
});

/* POST update service trust */
router.post('/update_service_trust', function(req, res) {
	var values = req.body.values;
	for(var i = 0; i < values.length; i++) {
		db.set_service_trust(values[i].name, values[i].value);
	}
	res.send('OK');
});

/* POST update service context */
router.post('/update_service_context', function(req, res) {
	var service_id = req.body.service_id;
	var context = req.body.context;	
	db.set_service_context(service_id, context);
	res.send('OK');
});

/* POST update scenario context */
router.post('/update_scenario_context', function(req, res) {
	var slist = JSON.parse(req.body.service_list);
	var context = req.body.context;
	db.set_scenario_context(slist, context);
	res.send('Context changed to: ' + context.toUpperCase());
});

/* POST toggle service */
router.post('/toggle_service', function(req, res) {
	var svc_id = req.body.service_id;

	db.get_service(svc_id, function(val) {
		var svc_status = val['status'];
		var svc_exec = 'node bin/www';
		var svc_dir = process.cwd() + '/../' + val.source_path;
		if (svc_status == -1) {
			var exec = require('child_process').exec;
			chld_proc = exec(svc_exec, { cwd: svc_dir });
			chld_proc.stdout.on('data', function (data) {
			  console.log(data);
			});
			chld_proc.stderr.on('data', function (data) {
			  console.log(data);
			});
			db.set_service_status(svc_id, chld_proc.pid);
			res.redirect('/service_list');
		} else {
			try {
				process.kill(svc_status);
			} catch(e) {
				console.error(e + ' Exception: Killing process with pid: ' + svc_status);
			}
			db.set_service_status(svc_id, -1);
			res.redirect('/service_list');
		}
	});
});

var generate_ab = function() {
	var exec = require('child_process').exec;
	ab_exec = 'java -jar ' + ab_gen + ' ' + ab_template + ' ' + ab_data  + ' ' + ab_path;
	ab_proc = exec(ab_exec);
	ab_proc.stdout.on('data', function (data) {
		console.log(data);
	});
	// //ab_proc.stderr.on('data', function (data) {
	// 	console.log(data);
	// });	
};

module.exports = router;
