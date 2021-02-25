const express = require('express');
const mongoose = require('mongoose');

const Product = require('../models/products');
const upload = require('../middleware/upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', (req, res, next)=> {
  Product.find()
  .select('name price _id productImage')
  .exec()
  .then( docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name, 
          price: doc.price, 
          _id : doc._id,
          productImage: doc.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id
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
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next)=> {  
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),    
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product.save()
  .then(result => {
    res.status(201).json({
      message: "Product created successfully!",
      createdProduct: {
        _id:  result._id,
        name: result.name, 
        price: result.price, 
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id
        }
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
});

router.get('/:productId', (req, res, next)=> {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id')
  .exec()
  .then(doc => {
    
    if (doc) {
      res.status(200).json(doc)
    }
    else {
      res.status(404).json({
        message: "No Entry"
      })
    }  
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  });
});

router.patch('/:productId', checkAuth, (req, res, next)=> {
  const id = req.params.productId;  
  Product.updateOne({ _id: id }, { $set: req.body })
  .select('name price _id')
  .exec()
  .then( result => {
    res.status(200).json({
      message: "Updated successfully"
    });
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
});

router.delete('/:productId', checkAuth, (req, res, next)=> {
  const id = req.params.productId;
  Product.remove({_id: id})
  .exec()
  .then( result => {
    res.status(200).json({
      message: "Product deleted!"
    });
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
});

module.exports = router;
