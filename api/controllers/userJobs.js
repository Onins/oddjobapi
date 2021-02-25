const MyJob = require('../models/userJobs');

exports.userJobPostedGet = (req, res, next) => {
  MyJob.find()
  // .populate('job', 'job')
  .exec()
  .then(jobs => {
    res.status(200).json({
      count: jobs.length,
      orders: jobs.map(job => {
        return {
          _id: job._id,
          job: job
        }
      })
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    }) 
  })
}

exports.userJobAcceptedGet = (req, res, next) => {
  MyJob.findById(req.body.productId)
  .then(product => {
    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      })
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    })
    return order.save()
  })
  .then(result => {
    res.status(201).json({
      message: "Order Stored!",
      order: {
        _id: result._id,
        quantity: result.quantity,
        product: result.product
      }
    }) 
  })
  .catch(err => {
    res.status(500).json({
      message: "Invalid product ID",
      error: err
    })
  });
}