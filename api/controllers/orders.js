const Order = require('../models/order');

exports.ordersGetAll = (req, res, next) => {
  Order.find()
  .select('product quantity _id')
  .populate('product', 'name price')
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          quantity: doc.quantity,
          product: doc.product
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