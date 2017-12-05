var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false}));

// getting the MySQL functionality
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "db.sporadic.nz",
    port: 3306,
    user: "tutorme",
    password: "changeme",
    database: "tutorme",
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected and online!");
});

router.post('/', function(req, res) {

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

    con.query("INSERT INTO tableUser (username, password, firstName, lastName, email, address, dob, studentID, studySchool, tutor_activation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [un, pwd, fn, ln, em, ad, doob, studentID, studySchool, tutor_activation], function(err, result) {
        con.end();
        if (err) throw err;
    });

    res.render("registeredPage", req.body);

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