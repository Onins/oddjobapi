const express = require('express');

const upload = require('../middleware/upload');
const checkAuth = require('../middleware/check-auth');
const JobListController = require('../controllers/jobslist');
const router = express.Router();

router.get('/', JobListController.jobsGetAll);

router.post('/', checkAuth, upload.single('image'), JobListController.jobCreate);

router.get('/:jobId', checkAuth, JobListController.jobGetSingle);

router.patch('/:jobId', checkAuth, upload.single('image'), JobListController.jobUpdate);

router.delete('/:jobId', checkAuth, JobListController.jobDelete);

module.exports = router;
