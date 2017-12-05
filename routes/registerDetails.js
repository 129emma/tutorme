var express = require('express');

var bodyParser = require('body-parser');
var router = express.Router();
var con = require('../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false}));

router.post('/', function(req, res) {

    const connectNow = con.method();

    connectNow.connect(function(err){
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("Working");

    var un = req.body.userName;
    var pwd = req.body.pwd;
    var fn = req.body.firstName;
    var ln = req.body.lastName;
    var em = req.body.email;
    var ad = req.body.address;
    var doob = req.body.dateOfBirth;
    var studentID = req.body.studentId;
    var studySchool = req.body.school;
    var tutor_activation = req.body.tutorActivation;

    console.log("ready to query");

    connectNow.query("INSERT INTO tableUser (username, password, firstName, lastName, email, address, dob, studentID, studySchool, tutor_activation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [un, pwd, fn, ln, em, ad, doob, studentID, studySchool, tutor_activation], function(err, result) {
        connectNow.end();
        if (err) throw err;
    });

    res.redirect("/home");

});



// router.get('/', function(req, res) {
//
//     var un = req.query.userName;
//     var pwd = req.query.pwd;
//     var fn = req.query.firstName;
//     var ln = req.query.lastName;
//     var em = req.query.email;
//     var ad = req.query.address;
//     var doob = req.query.dateOfBirth;
//     var studentID = req.query.studentId;
//     var studySchool = req.query.school;
//     var tutor_activation = req.query.tutorActivation;
//
//     console.log("ready to query");
//
//     con.query("INSERT INTO tableUser (username, password, firstName, lastName, email, address, dob, studentID, studySchool, tutor_activation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [un, pwd, fn, ln, em, ad, doob, studentID, studySchool, tutor_activation], function(err, result) {
//         con.end();
//         if (err) throw err;
//     });
//
//     res.render("registeredPage");
// });

module.exports = router;