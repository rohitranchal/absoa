var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var routes = require('./routes');
var register = require('./routes/register');
var login = require('./routes/login');
var catalog = require('./routes/catalog');
var checkout = require('./routes/checkout');
var checkout_test = require('./routes/checkout_test');
//var tmp = require('./routes/tmp');

var service_port = 5000;
var AB_dir = "/abfiles";

console.log("LOG: Check "+__dirname+AB_dir);
if(!fs.existsSync(__dirname+AB_dir)){
	fs.mkdirSync(__dirname+AB_dir);
	console.log("LOG: Create "+__dirname+AB_dir);
}


var app = express();
// Express session, must be inserted here, otherwise it won't work
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret",user:"",login:"no"}));

// all environments
app.set('port', process.env.PORT || service_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// To store uploaded files
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + AB_dir }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', login.verify);

app.get('/logout', login.logout);

app.get('/register', register.create_account);
//app.get('/tmp', tmp.account_list);

app.post('/register', register.add_account);

app.post('/checkout', checkout.purchase);

app.post('/checkout_test', checkout_test.purchase);

app.get('/catalog', catalog.browse);

//for unknown reqs to prevent against attacks
// app.get('/*', function(req, res){
// 	res.send(404);
// })


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
