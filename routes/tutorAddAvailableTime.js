var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var con = require('../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false}));

const tutor = {
    "userName": "Vanie",
    "idAvailable": [],
    "idBooked": [],
    "course": [],
    "tutee": [],
    "location": []
}

router.post('/', function(req, res) {

    const username = req.body.userName;
    const rawDateStamp = req.body.dateStamp;
    console.log(username + " " + rawDateStamp);

    const dateStamp = rawDateStamp.replace("T", " ")+":00";

    console.log(dateStamp);



    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectNow.query("INSERT INTO tableTime (userName, timeStart) VALUES (?, ?)", [username, dateStamp], function(err, result) {
            connectNow.end();
            console.log('Yeah');
            if(err) {
                throw err;
            } else {

                res.redirect("/home");

            };
        })


    });


});


module.exports = router;


