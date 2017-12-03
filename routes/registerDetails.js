var express = require('express');
var router = express.Router();

// getting the MySQL functionality
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "db.sporadic.nz",
    port: 3306,
    user: "tutorme",
    password: "changeme",
    database: "tutorme",
});

router.get('/', function(req, res) {

    var un = req.query.uname;
    var pwd = req.query.pw;
    var fn = req.params.fname;
    var ln = req.params.lname;
    var em = req.params.email;
    var ad = req.params.address;
    var doob = req.params.dob;
    var studentID = req.params.sid;
    var studySchool = req.params.school;
    var tutor_activation = req.params.tactivation;

    console.log(un);
    console.log(pwd);
    console.log(fn);

    con.connect(function(err){
        if (err) throw err;
        console.log("Connected!");

        con.query("INSERT INTO tableUser (username, password, firstName, lastName, email, address, dob, studentID, studySchool, tutor_activation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [un, pwd, fn, ln, em, ad, doob, studentID, studySchool, tutor_activation], function(err, result) {
            if (err) throw err;
        });
    });

    res.render("registerDetails");
});

module.exports = router;