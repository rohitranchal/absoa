var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Seller Service');
});

router.get('/submit_order', function(req, res) {
	var order = randomIntInc(1000, 9999);
	if (order < 5000) {
		res.send('Submit order failed - items unavailable');
	} else {
		request('http://localhost:4103/ship', function (error, response, body) {
			if (body.search('failed') != -1) {
				res.send('Submit order failed - ' + body);
			} else {
				res.send('Order Num: ' + order + ' - ' + body);
			}
		});
	}
});

function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;