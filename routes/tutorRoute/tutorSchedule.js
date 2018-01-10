const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");

router.get('/', function (req, res) {
    var promise = weekly.Oneweek(undefined, "jojo",'tableTime','timeStart');

    promise.then(function (value) {
        res.render("./tutorView/tutorSchedule.ejs", {value:value, userDetails: "jojo"});
    })
});

module.exports = router;