/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
const router = express.Router();
const con = require('../../javascript/connection');
const updateTime = require('../../javascript/UpdatingTime');
const weekly1 = require("../../javascript/tutorSchedule3WeekPreRendering1");
const Listing = require("../../javascript/ListingSQL");
const socketList = [];
var sockets;
router.get('/', function (req, res) {
    io.on("connection", function (socket) {
        console.log("connected to the socket within the tutorbooking");
        socketList.push(socket);
        sockets = socket;
        // socket.emit('blah', {name:"blahing"})
    });
    //booking ID should be provided by the click on the schedule, currently dummy data 1 inserted for testing purposes.
    var bookingID = req.query.bookingID;
    console.log(bookingID);
    const connectNow = con.method();

    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }

            connectNow.query("SELECT tableBooking.tutorID, tableBooking.tuteeID, tableBooking.courseID, tableBooking.location, tableBooking.description, tableBooking.totalPrice, tableTime.timeStart,  tableBooking.bookingID FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID AND tableBooking.bookingID = ?", [bookingID], function (err, result) {
                connectNow.end();
                console.log('Database Connected!');
                if (err) {
                    throw err;
                } else {
                    console.log(JSON.stringify(result));
                    if ((JSON.stringify(result)).length > 2) {
                        console.log(result);
                        const rawObject = JSON.parse(JSON.stringify(result[0]));
                        console.log("rAW")
                        console.log(rawObject);

                        resolve(rawObject);
                        // res.render("./userView/tutorBooking", {
                        //     userDetails: req.session.userDetails,
                        //     bookingData: rawObject
                        // });
                    }
                    else {
                        console.log("errorr occured needed to render back to schedule but not in modal");
                        reject("here is an error");
                        // res.render("./userView/tutorBooking", {
                        //     userDetails: req.session.userDetails,
                        //     bookingData: rawObject
                        // });
                    }
                }
            });
        });
    })
    promise.then(function (value) {
        const listOfPromises = [weekly1.Oneweek, weekly1.tutorbooked];
        const promise = weekly1.joinedScheduleCalls(listOfPromises, undefined, undefined, value.tutorID, 'tableTime', 'timeStart');
        const promise2 = Listing.singleTutorCap(undefined, value.tutorID);
        const ListingOfPromises = [promise, promise2];
        Promise.all(ListingOfPromises).then(function (value2) {
            console.log("value");
            console.log(value.timeStart);
            console.log(value2[0].availableTime);
            console.log(value2);
            const listOfCap = [];
            value2[1].map(function (value3) {
                listOfCap.push(value3.courseID)
            });
            console.log(listOfCap);
            res.render("./userView/tutorBooking", {
                userDetails: req.session.userDetails,
                bookingData: value,
                availableTime: String(value2[0].availableTime),
                capabilies: String(listOfCap)
            });
        })
    })
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
router.get("/alt", function (req, resp) {

    const time = req.query.time;
    const username = req.query.tutorID;
    delete req.query.time;
    delete req.query.tutorID;
    const bookedtime1 = (new Date(time));
    bookedtime1.setTime(bookedtime1.getTime() - bookedtime1.getTimezoneOffset() * 60 * 1000);
    const promise = updateTime.updateAppointment(bookedtime1, req.query, req.query.bookingID, username);

    console.log("how many sockets");
    console.log(socketList);
    promise.then(function (value) {
        console.log("done updating promise done");
        if (socketList.length >0){
            console.log("socketListing");
            socketList[0].emit("blah", {name: "blah"})
        }
        sockets.emit("blah",{nasd: "asdasd"});
        resp.json({name: "udapted"});
    });

});


module.exports = router;





