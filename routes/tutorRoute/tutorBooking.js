/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');

router.get('/', function(req, res) {
    var tutor = 'jojo';

    // const booking = {
    //     "tutee": [],
    //     "courseID": [],
    //     "description": [],
    //     "totalPrice": []
    // };
    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) {
            connectNow.end();
            throw err;
        }
        connectNow.query("SELECT tuteeID, courseID, desciprtion, totalPrice FROM tableBooking WHERE tutorID = ?", [tutor], function (err, result) {
            connectNow.end();
            console.log('Database Connected!');
            if (err) {
                throw err;
            } else {
                const booking = JSON.parse(JSON.stringify(result));
                console.log(booking);
                res.render("./tutorView/tutorBooking", {booking: booking});

            }
        });
    });


});


module.exports = router;





