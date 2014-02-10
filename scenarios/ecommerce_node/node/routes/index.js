
/*
 * GET home page.
 */

exports.index = function(req, res){
	// Fake list of available goods
	// Will find more sophisticated way to create such a list
	var items = [
		['MacBookAir',1800,0,1],
		['Nexus 5',300,0,1],
		['IPhone 5S',600,0,1]
	];
	res.render('index', { title: 'Expedia',items:items});
};
