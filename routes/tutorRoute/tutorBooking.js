/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');

router.get('/', function(req, res) {
    var tutor = 'jojo';

    const booking = {
        "tutee": [],
        "courseID": [],
        "description": [],
        "totalPrice": []
    };
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
                console.log(result);

                const rawObject = JSON.parse(JSON.stringify(result));


                //console.log("RAW: " + rawObject[0].tuteeID);

                res.render("./tutorView/tutorBooking", rawObject);
                // rawObject.map(function (value) {
                //     booking.tutee.push(value.tutee);
                // })
                // console.log(booking);
            }
        });
    });


});
    // const promise = new Promise(function (resolve, reject) {
    //     connectNow.connect(function (err) {
    //         if (err) {
    //             connectNow.end();
    //             throw err;
    //         }
    //         connectNow.query("SELECT * FROM tableBooking", function (err, result) {
    //             connectNow.end();
    //             console.log('Database Connected!');
    //             if (err) {
    //                 connectNow.end();
    //                 throw err;
    //             } else {
    //                 rawObject = JSON.parse(JSON.stringify(result));
    //                 // rawObject.map(function (value) {
    //                 //     booking.push(value);
    //                 // });
    //                 // console.log("All bookings " + booking);
    //             }
    //             resolve(rawObject);
    //
    //         })
    //     });
    // });
    // return promise;

    // promise.then(function (value) {
    //     res.render("./tutorView/tutorBooking");
    // })


module.exports = router;





