
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
	res.render('index', { title: 'E-commerce',items:items});
};

exports.login = function(req, res){
	res.render('login', { title: 'Login'});
}

exports.checkuser = function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	// TODO: Check email/password in the database to verify user
	 
	// TODO: If the user has been found

	// TODO: If the user is not found
	var states = [ "AA","AE","AP","AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"
	];
	res.render('createAB', {states:states });
}
