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
var ab_path = 'resources/AB-New.jar';
var req_data = ['ab.user.name', 'ab.user.payment.type'];

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Medical Service');
});

router.post('/ehr', function(req, res) {
	var pid = req.body.pat_id;
	var ehr = req.body.ehr;
	var emergency = req.body.emergency;

	if (typeof emergency !== 'undefined' && emergency !== '' && emergency !== '0' && typeof pid !== 'undefined' && pid !== '') {
		console.log('emergency case');
		// call ambulance
		request('http://localhost:4204/get_ambulance?ecode=25&address=305', function (error, response, body1) {
			console.log('ambulance: ' + body1);
			// call hospital
			request('http://localhost:4202/emergency?ecode=25&pat_id=5', function (error, response, body2) {
				console.log('hospital: ' + body2);
				res.send('Emergency confirmed: ' + body1 + ' - Hospital notified: ' + body2);
			});
		});
	} else if (typeof pid !== 'undefined' && pid !== '') {
		console.log('regular case');
		// call hospital
		request.post('http://localhost:4202/report', {form:{pat_id:5}});
		// request('?pat_id=5', function (error, response, body2) {
		// 	res.send('EHR updated - ' + body2);
		// });
		res.send('ok');
	} else {
		res.send(400, 'Parameters undefined');
	}
});

router.get('/ab_order', function(req, res) {
	var ab_data = null;
	var msg;

	async.parallel([
		function(callback) {
			start_ab(ab_path, function(ab_port, ab_pid) {
				connect_ab(ab_port, ab_host, ab_pid, function(data) {
					ab_data = data;
					callback(null);
				});
			});			
		},
		function(callback) {
			request('http://localhost:4102/ab_submit_order', function (error, response, body1) {
				if (body1.search('failed') != -1) {
					msg = 'Order failed - ' + body1;
					callback(null);
				} else {
					request('http://localhost:4104/ab_pay', function (error, response, body2) {
						if (body2.search('failed') != -1) {
							msg = 'Order failed - ' + body2;
						} else {
							msg = 'Order complete details - ' + body1;
						}
						callback(null);
					});
				}
			});		
		}
	],
	function(err, results) {
		if (ab_data == null) {
			msg = 'Shopping Failed: AB data unavailable';
			res.send(msg);
		} else {
			res.send(msg);
		}
		var obj = {id:1, log:msg};
		db.set_service_log(obj, function() {});
	});
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
	var ab_port = randomIntInc(10000, 65000)
	var child =	spawn('java',['-jar', ab_path, ab_port]);
	console.log('LOG: Starting AB on Port: ' + ab_port);
	var ab_pid = child.pid;

	child.stdout.setEncoding('ASCII');
	child.stdout.on('data', function (data) {
		console.log('LOG(AB): ');
		console.log(data);
	});
	child.stderr.on('data', function (data) {
		console.log('ERROR(AB): ');
		// console.log(data);
		console.log(new Buffer(data, 'base64'));
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
				console.log('abdata: ' + ab_data);
				process.kill(pid);
				cb(ab_data);
			});
	});
};

function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;
