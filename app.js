const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const jobRoutes = require('./api/routes/joblist');
const userRoutes = require('./api/routes/user');

// Mongo DB Connect
mongoose.connect(
'mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW +'@odd-jobs.5rt87.mongodb.net/oddJobDB?retryWrites=true&w=majority',
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);
mongoose.Promise = global.Promise;

// Logger
app.use(morgan('dev'));

// Set uploads folder to public granting access using the image path
app.use('/uploads' ,express.static('uploads'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Error Handling
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     return res.status(200).json({});
//   }
// })
// End of CORS Error Handling

// Routes Middleware
app.use('/jobs', jobRoutes);
app.use('/user', userRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;