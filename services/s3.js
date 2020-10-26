const AWS = require('aws-sdk');
//config s3
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
});

const s3 = new AWS.S3(); //init s3


//get multer
const path = require('path'); 
const multer = require('multer');
const multerS3 = require('multer-s3');
//set the storage object for multer
const storage = multerS3({
  acl: "public-read",
  s3,
  bucket: 'medium-blog-clone',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString())
  }
})


//init upload
const upload = multer({
  storage: storage, // call storage variable
  limits: {
    fileSize: 2500000 // max size 2.5mb
  },
  fileFilter: function(req,file,cb) {
    checkFileType(file, cb) // all the check file function
  }
});




//function check file type
function checkFileType(file, cb) {

//allowed ext
const fileTypes = /jpeg|jpg/;

//check ext
const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//check mimetype
const mimetype = fileTypes.test(file.mimetype);

if(mimetype && extname){
  return cb(null, true);
} else {
  cb('error: file type not supported, jpg or jpeg only')
}
}

module.exports = upload