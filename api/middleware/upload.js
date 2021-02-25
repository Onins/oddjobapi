const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => { 
  const mimeType = file.mimetype
  if (mimeType=== 'image/jpeg' || mimeType === 'image/png') {
    cb(null, true);
  } 
  else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    // 5MB
    fileSize: 1024 * 1024 * 5
  }
})

module.exports = upload;