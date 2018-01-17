const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection.js');
var session = require('express-session');

router.get('/', function (req, res){
    console.log(req.session);
    const tuteeBoolean = req.session.tuteeBoolean;
    console.log(tuteeBoolean);
    if (req.session.tuteeBoolean === undefined){
        req.session.tuteeBoolean = true;
        console.log("tuteeBoolean is undefined");
    }
    else if (req.session.tuteeBoolean === false){
        req.session.tuteeBoolean = true;
    }
    else if (req.session.tuteeBoolean === true){
        req.session.tuteeBoolean = false;
    }
    console.log(req.session.tuteeBoolean);


// connectNow.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected and online!");
// });

console.log("ready to make query to database");
    //Key for session
    res.render("./userView/home", req.session);

})
;

module.exports = router;
