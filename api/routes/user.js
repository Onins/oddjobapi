const express = require('express');
const router = express.Router();
// const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const User = require('../models/user'); 
const UserController = require('../controllers/user');

router.get('/', (req, res, next)=> {
  User.find()
  .select('_id email')
  .exec()
  .then( users => {
    const response = {
      count: users.length,
      users: users.map(doc => {
        return {
          email: doc.email, 
          _id : doc._id
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
});

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

// router.delete('/:userId', (req, res, next) => {
//   User,remove({ _id: req.params.userId })
//   .exec()
//   .then( result => {
//     res.status(200).json({
//       message: 'User Deleted Successfully'
//     })
//   })
//   .catch( err => {
//     res.status(500).json({
//       error: err
//     })
//   })
// })

module.exports = router;