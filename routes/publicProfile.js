const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {

    //Set up tutorUsername const of the tutor we are viewing, currently hardwired as Jojo need to link up to listing
    const tutorUsername = req.query.userName;
    var selectedCourseId = req.query.courseId;


    //connect to the database
    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (Tutor Profile)!");
    });

    /* first query to get Tutor details*/
    connectNow.query("SELECT userName, selfIntroduction FROM tableTutor WHERE userName = ?"
        , [tutorUsername], function (err, resultTutor) {

            const tutorDetails = JSON.parse(JSON.stringify(resultTutor));
            console.log(tutorDetails);

            if (err) {

                console.log("Error with Database in publicProfile")
                connectNow.end();
                throw err;

            } else {

                // DB connection to get capability list
                connectNow.query("SELECT * FROM tableCapabilities WHERE userName = ?"
                    , [tutorUsername], function (err, resultCourse) {
                        connectNow.end();
                        if (err) {
                            throw err
                        } else {

                            const capabilityDetails = JSON.parse(JSON.stringify(resultCourse));
                            console.log(capabilityDetails);

                            res.render('./publicProfile.ejs', {
                                userDetails: req.session.userDetails,
                                tutorDetails: tutorDetails,
                                capabilityDetails: capabilityDetails,
                                selectedCourseId: selectedCourseId
                            });
                        }
                    });
            }
        });

});


module.exports = router;
