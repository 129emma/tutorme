const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var con = require('../javascript/connection.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function (req, res) {

    res.render('./publicProfile.ejs');

});


module.exports = router;
