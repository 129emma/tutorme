const express = require('express');
const router = express.Router();
const con = require('../../javascript/connection');
const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");


// const availability = {
//     "time": ["12040800", "12041200", "12041300", "12041200", "12042000", "12041000"],
//     "date": [2, 3, 5, 6, 7, 4]
//
// }
// const booking = {
//     "course": ["Eat", "Sleep", "Run"],
//     "tutee": ["Lamlam", "Pikachu", "Jojo"],
//     "time": ["12040800", "12041200", "12041300"],
//     "date": [2, 3, 5],
//     "location": ["OGGB", "Science Building", "Clock Tower"]
// }

router.get('/', function (req, res) {
    var tutor;
    // (tutor = weekly()).then(function () {
    //     console.log(tutor)
    // });
    // var promise = new Promise(function (resolve,reject) {
    //     console.log("asking for sql");
    //     resolve(weekly());
    //     console.log("hello")
    // });
    // promise.then(function (value) {
    //     console.log("rendering");
    //     res.render("./tutorView/tutorSchedule.ejs", value);
    // })

    var promise = weekly.Oneweek(undefined, "jojo");
    promise.then(function (value) {
        console.log("rendering");
        console.log(value);
        res.render("./tutorView/tutorSchedule.ejs", value);
    })
});

function setParsing(list) {
    var list = new Set(list);
    return Array.from(list);
}

module.exports = router;