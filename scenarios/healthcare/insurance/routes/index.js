var debug = require('debug')('shopping');
var express = require('express');
var router = express.Router();
var request = require('request');
var spawn = require('child_process').spawn;
var async = require('async');
var portscanner = require('portscanner');
var ab_client = require('../ab_client');
var db = require('../db');

var ab_host = '127.0.0.1';
var ab_path = 'resources/AB1.jar';
var ab_lib = 'resources/lib';
var ab_arg = ab_path + ':./' + ab_lib + '/*:.';
var ab_class = 'edu.purdue.absoa.Server';
var req_data = 'ab.user.name';

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Insurance Service');
});

router.get('/check_insurance', function(req, res) {
	var iid = req.query.ins_id;
	var pname = req.query.pat_name;
	var tcode = req.query.tmt_code;
	if (typeof iid !== 'undefined' && iid !== '' && typeof pname !== 'undefined' && pname !== '' && typeof tcode !== 'undefined' && tcode !== '') {
		var cvg = 100000;
		var obj = { coverage:cvg };
		res.send(obj);
	} else {
		res.send(400, 'Error: Parameters undefined');
	}
});

router.post('/check_insurance_ab', function(req, res) {
	// var ab_ehr = req.body.ab;
	var ab_ehr = 'ab';
	var tcode = req.body.tcode;

	if (typeof tcode !== 'undefined' && tcode !== '' && typeof ab_ehr !== 'undefined' && ab_ehr !== '') {
		start_ab(ab_path, function(ab_port, ab_pid) {
			connect_ab(ab_port, ab_host, ab_pid, function(data) {
				var addr = data;
				console.log('ab data: ' + addr);
				var cvg = 100000;
				var obj = { coverage:cvg };
				res.send(obj);
			});
		});
	} else {
		res.send(400, 'Error: Parameters undefined');
	}
});

router.get('/test', function(req, res) {
	start_ab(ab_path, function(ab_port, ab_pid) {
		connect_ab(ab_port, ab_host, ab_pid, function(data) {
			ab_data = data;
		});
	});
	// var ab_port = 5555;
	// var ab_pid = 1111111110;
	// connect_ab(ab_port, ab_host, ab_pid);
	res.send('ok');
});

var start_ab = function(ab_path, cb) {
	var ab_port = randomIntInc(10000, 65000);
	var child =	spawn('java', ['-cp', ab_arg, ab_class, ab_port]);
	console.log('LOG: Started AB on Port: ' + ab_port);
	var ab_pid = child.pid;

	child.stdout.setEncoding('ASCII');
	child.stderr.setEncoding('ASCII');
	child.stdout.on('data', function (data) {
		console.log('LOG(AB): ');
		console.log(data);
	});
	child.stderr.on('data', function (data) {
		console.log('ERR(AB): ');
		console.log(data);
	});
	child.on('close', function (code, signal) {
		console.log('LOG: Terminated AB');
	});
	cb(ab_port, ab_pid);
};

var connect_ab = function(port, host, pid, cb) {
	var ab_start_status = 0;
	async.whilst(
		function () { return ab_start_status == 0; },
		function (callback) {
			// Check if AB is running every 10 ms
			portscanner.checkPortStatus(port, host, function(error, status) {
				if(status == 'open'){
					ab_start_status = 1;
				}
				setTimeout(callback, 10);
			});
		},
		function (err) {
			// AB is running, query the AB for data			
			ab_client.get_data(req_data, port, function(ab_data) {
				process.kill(pid);
				cb(ab_data);
			});
	});
};

function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;
