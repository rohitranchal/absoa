var debug = require('debug')('shipping');
var express = require('express');
var router = express.Router();
var request = require('request');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Shipping Service');
});

router.get('/ship', function(req, res) {
	var tracking = randomIntInc(10000, 99999);
	// Get address from AB
	var address = '305 N Univ St, West Lafayette IN, 47907';
	if (tracking > 50000) {
		res.send('Order shipped - Address: ' + address + ' - Tracking num: ' + tracking);
	} else {
		res.send('Shipping failed - Invalid address');
	}
});

function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;