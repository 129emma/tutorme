const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");

router.get('/', function (req, res) {
    var tutor;
    var promise = weekly.Oneweek(undefined, "vanie",'tableTime','timeStart');
    promise.then(function (value) {
        console.log("rendering");
        console.log(value);
        res.render("./tutorView/tutorSchedule.ejs", {value:value, userDetails: "vanie"});
    })
});

function setParsing(list) {
    var list = new Set(list);
    return Array.from(list);
}

module.exports = router;