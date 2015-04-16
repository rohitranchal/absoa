var debug = require('debug')('hospital');
var express = require('express');
var router = express.Router();
var request = require('request');
var spawn = require('child_process').spawn;
var async = require('async');
var portscanner = require('portscanner');
var fs = require('fs');
var path = require('path');

var ab_client = require('../ab_client');
var db = require('../db');

var ab_data_file = 'resources/data.json';
var ab_data = JSON.parse(fs.readFileSync(ab_data_file, 'utf8'));
var ab_resource_dir = 'resources';
var cipher_file = 'resources/cipher.json';
var policy_file = 'resources/policy-0';
var policy_tamper_file = 'resources/policy-tampered';
var ab_enc = 'resources/AB-Enc.jar';
var ab_gen = 'resources/AB-Gen.jar';
var ab_cipher_file = 'resources/src/main/resources/cipher.json';
var ab_policy_file = 'resources/src/main/resources/policy/policy-0';
var ab_template = 'resources/AB-healthcare.jar';
var ab_jar = 'resources/target/AB-code-Tamper-Resistance-1.0-SNAPSHOT.jar'

var ab_host = '127.0.0.1';
var ab_lib = 'resources/lib';
var ab_class = 'edu.purdue.absoa.Server';
var req_data = 'ab.user.name';

var patient_id = '001122';

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Hospital Service');
});

/* GET AB for a patient ID */
router.get('/get_ehr', function(req, res) {
	var patient_id = req.query.patient_id;
	if (typeof patient_id !== 'undefined' && patient_id !== '') {
		var ab_file = ab_resource_dir + '/' +  patient_id + '.jar';
		var buf = fs.readFileSync(ab_file);
		var ab_bytes = buf.toString('base64');
		res.send(ab_bytes);
	} else {
		res.send(400, 'Error: get_ehr parameters undefined');	
	}
});

/* POST data for a patient ID */
router.post('/update_ehr', function(req, res) {
	var patient_id = req.body.patient_id;
	var prescription = req.body.prescription;
	var test_prescription = req.body.test_prescription;
	var medical_data = req.body.medical_data;
	var name = req.body.name;
	if (typeof patient_id !== 'undefined' && patient_id !== '') {
		if (typeof prescription !== 'undefined' && prescription !== '') {
			ab_data['ab.user.history'] = ab_data['ab.user.history'] + ', ' + ab_data['ab.user.prescription'];
			ab_data['ab.user.prescription'] = prescription;
		}
		if (typeof test_prescription !== 'undefined' && test_prescription !== '') {
			ab_data['ab.user.test_prescription'] = test_prescription;
		}
		if (typeof medical_data !== 'undefined' && medical_data !== '') {
			ab_data['ab.user.history'] = ab_data['ab.user.history'] + ', ' + ab_data['ab.user.medical_data'];
			ab_data['ab.user.medical_data'] = medical_data;
		}
		if (typeof name !== 'undefined' && name !== '') {
			ab_data['ab.user.name'] = name;
		}
		var ab_data_str = JSON.stringify(ab_data);
		fs.writeFile(ab_data_file, ab_data_str, function(err) {
			if (err) throw err;
			encrypt_ab_data(function() {
				generate_ab(patient_id, function() {
					res.send('EHR updated');
				});
			});
		});	
	} else {
		res.send(400, 'Error: update_ehr parameters undefined');	
	}
});

/* GET tamper requests */
router.get('/tamper', function(req, res) {
	var status = req.query.status;
	if (status == 1) {
		fs.createReadStream(policy_tamper_file).pipe(fs.createWriteStream(ab_policy_file));
		generate_ab(patient_id, function() {
			res.send('Active Bundle Tampered');
		});		
	} else {
		fs.createReadStream(policy_file).pipe(fs.createWriteStream(ab_policy_file));
		generate_ab(patient_id, function() {
			res.send('Active Bundle Restored');
		});		
	}
});

router.get('/test', function(req, res) {
	start_ab(ab_file, function(ab_port, ab_pid) {
		connect_ab(ab_port, ab_host, ab_pid, function(data) {
			res.send(data);
		});
	});
});

var start_ab = function(ab_file, cb) {
	var ab_port = randomIntInc(10000, 65000);
	var ab_arg = ab_file + ':./' + ab_lib + '/*:.';
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
			ab_client.get_data(req_data, port, function(data) {
				process.kill(pid);
				cb(data);
			});
	});
};

var encrypt_ab_data = function(cb) {
	var exec = require('child_process').exec;
	abenc_exec = 'java -jar ' + ab_enc + ' ' + ab_data_file + ' ' + ab_resource_dir + ' ' + cipher_file;
	ab_proc = exec(abenc_exec);
	ab_proc.stdout.on('data', function (data) {
		// console.log(data);
	});
	ab_proc.stderr.on('data', function (data) {
		console.log(data);
	});
	ab_proc.on('close', function(code, signal) {
		cb();
	});
};

// var generate_ab = function(pat_id, cb) {
// 	var exec = require('child_process').exec;
// 	abgen_exec = 'java -jar ' + ab_gen + ' ' + ab_template + ' ' + cipher_file  + ' ' + ab_resource_dir + '/' +  pat_id + '.jar';
// 	ab_proc = exec(abgen_exec);
// 	ab_proc.stdout.on('data', function (data) {
// 		console.log(data);
// 	});
// 	ab_proc.stderr.on('data', function (data) {
// 		console.log(data);
// 	});
// 	cb();
// };
var generate_ab = function(pat_id, cb) {
	var exec = require('child_process').exec;
	fs.createReadStream(cipher_file).pipe(fs.createWriteStream(ab_cipher_file));
	var child_dir = path.resolve(process.cwd(), ab_resource_dir);
	abgen_exec = 'mvn clean install -q';
	ab_proc = exec(abgen_exec, {cwd: child_dir});
	ab_proc.stdout.on('data', function (data) {
		console.log(data);
	});
	ab_proc.stderr.on('data', function (data) {
		console.log(data);
	});
	ab_proc.on('close', function(code, signal) {
		fs.createReadStream(ab_jar).pipe(fs.createWriteStream(ab_resource_dir + '/' + pat_id + '.jar'));
		cb();
	});
};

var randomIntInc = function(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
};

module.exports = router;
