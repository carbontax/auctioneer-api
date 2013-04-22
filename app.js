
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var mongoose = require('mongoose');

mongoose.set('debug', true);
//mongoose.connect('mongodb://localhost/auctioneer');
mongoose.connect('mongodb://nodejitsu:53a9a217c6407cd9ef88ec7ad2aa5af7@linus.mongohq.com:10060/nodejitsudb1239741365');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.basicAuth('carbontax','secret'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/users', user.save);
app.put('/users/:username', user.toggleActive);
app.put('/users', user.update);
app.delete('/users/:username', user.deleteUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
