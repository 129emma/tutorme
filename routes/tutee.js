const express = require('express');
const router = express.Router();

//tutorRoute specific routers below

const home = require('./tuteeRoute/home');
const profile = require('./tuteeRoute/tuteeProfile')
const tuteeSchedule = require('./tuteeRoute/tuteeSchedule');
router.use('/home', home);
router.use('/profile', profile);
router.use('/tuteeSchedule', tuteeSchedule);
module.exports = router;