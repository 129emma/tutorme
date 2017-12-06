const express = require('express');
const router = express.Router();
const con = require('../javascript/connection.js');

router.get('/', function (req, res){

const connectNow = con.method();

connectNow.connect(function (err) {
    if (err) throw err;
    console.log("Connected and online!");
});

console.log("ready to make query to database");

const un = "jojo";

// const un = req.userName;
// const pwd = req.password;

connectNow.query("SELECT * FROM tableUser WHERE userName = ?", [un], function (err, result) {
    connectNow.end();
    if (err) throw err;

    console.log(result);

    const homeObject = JSON.parse(JSON.stringify(result[0]));

    console.log(homeObject);

    res.render("home", homeObject);

});

})
;

module.exports = router;
