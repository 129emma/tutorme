const express = require('express');
const router = express.Router();
const con = require('../javascript/connection.js');

router.get('/', function(req, res) {

    const connectMethod = con.method();

    connectMethod.connect(function(err){
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("ready to login");

    const un = req.query.userName;
    const pwd = req.query.passWord;

    // const pwd = "jojo321";

    // const un = req.userName;
    // const pwd = req.password;

    connectMethod.query("SELECT * FROM tableUser WHERE userName = ? AND password = ?  ", [un, pwd], function(err, result) {
        connectMethod.end();

        // const loginObject = JSON.parse(JSON.stringify(result[0]));
        //
        // const username
        //
        // result.

        if (err) {
            return false;
        }
        console.log(result);

        res.redirect("/home/?userName=" + un + "?passWord=" + pwd);
    });
});

module.exports = router;