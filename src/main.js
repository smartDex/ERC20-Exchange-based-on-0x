/* Cryptocurrency Exchange Server 
    Ura Novic
    2018-01-15
*/
var express = require('express')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , compress = require('compression')
  , request =  require('request')
  , methodOverride = require('method-override')
  , bodyParser = require('body-parser');
  
var router = express.Router();
var app = express();

  app.set('port', process.env.PORT || 3000);
  // view engine setup
  app.set('views', './public');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(express.static(path.join(__dirname, 'public')));
    router.get('/', function(req, res, next) {
        
    });
exports.app = app;