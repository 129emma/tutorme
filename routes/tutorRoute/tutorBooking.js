/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');

router.get('/', function(req, res) {
    //booking ID should be provided by the click on the schedule, currently dummy data 1 inserted for testing purposes.
    var bookingID = 1;

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) {
            connectNow.end();
            throw err;
        }
        connectNow.query("SELECT tableBooking.tuteeID, tableBooking.courseID, tableBooking.location, tableBooking.description, tableBooking.totalPrice, tableTime.timeStart  FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID AND tableBooking.bookingID = ?", [bookingID], function (err, result) {
            connectNow.end();
            console.log('Database Connected!');
            if (err) {
                throw err;
            } else {
                console.log(result);

                const rawObject = JSON.parse(JSON.stringify(result[0]));

                console.log("RAW: " + rawObject.tuteeID);

                console.log()

                res.render("./tutorView/tutorBooking", {userDetails: req.session.userDetails, bookingData: rawObject});
                // rawObject.map(function (value) {
                //     booking.tutee.push(value.tutee);
                // })
                // console.log(booking);
            }
        });
    });


});


module.exports = router;





