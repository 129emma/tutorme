const express = require('express');
const router = express.Router();

//tutorRoute specific routers below

const home = require('./userRoute/home');
const tutorSchedule = require('./userRoute/tutorSchedule');
const feedback = require('./userRoute/feedback');
const profile = require('./userRoute/profile');
const tutorBooking = require('./userRoute/tutorBooking');



router.use('/home', home);
router.use('/tutorSchedule', tutorSchedule);
router.use('/feedback', feedback);
router.use('/profile', profile);
router.use('/tutorBooking', tutorBooking);


module.exports = router;