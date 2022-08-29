const express = require('express');
const auth = require('../middlewares/auth');  // my middleware
const multer = require('../middlewares/multer-config');  // my middleware

const router = express.Router();

const stoffCtrl = require('../controllers/stuff');

router.get('/', auth, stoffCtrl.getAllThing); 
router.get('/:id', auth, stoffCtrl.getOneThing);
router.post('/', auth, multer, stoffCtrl.createThing);
router.put('/:id', auth, multer, stoffCtrl.modifyThing);
router.delete('/:id', auth, stoffCtrl.deleteThing);


module.exports = router;