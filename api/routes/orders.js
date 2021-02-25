const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


const Product = require('../models/products');

const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.ordersGetAll);

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
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
  })


  
  
});

router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
  .select("_id quantity product")
  .populate('product', 'name price')
  .exec()  
  .then(order => {
    if(!order) {
      return res.status(404).json({
        message: "Order not found!"
      })
    }
    res.status(200).json({
      order: order,      
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
  .exec()  
  .then(order => {
    res.status(200).json({
      message: "Order Deleted!"  
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

module.exports = router;
