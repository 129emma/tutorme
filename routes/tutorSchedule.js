const express = require('express');
const router = express.Router();

const tutor = {
    "userName": ["Vanie"],
    "idAvailable": [],
    "idBooked": [],
    "course": [],
    "tutee": []
}

const availability = {
    "time": ["12040800", "12041200", "12041300", "12041200", "12042000", "12041000"],
    "date": [2,3,5,6,7,4]

}
const booking = {
    "course": ["eat", "sleep", "run"],
    "tutee": ["lamlam", "pikachu", "jojo"],
    "time": ["12040800", "12041200", "12041300"],
    "date": [2,3,5]
}

router.get('/', function(req, res) {


    const numOfATimeUnit = availability.time;

    for (i = 0; i < numOfATimeUnit.length; i++) {
        const id1 = availability.date[i];
        var id2 = availability.time[i].slice(4,6);
        if(id2.charAt(0) === "0") {
            id2 = availability.time[i].slice(5,6);
        } else {
            id2 = availability.time[i].slice(4,6);
        }
        tutor.idAvailable.push(id1+"."+id2);
    }

    const numOfBTimeUnit = booking.time;
    for (i = 0; i < numOfBTimeUnit.length; i++) {
        const id1 = booking.date[i];
        var id2 = booking.time[i].slice(4,6);
        if(id2.charAt(0) === "0") {
            id2 = booking.time[i].slice(5,6);
        } else {
            id2 = booking.time[i].slice(4,6);
        }
        tutor.idBooked.push(id1+"."+id2);
    }
    console.log(tutor.idAvailable);
    console.log(toString(tutor.idAvailable))
    console.log(tutor.idBooked);

    res.render('tutorSchedule', tutor);


});

module.exports = router;