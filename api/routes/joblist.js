const express = require('express');

const upload = require('../middleware/upload');
const checkAuth = require('../middleware/check-auth');

const JobListController = require('../controllers/jobslist');
const router = express.Router();

router.get('/', JobListController.jobsGetAll);

router.post('/', checkAuth, upload.single('image'), JobListController.jobCreate);

router.get('/:jobId', JobListController.jobGetSingle);

router.patch('/:jobId', checkAuth, upload.single('image'), JobListController.jobUpdate);

router.post('/:jobId/accept', checkAuth, JobListController.jobUpdateAssigned);

router.delete('/:jobId', checkAuth, JobListController.jobDelete);

// router.delete('/', JobListController.deleteAll);

module.exports = router;
