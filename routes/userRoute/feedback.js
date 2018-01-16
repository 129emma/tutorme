const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

//When user accesses the tutor, directed through this Route
router.get('/', function (req, res) {

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (feedback!");
    });

    console.log("Working for feedback");

    const tutorUsername = req.session.userDetails[0].userName;

    console.log("Username = " + tutorUsername);

    console.log("ready to query");

    /* first query to make the user in user table*/
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
