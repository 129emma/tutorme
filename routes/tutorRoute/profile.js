const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {

    res.render("./tutorView/profile", req.session);
});

router.get('/edit', function (req, res) {

    res.render("./tutorView/profileEditing", req.session);
});

router.post('/editNow', function (req, res) {

    const connectNow = con.method();

    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });

    console.log("Working");

    var un = req.body.userName;
    var em = req.body.email;
    var ad = req.body.address;
    var studySchool = req.body.school;

    console.log("ready to query");

    /* first query to make the user in user table*/
    connectNow.query("UPDATE tableUser SET email = ?, address = ?, studySchool = ? WHERE userName = ? "
        , [em, ad, studySchool, un], function (err, result) {
            console.log("member updated!!");

            /*after user account is built create a hashed password query*/


            if (err) {
                throw err
            } else {
                    connectMethod.query('SELECT * FROM tableUser WHERE userName = ? ', [un], function (err, result) {
                        connectMethod.end();
                        if (err) {
                            throw err
                        } else {

                            const userDetails = JSON.parse(JSON.stringify(result[0]));

                            req.session.userDetails = JSON.parse("[" + JSON.stringify(userDetails) + "]");
                            res.render('/tutor/profile', req.session);

                        }

                    });

                }
        });

});

module.exports = router;
