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
        console.log("Connected and online (Tutor Profile)!");
    });

    const tutorUsername = req.session.userDetails[0].userName;

    /* first query to make the user in user table*/
    connectNow.query("SELECT tutor.userName, tutor.selfIntroduction, cap.courseID, cap.experience, cap.description, cap.verification, cap.grade FROM tableTutor AS tutor, tableCapabilities AS cap WHERE tutor.userName = ? AND tutor.userName = cap.userName"
        , [tutorUsername], function (err, resultTutor) {
            const resultDetails = JSON.parse(JSON.stringify(resultTutor));

            if (err) {
                connectNow.end();
                throw err;
            } else {
                // DB connection to get course list to display in dropdown
                connectNow.query("SELECT * FROM tableCourseList"
                    , [], function (err, resultCourse) {
                        connectNow.end();
                        if (err) {
                            throw err
                        } else {
                            const courseDetails = JSON.parse(JSON.stringify(resultCourse));
                            const currentCourse = resultDetails.map(function(cap){return cap.courseID;});
                            const availableCourse = courseDetails.filter(function (curV) { return !currentCourse.includes(curV.courseID);});
                            res.render('./tutorView/profile', {userDetails: req.session.userDetails, Data: resultDetails, CourseList: availableCourse});
                        }
                    });
            }
        });
});

router.get('/edit', function (req, res) {

    res.render("./tutorView/profileEditing", req.session);
});


router.post('/create_cap', function(req, res){



    const tutorUsername = req.session.userDetails[0].userName;
    const courseID =req.body.courseID;
    const experience = req.body.experience;
    const description = req.body.description;
    const verification = req.body.verification;
    const grade = req.body.grade;


    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    connectNow.query("INSERT INTO tableCapabilities (userName, courseID, experience, description, verification, grade) VALUES (?, ?, ?, ?, ?, ?)", [tutorUsername, courseID, experience, description, verification, grade], function (err, result) {

        if (err) {
            connectNow.end();
            throw err
        } else {
            connectNow.end();
            console.log("database inserted!!");
            res.redirect("./");
        }
    });

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

            // connectNow.end();
            console.log("member updated!!");

            /*after user account is built create a hashed password query*/


            if (err) {
                connectNow.end();
                throw err
            } else {
                //Now that new user information has been inserted to DB updating the session with the new details
                connectNow.query('SELECT * FROM tableUser WHERE userName = ? ', [formUsername], function (err, result) {
                    connectNow.end();
                    if (err) {
                        throw err
                    } else {
                        const userDetails = JSON.parse(JSON.stringify(result[0]));
                        req.session.userDetails = JSON.parse("[" + JSON.stringify(userDetails) + "]");
                        res.redirect('/tutor/profile');

                    }

                });

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
