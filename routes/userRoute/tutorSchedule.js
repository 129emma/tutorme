const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");

router.get('/', function (req, res) {

    console.log(req.session.userDetails[0]);

    var promise = weekly.Oneweek(undefined, req.session.userDetails[0].userName,'tableTime','timeStart');

    promise.then(function (value) {
        console.log(value);
        res.render("./userView/tutorSchedule.ejs", {value:value, userDetailsName:  req.session.userDetails[0].userName, sess: req.session, userDetails: req.session.userDetails});
    })
});

router.get('/booking',function (req, res) {
    console.log(req.query);
    console.log("from listing");
});

module.exports = router;