var debug = require('debug')('shopping');
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Shopping Service');
});

router.get('/order', function(req, res) {
	request('http://localhost:4102/submit_order', function (error, response, body1) {
		if (body1.search('failed') != -1) {
			res.send('Order failed - ' + body1);
		} else {
			request('http://localhost:4104/pay', function (error, response, body2) {
				if (body2.search('failed') != -1) {
					res.send('Order failed - ' + body2);
				} else {
					res.send('Order complete details - ' + body1);
				}
			});
		}
	});
	// parse ab
	// start ab
	// get data
	// diplay data on console
	// send request to seller
});

module.exports = router;
