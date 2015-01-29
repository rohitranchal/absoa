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
var files = fs.readdirSync('./scenarios/');
var scenarios = [];
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			scenarios[scenarios.length] = JSON.parse(data);
		}		
	});
}

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Active Bundle Console' });
});

/* GET client page */
router.get('/client', function(req, res) {
	res.render('client', { title: 'Active Bundle Console' });	
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
	res.render('scenario_list', { title: 'Active Bundle Console', scenario_list: scenarios });
});

/* GET scenario page */
router.get('/scenario', function(req, res) {
	var sc_id = req.query.scenario_id;
	var sc_name = req.query.scenario_name;

	var scenario = null;
	for(var i = 0; i < scenarios.length; i++) {
		if(scenarios[i].id == sc_id) {
			scenario = scenarios[i];
		}
	}
	var tmp_s = scenario.services;

	var se_list = scenario.services.join(',');
	db.get_scenario_services(se_list, function(rows) {
		scenario.services = rows;
		res.render('scenario', scenario);
		scenario.services = tmp_s;
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
});

/* POST start a scenario */
router.post('/try_it', function(req, res) {
	request(req.body.link, function (error, response, body) {
		res.send(body)
	});
});

/* POST create ab */
router.post('/create', function(req, res) {
	var key1 = req.body.datakey1;
	var value1 = req.body.datavalue1;
	var key2 = req.body.datakey2;
	var value2 = req.body.datavalue2;
	var key3 = req.body.datakey3;
	var value3 = req.body.datavalue3;

	//uld 28 Jan - change this if to at least one checkbox must be marked
	if(key1 !== '' && value1 !== '') {
		//write key and value to ab_data file:  ab.user.<key1> = <value1>
		var ab_record = ab_record_begins + key1 + ' = ' + value1 ;
		//for debug res.render('client', {title: 'E-Commerce', message: ab_record});
		fs.writeFile(ab_data, ab_record + "\n", function (err) {
  			if (err) return console.log(err);
  			console.log('ab_data file has been created');
		});
		var ab_record2 = ab_record_begins + key2 + ' = ' + value2 ;
		fs.appendFile(ab_data, ab_record2 + "\n", function (err) {
  			if (err) return console.log(err);
  			console.log('ab_data file has been created');
		});
		var ab_record3 = ab_record_begins + key3 + ' = ' + value3 ;
		fs.appendFile(ab_data, ab_record3 + "\n", function (err) {
  			if (err) return console.log(err);
  			console.log('ab_data file has been created');
		});
		generate_ab();
		var msg = 'SUCCESS: AB Generated';
		res.render('client', {title: 'E-Commerce', message: msg});
	} else {
		var msg = 'ERROR: missing data';
		res.render('client', {title: 'E-Commerce', message: msg});
	}
	// always maintain path to the recently created AB so update global path to AB here when AB is created
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

/* POST toggle service */
router.post('/toggle_service', function(req, res) {
	var svc_id = req.body.service_id;

	db.get_service(svc_id, function(val) {
		var svc_status = val['status'];
		var svc_exec = 'node ../' + val.source_path + '/bin/www';

		if (svc_status == -1) {
			var exec = require('child_process').exec;
			chld_proc = exec(svc_exec);
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
	ab_proc.stderr.on('data', function (data) {
		console.log(data);
	});	
};

module.exports = router;
