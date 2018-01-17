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
    const username = req.session.userDetails[0].userName;

    console.log("Username = " + username);
    console.log("ready to query to the DB");

    /* Query to request for Tutee and Tutor Feedback, where the tutorial is complete. */
    connectNow.query("SELECT courseID, tuteeID, tutorID, tutorFeedback, tutorRating, tuteeFeedback, tuteeRating FROM tableBooking WHERE complete = ? AND (tutorID = ? OR tuteeID = ?)"
        , [1, username, username], function (err, result) {
        console.log(result);

            connectNow.end();

            if (err) {
                throw err
            } else {
                const resultDetails = JSON.parse(JSON.stringify(result));
                console.log(resultDetails);
                console.log(resultDetails[0].tutorID);

                for (var i = 0; i < resultDetails.length; i++) {
                    if (resultDetails[i].tutorID === username) {
                        resultDetails[i].tutorOrTutee = "tutor";
                    } else {
                        resultDetails[i].tutorOrTutee = "tutee";
                    }
                }
                res.render('./userView/feedback', {feedbackDetails: resultDetails, userDetails: req.session.userDetails});
            }
        });
    // res.render("./userView/feedback");
});

module.exports = router;
