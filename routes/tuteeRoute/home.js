const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection.js');

router.get('/', function (req, res){

const connectNow = con.method();

connectNow.connect(function (err) {
    if (err) throw err;
    console.log("Connected and online!");
});

console.log("ready to make query to database");

    res.render("./tuteeView/home");

})
;

module.exports = router;
