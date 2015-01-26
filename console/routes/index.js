var express = require('express');
var router = express.Router();
var debug = require('debug')('console');
var fs = require('fs');
var db = require('../db')

var ab_gen = 'resources/AB-Gen.jar';
var ab_template = 'resources/AB.jar'

var req_data = [ 'name', 'address', 'credit card', 'email']

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Active Bundle Console' });
});

/* GET service list page */
router.get('/services', function(req, res) {
	db.get_services(function(rows) {
		res.render('services', { title: 'Active Bundle Console', entries: rows });
	});	
});

/* GET service page */
router.get('/service', function(req, res) {
	var obj = JSON.parse(JSON.stringify(req.query));
	obj.data = [];
	obj.data = req_data;
	res.render('service', { title: 'Active Bundle Console', service: obj });	
});

/* GET client page */
router.get('/client', function(req, res) {
	// var obj = JSON.parse(JSON.stringify(req.query));
	// obj.data = [];
	// obj.data = req_data;
	res.render('client', { title: 'Active Bundle Console' });	
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

var generate_ab = function() {
	var exec = require('child_process').exec;
	ab_exec = 'java -jar ' + ab_gen + ' ' + ab_template;
	ab_proc = exec(ab_exec);
	ab_proc.stdout.on('data', function (data) {
		console.log(data);
	});
	ab_proc.stderr.on('data', function (data) {
		console.log(data);
	});	
}

module.exports = router;
