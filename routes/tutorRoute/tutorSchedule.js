const express = require('express');
const router = express.Router();

const con = require('../../javascript/connection.js');

const tutor = {
    "userName": [],
    "idAvailable": [],
    "idBooked": [],
    "course": [],
    "tutee": [],
    "location": []
}

router.get('/', function (req, res) {

    const name = 'jojo';

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) throw err;
        connectNow.query("SELECT userName, timeStart, day FROM tableTime WHERE userName = ?", [name], function (err, result) {
            connectNow.end();
            if (err) {
                throw err;
            } else {
                rawOject = JSON.parse(JSON.stringify(result));
                //console.log(rawOject);

                for(i = 0; i < rawOject.length; i++) {
                    const date = rawOject[i].day;
                    const time = rawOject[i].timeStart.slice(11, 13).replace("0", "");
                    var newTime;
                    if (time === '1' || time === '2') {
                        newTime = time + "0";
                        tutor.idAvailable.push(date + "." + newTime);
                    } else {
                        tutor.idAvailable.push(date + "." + time)
                    }

                    console.log(tutor.idAvailable);
                }
                tutor.userName.push(rawOject[0].userName);
                console.log(tutor.userName);

                res.render('./tutorView/tutorSchedule', tutor);

            }
        });

    })




        // const numOfATimeUnit = availability.time;
        //
        // for (i = 0; i < numOfATimeUnit.length; i++) {
        //     const id1 = availability.date[i];
        //     var id2 = availability.time[i].slice(4, 6);
        //     if (id2.charAt(0) === "0") {
        //         id2 = availability.time[i].slice(5, 6);
        //     } else {
        //         id2 = availability.time[i].slice(4, 6);
        //     }
        //     // tutorRoute.idAvailable.add(id1+"."+id2);
        //     num = id1 + "." + id2;
        //     if (num.endsWith(0)) {
        //         console.log(num);
        //         num *= 100;
        //     }
        //
        //     tutor.idAvailable.push(num);
        // }
        //
        // const numOfBTimeUnit = booking.time;
        // for (i = 0; i < numOfBTimeUnit.length; i++) {
        //     const id1 = booking.date[i];
        //     var id2 = booking.time[i].slice(4, 6);
        //     if (id2.charAt(0) === "0") {
        //         id2 = booking.time[i].slice(5, 6);
        //     } else {
        //         id2 = booking.time[i].slice(4, 6);
        //     }
        //     tutor.idBooked.push(id1 + "." + id2);
        //     tutor.course.push(booking.course[i]);
        //     tutor.tutee.push(booking.tutee[i]);
        //     tutor.location.push(booking.location[i]);
        // }
        // tutor.course = setParsing(tutor.course);
        // tutor.idAvailable = setParsing(tutor.idAvailable);
        // tutor.idBooked = setParsing(tutor.idBooked);
        // tutor.tutee = setParsing(tutor.tutee);
        // tutor.location = setParsing(tutor.location)

});

function setParsing(list) {
    var list = new Set(list);
    return Array.from(list);
}




module.exports = router;
