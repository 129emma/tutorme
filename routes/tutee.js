const express = require('express');
const router = express.Router();

//tutorRoute specific routers below

const home = require('./tuteeRoute/home');
const profile = require('./tuteeRoute/tuteeProfile')

router.use('/home', home);
router.use('/profile', profile);

module.exports = router;