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
    connectNow.query("SELECT tuteeFeedback, tuteeRating FROM tableBooking WHERE complete = ? AND tutorID = ? "
        , [1, tutorUsername], function (err, result) {

            connectNow.end();

            if (err) {
                throw err
            } else {

                console.log(result);
                res.render('./tutorView/feedback', result);


            }
        });

    // res.render("./tutorView/feedback");

});


module.exports = router;
