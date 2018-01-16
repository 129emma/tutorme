const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const con = require('../../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {
    console.log("tuteeProfile.js")
    res.redirect('/tutor/profile');

});

module.exports = router;