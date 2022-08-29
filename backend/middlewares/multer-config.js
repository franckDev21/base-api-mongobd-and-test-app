const multer = require('multer');

const MINE_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination : (req, file, callback) => {
    callback(null,'images') 
  },
  filename : (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MINE_TYPES[file.mimetype];
    callback(null,name+`${Date.now()}.${extension}`);
  },
});

module.exports = multer({ storage }).single('image');