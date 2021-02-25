const express = require('express');
const router = express.Router();

const UserJobsController = require('../controllers/userJobs');

router.get('/', UserJobsController.userJobPostedGet);

router.get('/', UserJobsController.userJobAcceptedGet);


  
  
// });

// router.get('/:orderId', (req, res, next) => {
//   Order.findById(req.params.orderId)
//   .select("_id quantity product")
//   .populate('product', 'name price')
//   .exec()  
//   .then(order => {
//     if(!order) {
//       return res.status(404).json({
//         message: "Order not found!"
//       })
//     }
//     res.status(200).json({
//       order: order,      
//     })
//   })
//   .catch(err => {
//     res.status(500).json({
//       error: err
//     })
//   })
// });

// router.delete('/:orderId', (req, res, next) => {
//   Order.remove({ _id: req.params.orderId })
//   .exec()  
//   .then(order => {
//     res.status(200).json({
//       message: "Order Deleted!"  
//     })
//   })
//   .catch(err => {
//     res.status(500).json({
//       error: err
//     })
//   })
// });

module.exports = router;
