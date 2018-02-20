/* Cryptocurrency Exchange Server 
    Ura Novic
    2018-01-15
*/
var express = require('express'),
    http = require('http'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    compress = require('compression'),
    request = require('request'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mysql = require('mysql');
var con = require('./config/db').con;
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.set('port', process.env.PORT || 3005);
// view engine setup
app.set('views', './public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
}
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/token', function(req, res, next) {
    res.end("Token");
});

//for google captcha
app.post('/submit_login', function(req, res) {
    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({ "responseCode": 1, "responseDesc": "Please select captcha" });
    }
    // Put your secret key here.
    var secretKey = "6LfSG0UUAAAAAOsVw-1E1--OmfHUnV7GWCIabBTc";
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function(error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.json({ "responseCode": 1, "responseDesc": "Failed captcha verification" });
        }
        res.json({ "responseCode": 0, "responseDesc": "Sucess" });
    });
});

//sign up
app.post('/signup', function(req, res) {
    var q = "SELECT COUNT(useremail) as cnt FROM user_info WHERE useremail='" + req.body.useremail + "'";
    //Execute the SQL statement, with the value array:
    con.query(q, function(err, rows, fields) {
        if (err) throw err;
        if (rows[0].cnt > 0) {
            res.send('exists');
        } else {
            //Make SQL statement:
            var sql = "INSERT INTO user_info (username, userpassword, useremail, walletaddress, seed) VALUES ('" + (req.body.username).replace(/\s/g, '') + "', md5('" + req.body.userpassword + "'),'" + req.body.useremail + "','" + req.body.wallet_addr + "', '" + req.body.wallet_seed + "')";

            //Execute the SQL statement, with the value array:
            con.query(sql, function(err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                res.send('success');
            });
        }
    });

});

//login 
app.post('/login', function(req, res, next) {

    var qq = "SELECT COUNT(useremail) as cnt, walletaddress, seed FROM user_info WHERE useremail='" + req.body.email + "' AND userpassword=md5('" + req.body.password + "')";
    //Execute the SQL statement, with the value array:
    con.query(qq, function(err, rows, fields) {
        if (err) throw err;
        if (rows[0].cnt == 1) {
            res.send(rows[0].walletaddress);
        } else {
            res.send('fail');
        }
    });
});
http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

// global.__base = __dirname + '/';