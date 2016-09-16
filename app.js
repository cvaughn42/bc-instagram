// Import Express library
var express = require('express');
var app = express();
var dbManager = require("./DbManager")();

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

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// Set up resources directory to server static files
app.use(express.static('resources'));

var fs = require("fs");

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

}).post('/logout', checkAuth, function (req, res) {
    delete req.session.currentUser;
    res.redirect('/');

}).post('/post', checkAuth, upload.single('image'), function (req, res) {
        
    fs.readFile(req.file.path, function (err, data) {
        if (err) 
        {
            res.status(500).send('Unable to save post: ' + err);
        }
        else
        {
            var post = {
                author: req.session.currentUser.userName,
                postDate: new Date(),
                fileName: req.file.originalname,
                description: req.file.originalname,
                data: data,
                mimeType: req.file.mimetype, 
                encoding: req.file.encoding, 
                fileSize: req.file.size
            };

            dbManager.insertPost(post, (err, result) => {
                if (!err)
                {
                    if (result)
                    {
                        res.send('ok');
                    }
                    else
                    {
                        console.log("Something unexpected happened while saving the post");
                        res.status(500).send();
                    }
                }
                else
                {
                    console.log("Error creating post: " + err);
                    res.status(500).send(err);
                }

                fs.unlink(req.file.path, function(err) {
                    if (err)
                        console.log("Unable to delete file " + req.file.path + ": " + err);
                });
            });
        }
    });

}).post('/login', function (req, res) {
    
    dbManager.verifyUserAndPassword(req.body.userName, req.body.password, function (err, userObject) {

        if (!err && userObject) {
            req.session.currentUser = {
                userName: userObject.user_name,
                firstName: userObject.first_name,
                lastName: userObject.last_name
            };

            res.send(req.session.currentUser);
        }
        else {
            console.log('Unable to authenticate user: ' + err);
            res.status(500).send(err);
        }
    });


}).get('/register', function (req, res) {

    res.sendFile(path.join(__dirname + "/register.html"));
}).post('/register', function (req, res) {

    dbManager.insertUser(req.body.userName, req.body.password, req.body.firstName, req.body.middleName, req.body.lastName, function (err, userObject) {
        if (userObject != null) {
            req.session.currentUser = {
                userName: userObject.user_name,
                firstName: userObject.first_name,
                lastName: userObject.last_name
            };
            res.redirect('/');
        }
        else {
            console.log('Unable to register new user: ' + err);
            res.redirect('/register');
        }
    });

});

var server = app.listen(port, function () {
    console.log('bc-instagram listening on port ' + port + '!');
});