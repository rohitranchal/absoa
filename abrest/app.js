var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');
var register = require('./routes/register');

var service_port = 5555;

var app = express();

// all environments
app.set('port', process.env.PORT || service_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware pipeline
// when req comes, it goes through pipeline
// each middleware returns a function which has a signature like function(req, res, next)

// my middleware
// app.use(function(req, res, next) {
//  // req.url // something like this
//  next(); // can pass err in next in case an err opens
// });
// Browser sends another request to get the icon
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/register', register.create_account);

//for unknown reqs to prevent against attacks
// app.get('/*', function(req, res){
// 	res.send(404);
// })


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
