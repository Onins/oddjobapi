const User = require('../models/user');
const JobList = require('../models/joblist');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res, next)=> {
  User.find()
  .select('_id email')
  .exec()
  .then( users => {
    const response = {
      count: users.length,
      users: users.map(user => {
        return {
          _id : user._id,
          email: user.email,
          name: user.name,
          request: {
            type: "GET",
            url: "http://localhost:3000/user/" + user._id
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

exports.signup = (req, res, next) => {  
  User.find({email: req.body.email})
  .exec()
  .then( user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Email already exists!"
      });
    }

    else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {          
          return res.status(500).json({
            error: err          
          })
        }
        else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.name
          })
    
          user.save()
          .then( result => {
            res.status(201).json({
              message: 'User Created',
              request: {
                type: "POST",
                url: "http://localhost:3000/user/login"
              }
            })
          })
          .catch( err => {
            res.status(500).json({
              error: err
            })
          })
        }
      });
    }
  })
}

exports.login = (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then( user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed!"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          }, 
          process.env.JWT_KEY, 
          {
            expiresIn: "4h"
          }
        );

        return res.status(200).json({          
          message: "Auth successful!",
          userId: user[0]._id,
          token: token
        });
      }
      return res.status(401).json({
        message: "Auth failed!"
      });
    });    
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.getProfile = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  .exec()
  .then( user => {
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  })
  .catch( err => {
    res.status(500).json({
      error: err
    });
  });
}

exports.editProfile = (req, res, next) => {
  const id = req.params.userId; 
  User.findById(id)
  .exec()
  .then( user => {
    if (user.id == req.userData.userId) {
      User.updateOne({ _id: id }, { name: req.body.name })
      .exec()
      .then( job => {
        res.status(200).json({
          message: "Updated successfully",
          request: {
            type: "GET",
            url: "http://localhost:3000/user/" + req.params.userId
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

exports.getUserJobsPosted = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  .exec()
  .then( user => { 
    if (user.id == req.userData.userId) {
      JobList.find( { author: id } )
      .populate('author', 'id name email')
      .populate('assigned', 'id name email')
      .exec()
      .then( jobs => {
        res.status(200).json({      
          jobs: jobs.map(job => {
            return {
              _id: job._id,
              title: job.title,
              description: job.description,
              author: job.author,
              assigned: job.assigned,
              request: {
                type: "GET",
                url: "http://localhost:3000/jobs/" + job._id
              }
            }
          })      
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
    });
  });
}

exports.getUserJobsAssigned = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  .exec()
  .then( user => { 
    if (user.id == req.userData.userId) {
      JobList.find( { assigned: id } )
      .populate('author', 'id name email')
      .populate('assigned', 'id name email')
      .exec()
      .then( jobs => {
        res.status(200).json({      
          jobs: jobs.map(job => {
            return {
              _id: job._id,
              title: job.title,
              description: job.description,
              author: job.author,
              assigned: job.assigned,
              request: {
                type: "GET",
                url: "http://localhost:3000/jobs/" + job._id
              }
            }
          })      
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
    });
  });
}

// For development use only.

// exports.deleteAll = (req, res, next) => {
//   User.find().remove()
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