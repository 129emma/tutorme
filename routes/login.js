const express = require('express');
const router = express.Router();
const con = require('../javascript/connection.js');

router.get('/', function(req, res) {

    const connectMethod = con.method;

    connectMethod.connect(function(err){
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("ready to login");

    const un = "jojo";
    const pwd = "jojo321";

    // const un = req.userName;
    // const pwd = req.password;

    connectMethod.query("SELECT * FROM tableUser WHERE userName = ? AND password = ?  ", [un, pwd], function(err, result) {
        connectMethod.end();

        if (err) {
            return false;
        }
        console.log(result);
        res.redirect("/home");
    });
});

module.exports = router;