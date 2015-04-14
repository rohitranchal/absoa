var debug = require('debug')('shipping');
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
var req_data = ['ab.user.shipping.address'];

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Shipping Service');
});

router.get('/ship', function(req, res) {
	var tracking = randomIntInc(10000, 99999);
	// Get address from AB
	var address = '305 N Univ St, West Lafayette IN, 47907';
	var msg;
	if (tracking > 50000) {
		msg = 'Order shipped - Address: ' + address + ' - Tracking num: ' + tracking;
		res.send(msg);
	} else {
		msg = 'Shipping failed - Invalid address';
		res.send(msg);
	}
	var obj = {id:3, log:msg};
	db.set_service_log(obj, function() {});
});

router.get('/ab_ship', function(req, res) {
	var ab_data = null;
	var msg;
	var tracking = randomIntInc(10000, 99999);
	// Get address from AB
	var address = '305 N Univ St, West Lafayette IN, 47907';
	if (tracking > 50000) {
		msg = 'Order shipped - Address: ' + address + ' - Tracking num: ' + tracking;
	} else {
		msg = 'Shipping failed - Invalid address';
	}
	start_ab(ab_path, function(ab_port, ab_pid) {
		ab_data = connect_ab(ab_port, ab_host, ab_pid, function(data) {
			ab_data = data;
			if (ab_data == null) {
				msg = 'Shipping Failed: AB data unavailable';
				res.send(msg);
			} else {
				res.send(msg);
			}
			var obj = {id:3, log:msg};
			db.set_service_log(obj, function() {});
		});
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