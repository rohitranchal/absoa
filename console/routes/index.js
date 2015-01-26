var express = require('express');
var router = express.Router();
var debug = require('debug')('console');
var fs = require('fs');
var db = require('../db')

var ab_gen = 'resources/AB-Gen.jar';
var ab_template = 'resources/AB-Template.jar'
var ab_data = 'resources/AB-Data';
var ab_path = 'resources/AB.jar';

var req_data = [ 'name', 'address', 'credit card', 'email']

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
	res.send('scenario_list');
});

/* POST create ab */
router.post('/create', function(req, res) {
	var key1 = req.body.datakey1;
	var value1 = req.body.datavalue1;
	var key2 = req.body.datakey2;
	var value2 = req.body.datavalue2;
	var key3 = req.body.datakey3;
	var value3 = req.body.datavalue3;

	if(key1 !== '' && value1 !== '') {
		// generate_ab();
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

/* POST update service */
router.post('/toggle_service', function(req, res) {
	var obj = req.body;
	if (typeof obj.sid !== 'undefined' && obj.sid !== '') {
		res.send('OK');
	} else {
		debug('POST toggle service: sid undefined');
		res.send(400, 'Bad Request');
	}

	// var svc_id = req.body.service_id;

	// db.get_service(svc_id, function(val){
	// 	var svc_status = val['status'];
	// 	var svc_exec = 'node ../' + val['source_path'] + '/app.js';

	// 	if (svc_status == -1) {
	// 		var exec = require('child_process').exec;
	// 		chld_proc = exec(svc_exec);
	// 		chld_proc.stdout.on('data', function (data) {
	// 		  console.log(data);
	// 		});
	// 		chld_proc.stderr.on('data', function (data) {
	// 		  console.log(data);
	// 		});
	// 		db.set_service_status(svc_id, chld_proc.pid);
	// 		res.redirect('/service_list');
	// 	} else {
	// 		try {
	// 			process.kill(svc_status);
	// 		} catch(e) {
	// 			console.error(e + ' Exception: Killing process with pid: ' + svc_status);
	// 		}
	// 		db.set_service_status(svc_id, -1);
	// 		res.redirect('/service_list');
	// 	}
	// });
});

var generate_ab = function() {
	var exec = require('child_process').exec;
	ab_exec = 'java -jar ' + ab_gen + ' ' + ab_template + ab_data;
	ab_proc = exec(ab_exec);
	ab_proc.stdout.on('data', function (data) {
		console.log(data);
	});
	ab_proc.stderr.on('data', function (data) {
		console.log(data);
	});	
}

module.exports = router;
