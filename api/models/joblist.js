const mongoose = require('mongoose');

const jobListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  requirements: { type: String, required: true },
  stipend: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('JobList', jobListSchema);