

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("Received FirstName: "+req.body.fn+", LastName: "+req.body.ln+" ID: "+req.body.id);
};

exports.book = function(req, res){
  var fn = req.body.fn;
  var ln = req.body.ln;
  var id = req.body.id;
  
  
  
  res.render('index', { title: 'Express' });    
 
};
