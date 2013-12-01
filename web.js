var express = require('express')
  , http = require('http')
  , path = require('path')
  , primality = require('primality')
  , dateable = require('dateable')
  , _ = require('underscore');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {

  var now = new Date();

  function withFormat(format){
    var result = [],
      dateStr = dateable(now, format);

    result.push(dateStr);
    result.push(primality(dateStr))

    return result;
  }

  var tests = {
    us:  withFormat('MMDDYY'),
    eu:  withFormat('DDMMYY'),
    iso: withFormat('YYYYMMDD')
  };

  res.render('index', {
    titleTuple: ['Is Today a', 'Prime day'],
    inspiredBy: "http://www.johndcook.com/blog/2013/11/29/todays-a-prime-day",
    overall: _.any(tests, function(tr){ return tr[1]; }),
    results: tests
  });

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
