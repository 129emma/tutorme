const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");

router.get('/', function (req, res) {
    var promise = weekly.tuteeSQLBookingCall(undefined, req.session.userDetails[0].userName,'tableTime','timeStart');
    promise.then(function (value) {
        console.log(value);
        res.render("./tutorView/tutorSchedule.ejs", {value:value, userDetailsName: req.session.userDetails[0].userName, sess: req.session, userDetails: req.session.userDetails});
    })
});

module.exports = router;