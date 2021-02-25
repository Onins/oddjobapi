const JobList = require('../models/joblist');
const mongoose = require('mongoose');

exports.jobsGetAll = (req, res, next) => {
  JobList.find()
  .populate('author', 'name email')
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
          author: job.author,
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
    requirements: req.body.requirements,
    stipend: req.body.stipend,
    author: req.userData.userId
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

exports.jobGetSingle = (req, res, next) => {
  const id = req.params.jobId;
  JobList.findById(id)
  .select('title description image requirements stipend assigned')
  .populate('author', 'name email')
  .populate('assigned', 'name email')
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

exports.jobUpdate = (req, res, next) => {
  const id = req.params.jobId;  
  JobList.findById(id)
  .exec()
  .then( job => {
    if (job.author == req.userData.userId) {
      JobList.updateOne({ _id: job.id }, { $set: req.body })
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
    }
    else {
      return res.status(401).json({
        message: "Unauthorized request!"
      });
    }
  })
  .catch( err => {
  res.status(500).json({
    error: err
  })
});
}

exports.jobUpdateAssigned = (req, res, next) => {
  const id = req.params.jobId;  
  JobList.findById(id)
  .exec()
  .then( job => {
    console.log(job.assigned)
    if (job.assigned == undefined) {
      JobList.updateOne({ _id: id }, { assigned: req.userData.userId})
      .exec()
      .then( job => {
        res.status(200).json({
          message: "Updated successfully",
          request: {
            type: "GET",
            url: "http://localhost:3000/jobs/" + req.params.jobId
          }
        });
      });
    }
    else if (job.assigned == req.userData.userId){
      return res.status(409).json({
        message: "Already accepted the job!"
      });
    }
    else {
      return res.status(401).json({
        message: "Job already accepted by another user."
      });
    }
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.jobDelete = (req, res, next) => {
  const id = req.params.jobId;
  JobList.findById(id)
  .exec()
  .then( job => {
    if (job.author == req.userData.userId) {
      JobList.remove({_id: id})
      .exec()
      .then( result => {
        res.status(200).json({
          message: "Job Deleted!"
        });
      })
    }
    else {
      return res.status(401).json({
        message: "Unauthorized request!"
      });
    }    
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}

// For development use only.

// exports.deleteAll = (req, res, next) => {
//   JobList.find().remove()
//   .exec()
//   .then( result => {
//     res.status(200).json({
//       message: "Job Deleted!"
//     });
//   })
//   .catch( err => {
//     res.status(500).json({
//       error: err
//     })
//   });
// }