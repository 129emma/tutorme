var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var con = require('../javascript/connection.js');

//setting up asynchronous hashing functionality (salt and hash) Bcrypt has been chosen due to its popularity.
var bcrypt = require('bcryptjs');
const saltRounds = 10;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false}));


// Rendering registration page
router.get('/', function(req, res, next) {
    res.render("registration");
});

// Registering details from form in registration page and then routing to home page.

router.post('/register', function(req, res) {

    const connectNow = con.method();

    connectNow.connect(function(err){
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("Working");

    var un = req.body.userName;
    var fn = req.body.firstName;
    var ln = req.body.lastName;
    var em = req.body.email;
    var ad = req.body.address;
    var doob = req.body.dateOfBirth;
    var studentID = req.body.studentId;
    var studySchool = req.body.school;
    var tutor_activation = req.body.tutorActivation;
    console.log(typeof tutor_activation);
    var pwd = req.body.passWord;

    console.log("ready to query");

    /* first query to make the user in user table*/
    connectNow.query("INSERT INTO tableUser (userName, firstName, lastName, email, address, dob, studentID, studySchool, tutor_activation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        , [un, fn, ln, em, ad, doob, studentID, studySchool, tutor_activation], function(err, result) {
            console.log("member registered!!");
            if (tutor_activation === "1"){
                connectNow.query("INSERT INTO tableTutor (userName) VALUES(?)", [un], function(err, result){
                    console.log('This is a tutor');
                    if (err) {
                        connectNow.end();
                        throw err;
                    }
                    else{
                        console.log(result);
                    }
                });
            }
            /*after user account is built create a hashed password query*/

            console.log(pwd);
            // Some of the non-null elements are not required within the registration page, which causes to throw an error.
            // plz do err processing.
            if (err){
                connectNow.end();
                console.log(err);
                throw err;
            }
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(pwd, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err) {
                        connectNow.end();
                        throw new Error('Something went wrong!');

                    }
                    connectNow.query("INSERT INTO tablePassword (userName, hashKey) VALUES(?, ?)", [un, hash], function(err, result){
                        console.log('Hallo--1');
                        if (err) {
                            connectNow.end();
                            throw err;
                        } else {
                            connectNow.query('SELECT * FROM tableUser WHERE userName = ? ', [un], function (err, result) {
                                connectNow.end();
                                if (err) {
                                    throw err
                                } else {
                                    const userDetails = JSON.parse(JSON.stringify(result[0]));
                                    req.session.userDetails = JSON.parse("[" + JSON.stringify(userDetails) + "]");
                                    res.redirect('/tutor/home');
                                }
                            });
                            // res.redirect("/tutor/home");
                        }
                    });
                });
            });

            if (err) throw err;
        });

});


module.exports = router;