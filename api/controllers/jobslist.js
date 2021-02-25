const JobList = require('../models/joblist');
const mongoose = require('mongoose');

exports.jobsGetAll = (req, res, next) => {
  JobList.find()
  .exec()
  .then( jobs => {  
    const response = {
      count: jobs.length,
      jobs: jobs.map(job => {
        return {
          _id : job._id,
          title: job.title, 
          description: job.description, 
          image: job.image,
          request: {
            type: "GET",
            url: "http://localhost:3000/jobs/" + job._id
          }
        }
      })
    }
    res.status(200).json(response)
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.jobCreate = (req, res, next) => {  
  const jobs = new JobList({
    _id: new mongoose.Types.ObjectId(),    
    title: req.body.title,
    description: req.body.description,
    image: req.file.path,
    skills: req.body.skills,
    stipend: req.body.stipend
  })
  jobs.save()
  .then( job => {
    res.status(201).json({
      message: "Job Posted!",
      jobDetails: {
        _id:  job._id,
        title: job.title, 
        request: {
          type: "GET",
          url: "http://localhost:3000/jobs/" + job._id
        }
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.jobGetSingle = (req, res, next)=> {
  const id = req.params.jobId;
  JobList.findById(id)
  .select('title description image skills stipend')
  .exec()
  .then(job => {
    if (job) {
      res.status(200).json(job)
    }
    else {
      res.status(404).json({
        message: "No Job Posted!"
      })
    }  
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  });
}

exports.jobUpdate  = (req, res, next)=> {
  const id = req.params.jobId;  
  JobList.updateOne({ _id: id }, { $set: req.body })
  // .select('name price _id')
  .exec()
  .then( job => {
    res.status(200).json({
      message: "Updated successfully",
      request: {
        type: "GET",
        url: "http://localhost:3000/jobs/" + req.params.jobId
      }
    });
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.jobDelete = (req, res, next)=> {
  const id = req.params.jobId;
  JobList.remove({_id: id})
  .exec()
  .then( result => {
    res.status(200).json({
      message: "Job Deleted!"
    });
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}