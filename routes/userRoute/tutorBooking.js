/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const updateTime = require('../../javascript/UpdatingTime');

router.get('/', function (req, res) {

    //booking ID should be provided by the click on the schedule, currently dummy data 1 inserted for testing purposes.
    var bookingID = req.query.bookingID;

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) {
            connectNow.end();
            throw err;
        }
        connectNow.query("SELECT tableBooking.tuteeID, tableBooking.courseID, tableBooking.location, tableBooking.description, tableBooking.totalPrice, tableTime.timeStart,  tableBooking.bookingID FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID AND tableBooking.bookingID = ?", [bookingID], function (err, result) {
            connectNow.end();
            console.log('Database Connected!');
            if (err) {
                throw err;
            } else {
                console.log(JSON.stringify(result));
                if ((JSON.stringify(result)).length > 2) {
                    const rawObject = JSON.parse(JSON.stringify(result[0]));
                    console.log("RAW: " + rawObject.tuteeID);
                    res.render("./userView/tutorBooking", {
                        userDetails: req.session.userDetails,
                        bookingData: rawObject
                    });
                }
                else {
                    console.log("errorr occured needed to render back to schedule but not in modal");
                    res.redirect('/user/tutorSchedule');
                }
            }
        });
    });


});
router.get("/deleting", function (req, resp) {
    console.log(req.query);
    const promise = updateTime.deleteAppointment(req.query.bookingID);
    promise.then(function (value) {
        console.log(value);
        resp.json({name: "rows affected"});
    }, function (reason) {
        console.log(reason);
        resp.json({name: "error occured"});
    });

});


module.exports = router;





