const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();

const con = require('../javascript/connection.js');

var bcrypt = require('bcryptjs');
const saltRounds = 10;

//using body parser to ensure that POST requests work properly.
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

//requiring express session module
var session = require('express-session');


/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('login');
});

// GET logging-in functionality
router.post('/logging', function (req, res) {

    const connectMethod = con.method();

    connectMethod.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("ready to login");

    const un = req.body.userName;
    const pwd = req.body.passWord;

    connectMethod.query("SELECT * FROM tablePassword WHERE userName = ? ", [un], function (err, result) {

        if (err) {
            throw err
        } else {
            console.log(result);

            const loginObject = JSON.parse(JSON.stringify(result[0]));

            console.log(pwd);

            // Load hash from your password DB.
            bcrypt.compare(pwd, loginObject.hashKey, function (err, resp) {
                // res == true

                console.log(pwd.hash);

                if (resp) {
                    console.log('your login is successful, proceeding...');

                    connectMethod.query('SELECT * FROM tableUser WHERE userName = ? ', [un], function (err, result) {
                        connectMethod.end();
                        if (err) {
                            throw err
                        } else {

                            const userDetails = JSON.parse(JSON.stringify(result[0]));

                            req.session.userDetails = JSON.parse("[" + JSON.stringify(userDetails) + "]");
                            res.redirect('/tutor/home');

                        }

                    });

                } else {
                    connectMethod.end();
                    console.log('Wrong password!');
                    res.redirect('/login');
                }
            });

            // const loginObject = JSON.parse(JSON.stringify(result[0]));
        };
    });

});


/* GET login page. */
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;