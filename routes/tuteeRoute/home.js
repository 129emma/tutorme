const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection.js');
var session = require('express-session');

router.get('/', function (req, res){
    console.log(req.session);
    console.log(typeof req.query.tuteeSwitch);

    req.session

// connectNow.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected and online!");
// });

console.log("ready to make query to database");
    //Key for session
    res.render("./tuteeView/home");

})
;

module.exports = router;
