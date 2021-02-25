const mongoose = require('mongoose');

const jobListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  skills: { type: String, required: true },
  stipend: { type: Number, required: true },
  authorName: { type: String },
  authorID: { type: String }
})

module.exports = mongoose.model('JobList', jobListSchema);