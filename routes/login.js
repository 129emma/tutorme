const express = require('express');
const router = express.Router();
const con = require('../javascript/connection.js');

var bcrypt = require('bcrypt');
const saltRounds = 10;

//requiring express session module
var session = require('express-session');


/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

// GET logging-in functionality
router.get('/logging', function (req, res) {

    const connectMethod = con.method();

    connectMethod.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("ready to login");

    const un = req.query.userName;
    const pwd = req.query.passWord;

    connectMethod.query("SELECT * FROM tablePassword WHERE userName = ? ", [un], function (err, result) {
        connectMethod.end();

        if (err) throw err;

        console.log(result);

        const loginObject = JSON.parse(JSON.stringify(result[0]));

        console.log(pwd);

        // Load hash from your password DB.
        bcrypt.compare(pwd, loginObject.hashKey, function(err, resp) {
            // res == true

            console.log(pwd.hash);

            if (resp){
                console.log('your login is successful, proceeding...');
                req.session.username = un;
                res.redirect('/home');

            } else {
                console.log('Wrong password!');
                res.redirect('/loginPage');
            }
        });

        // const loginObject = JSON.parse(JSON.stringify(result[0]));
    });

});

module.exports = router;