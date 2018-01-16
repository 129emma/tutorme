const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const con = require('../../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// When user accesses the tutor, directed through this Route
router.get('/', function (req, res) {

    // Setting up connection using the con modules, method().
    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Confirming that we have connected to the DB correctly for feedback page!");
    });

    // getting the tutor username from the session to set up variable to query Database.
    const tutorUsername = req.session.userDetails[0].userName;

    console.log("Username = " + tutorUsername);
    console.log("ready to query to the DB");

    /* Query to request for Tutee and Tutor Feedback, where the tutorial is complete.*/
    connectNow.query("SELECT courseID, tuteeID, tuteeFeedback, tuteeRating FROM tableBooking WHERE complete = ? AND tutorID = ? "
        , [1, tutorUsername], function (err, result) {

            connectNow.end();

            if (err) {
                throw err
            } else {
                const resultDetails = JSON.parse(JSON.stringify(result));
                console.log(resultDetails);
                res.render('./userView/feedback', {feedbackDetails: resultDetails, userDetails: req.session.userDetails});
            }
        });

    // res.render("./userView/feedback");

});


module.exports = router;
