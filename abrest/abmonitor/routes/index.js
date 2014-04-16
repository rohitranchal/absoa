
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.send('Okay');
};

exports.ab_state = function(req, res){
  console.log('AB State req received ');
  res.send('State info received');
};

exports.ab_log = function(req, res){
  console.log('AB Log req received ');
  res.send('Log info received');
};