

/*
 * GET users listing.
 */

exports.add_item = function(req, res){
	// Three submitted values
	var infoArray = new Array();
	infoArray[0] = req.body.fn;
	infoArray[1] = req.body.ln;
	infoArray[2] = req.body.id;
	res.render('test', { title: 'Expedia', retStr: "Yay, working" });    
};
