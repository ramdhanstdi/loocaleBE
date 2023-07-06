const multer = require('multer');

const excelFilter = (req, file, cb) => {
  if (!file.mimetype.includes('spreadsheetml')) {
    return cb(new Error('Only xlxs files are allowed!'), false);
  }
  cb(null, true);
};

const uploadExcel = multer({ fileFilter: excelFilter });

module.exports = uploadExcel;
