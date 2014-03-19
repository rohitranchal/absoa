var thrift = require('thrift');

var abservice = require('./ABService.js');
var ttypes = require('./ActiveBundle_types.js');

var connection = thrift.createConnection('localhost', 5555);
var client = thrift.createClient(abservice, connection);

connection.on('error', function(err) {
	console.error(err);
});

client.getSLA(function(err, response) {
	if(err) {
		console.error(err);
	} else {
		console.log('Client: get SLA', response);
		client.authenticateChallenge(function(err, response) {
			if(err) {
				console.error(err);
		  	} else {
				console.log('Client: auth challenge', response);
				var sessionKey = '';
				var dataKey = '';

				client.getValue(sessionKey, dataKey, function(err, response) {
					if(err) {
						console.error(err);
				  	} else {
						console.log('Client: get value', response);
						connection.end();
				  	}
				});
		  	}
		});
	}
});



