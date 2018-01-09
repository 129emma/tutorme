/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');

router.get('/', function(req, res) {
    const booking = {
        "tutee": [],
    };

    const connectNow = con.method();
    res.render("./tutorView/tutorBooking");
    connectNow.connect(function (err) {
        if (err) {
            connectNow.end();
            throw err;
        }
        connectNow.query("SELECT * FROM tableBooking", function (err, result) {
            connectNow.end();
            console.log('Database Connected!');
            if (err) {
                connectNow.end();
                throw err;
            } else {
                rawObject = JSON.parse(JSON.stringify(result));
                            // rawObject.map(function (value) {
                            //     booking.push(value);
                            // });
                            // console.log("All bookings " + booking);
                        }


    })
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

});


module.exports = router;





