const mongoose = require('mongoose');

const userJobsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobsList', required: true}
})

module.exports = mongoose.model('UserJobs', userJobsSchema);