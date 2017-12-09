const express = require('express');
const router = express.Router();

const tutor = {
    "userName": "Vanie",
    "booking": {
        "course": "eat",
        "tutee": "pikachu",
        "time": ["12040800", "201712041000"],
        "date": [1,1]
    }
}



router.get('/', function(req, res) {

    res.render('tutorSchedule', {empty: 'className'});
    const booking = tutor.booking.time[9];







});

module.exports = router;