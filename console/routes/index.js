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

/* GET create ab page */
router.get('/create', function(req, res) {
	generate_ab();
	res.send('OK');
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

/* POST update service */
router.post('/update_service', function(req, res) {
	console.log('here.............');
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
