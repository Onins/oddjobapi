const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.get('/', UserController.getUsers);

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.get('/:userId', UserController.getProfile);

router.patch('/:userId', checkAuth, UserController.editProfile);

router.get('/:userId/jobsposted', checkAuth, UserController.getUserJobsPosted);

router.get('/:userId/jobsassigned', checkAuth, UserController.getUserJobsAssigned);

// For development use only.
// router.delete('/', UserController.deleteAll);


module.exports = router;