const express = require('express');
const router = express.Router();
const con = require('../javascript/connection.js');
const password = require('password-hash-and-salt');

var myuser = [];

//requiring express session module
var session = require('express-session');

router.get('/', function (req, res) {

    const connectMethod = con.method();

    connectMethod.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("ready to login");

    const un = req.query.userName;
    // const pwd = req.query.passWord;

    const pwd = "jojo321";

    // const un = req.userName;
    // const pwd = req.password;


    // Creating hash and salt
    var hashedPassword = password(pwd).hash(function (error, hash) {
        if (error)
            throw new Error('Something went wrong!');

        // Store hash (incl. algorithm, iterations, and salt)
        var hashedPassword = hash;
        console.log(hashedPassword);
    });

    connectMethod.query("SELECT * FROM tablePassword WHERE username = ? ", [un], function (err, result) {
        connectMethod.end();

        if (err) throw err;

        // console.log(result);
        //
        // console.log(result[0]);

        const loginObject = JSON.parse(JSON.stringify(result[0]));

        console.log(loginObject.hash);

        myuser.hash = loginObject.hash;

        req.session.username = un;

    });
});

module.exports = router;