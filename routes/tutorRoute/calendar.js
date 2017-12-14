/**
 * Created by Administer on 7/12/2017.
 */
var express = require('express');
const router = express.Router();

var user = {
    "username": "Bryan Chen",
    "courses": ["Math", "Basketball", "Chinese literature"],
    "time": [["201712040800","1"]],
    }

router.get('/', function(req, res) {

    tutorname = "Bryan";
    var firstDate;
    var timeFrame = [];
    var courses;
    res.render("./tutorView/calendar", user);

});

module.exports = router;





