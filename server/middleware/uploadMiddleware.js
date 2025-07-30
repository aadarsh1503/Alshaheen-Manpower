const multer = require('multer');

/*
 * 
 * @param {object} req 
 * @param {object} file 
 * @param {function} cb 
 */
const fileFilter = (req, file, cb) => {
  // Define a list of allowed MIME types
  const allowedTypes = [
    'application/pdf',                                      // .pdf
    'application/msword',                                   // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/jpeg',                                           // .jpeg, .jpg
    'image/png'                                             // .png
  ];

  if (allowedTypes.includes(file.mimetype)) {
  
    cb(null, true);
  } else {
    // If the file type is not allowed, reject it with an error message
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.'), false);
  }
};


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    
    fileSize: 2 * 1024 * 1024 
  },
 
  fileFilter: fileFilter
});

module.exports = upload;