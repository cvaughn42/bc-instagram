// Import Express library
var express = require('express');
var app = express();

// Import path library
var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var session = require('express-session')
app.use(session({
    secret: 'currentUser',
    resave: false,
    saveUninitialized: false
}));

// Set up resources directory to server static files
app.use(express.static('resources'));

// Port constant
var port = 8080;

/**
 * This is an interceptor to ensure users are logged in before they 
 * can access protected data
 */
function checkAuth(req, res, next) {
    if (!req.session.currentUser) {
        res.sendFile(path.join(__dirname + '/login.html'));
    } else {
        next();
    }
}

app.get('/', checkAuth, function (req, res) {

    res.sendFile(path.join(__dirname + '/index.html'));

}).post('/logout', function (req, res) {
    delete req.session.currentUser;
    res.redirect('/');

}).post('/login', function (req, res) {

    console.dir(req.body);
    
    // TODO Authenticate user!
    req.session.currentUser = {
        userName: "temp",
        firstName: "Temp",
        lastName: "User"
    };
    res.redirect('/');

}).get('/register', function (req, res) {

    res.sendFile(path.join(__dirname + "/register.html"));
}).post('/register', function(req, res) {
    console.dir(req.body);
    
    res.redirect('/');
});

var server = app.listen(port, function () {
    console.log('bc-instagram listening on port ' + port + '!');
});