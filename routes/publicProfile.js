const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {

    //Set up tutorUsername const of the tutor we are viewing, currently hardwired as Jojo need to link up to listing
    const tutorUsername = "jojo";

    //connect to the database
    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (Tutor Profile)!");
    });

    /* first query to get Tutor details*/
    connectNow.query("SELECT tutor.userName, tutor.selfIntroduction, cap.courseID, cap.experience, cap.description, cap.verification, cap.grade FROM tableTutor AS tutor, tableCapabilities AS cap WHERE tutor.userName = ? AND tutor.userName = cap.userName"
        , [tutorUsername], function (err, resultTutor) {

            const resultDetails = JSON.parse(JSON.stringify(resultTutor));

            if (err) {

                connectNow.end();
                throw err;

            } else {

                // DB connection to get capability list
                connectNow.query("SELECT * FROM tableCourseList"
                    , [], function (err, resultCourse) {
                        connectNow.end();
                        if (err) {
                            throw err
                        } else {
                            const courseDetails = JSON.parse(JSON.stringify(resultCourse));
                            const currentCourse = resultDetails.map(function(cap){return cap.courseID;});
                            const availableCourse = courseDetails.filter(function (curV) { return !currentCourse.includes(curV.courseID);});

                            var Co_id = [];
                            var Co_name = [];
                            var Co_description = [];
                            availableCourse.map(function(Co){
                                Co_id.push(Co.courseID);
                                Co_name.push(Co.courseName);
                                Co_description.push(Co.courseDescription);
                            });
                            Co_id = JSON.stringify(Co_id);
                            Co_name = JSON.stringify(Co_name);
                            Co_description = JSON.stringify(Co_description);


                            res.render('./userView/profile.ejs', {userDetails: req.session.userDetails, Data: resultDetails, CourseList: availableCourse, Co_id: Co_id, Co_name: Co_name, Co_description: Co_description});
                        }
                    });
            }
        });




    res.render('./publicProfile.ejs');

});


module.exports = router;
