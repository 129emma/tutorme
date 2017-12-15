const express = require('express');
const router = express.Router();

//tutorRoute specific routers below

const home = require('./tutorRoute/home');
const tutorSchedule = require('./tutorRoute/tutorSchedule');
const calendar = require('./tutorRoute/calendar');
const feedback = require('./tutorRoute/feedback');
const profile = require('./tutorRoute/profile');


router.use('/home', home);
router.use('/tutorSchedule', tutorSchedule);
router.use('/calendar', calendar);
router.use('/feedback', feedback);
router.use('/profile', profile);

module.exports = router;