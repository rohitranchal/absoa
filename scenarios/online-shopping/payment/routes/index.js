var debug = require('debug')('payment');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.send('Payment Service');
});

router.get('/pay', function(req, res) {
	//get payment details from AB
	var payment = randomIntInc(0, 1);
	if(payment) {
		res.send('Payment done');
	} else {
		res.send('Payment failed');
	}	
});

function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;