const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (feedback!");
    });

    const tutorUsername = req.session.userDetails[0].userName;

    /* first query to make the user in user table*/

    connectNow.query("SELECT tutor.userName, tutor.selfIntroduction, cap.courseID, cap.experience, cap.description, cap.verification, cap.grade FROM tableTutor AS tutor, tableCapabilities AS cap WHERE tutor.userName = ? AND tutor.userName = cap.userName"
        , [tutorUsername], function (err, result) {
            connectNow.end();

            if (err) {
                throw err
            } else {
                const resultDetails = JSON.parse(JSON.stringify(result));
                console.log(resultDetails);
                res.render('./tutorView/profile', {userDetails: req.session.userDetails, Data: resultDetails});
            }
        });


/*
 SELECT tutor.userName, tutor.selfIntroduction, cap.courseID, cap.experience, cap.description, cap.verification, cap.grade
 FROM tableTutor AS tutor, tableCapabilities AS cap
 WHERE tutor.userName = 'jojo' AND tutor.userName = cap.userName
 */
});

router.get('/edit', function (req, res) {

    res.render("./tutorView/profileEditing", req.session);
});

router.post('/updateProfile', function (req, res) {

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("Working");

    var formUsername = req.body.formUsername;
    var formFirstname = req.body.formFirstname;
    var formLastname = req.body.formLastname;
    var formAddress = req.body.formAddress;
    var formID = req.body.formID;

    console.log(formUsername);
    console.log(formFirstname);
    //
    // var un = req.body.userName;
    // var em = req.body.email;
    // var ad = req.body.address;
    // var studySchool = req.body.school;

    console.log("ready to query");

    /* first query to make the user in user table*/
    connectNow.query("UPDATE tableUser SET firstName = ?, lastName = ?, address = ? WHERE userName = ? "
        , [formFirstname, formLastname, formAddress, formUsername], function (err, result) {

            connectNow.end();
            console.log("member updated!!");

            /*after user account is built create a hashed password query*/


            if (err) {
                throw err
            } else {

                res.redirect('/tutor/profile');
                    // connectMethod.query('SELECT * FROM tableUser WHERE userName = ? ', [un], function (err, result) {
                    //     connectMethod.end();
                    //     if (err) {
                    //         throw err
                    //     } else {
                    //
                    //         const userDetails = JSON.parse(JSON.stringify(result[0]));
                    //
                    //         req.session.userDetails = JSON.parse("[" + JSON.stringify(userDetails) + "]");
                    //         res.render('/tutor/profile', req.session);
                    //
                    //     }
                    //
                    // });

                }
        });

});

module.exports = router;
