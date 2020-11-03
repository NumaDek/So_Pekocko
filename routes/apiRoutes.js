const express = require('express');
const controller = require('../controllers/sauce');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router('');
// CREATE
router.post('/', auth, multer, controller.createSauce);

// READ
router.get('/', auth, controller.getAllSauces);
router.get('/:id', auth, controller.getOneSauce);
// UPDATE
router.put('/:id', auth, multer, controller.updateSauce);
router.post('/:id/like', auth, controller.likeSauce);
// DELETE
router.delete('/:id', auth, controller.deleteSauce);

module.exports = router;