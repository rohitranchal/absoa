var express = require('express');
var router = express.Router();
var fs = require('fs');

var db = require('../db')

var ab_gen = 'resources/AB-Gen.jar';
var ab_template = 'resources/AB.jar'

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Active Bundle Console' });
});

/* GET create ab */
router.get('/create', function(req, res) {
	generate_ab();
	res.send('OK');
});

/* GET create ab */
router.get('/services', function(req, res) {
	var arr = [ { id: '1', name: 's1', rating: '5', trust: '5', req_data: 'zip', status: '0' },
				{ id: '2', name: 's2', rating: '5', trust: '5', req_data: 'zip', status: '0' }
			];
	db.get_services(function(rows) {
		res.render('services', { title: 'Active Bundle Console', entries: rows });
	});
	
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
