const express = require('express');
const controller = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router('');
// CREATE
router.post('/', auth, multer, controller.createSauce);
router.post('/:id/like', auth, controller.likeSauce);
// READ
router.get('/', auth, controller.getAllSauces);
router.get('/:id', auth, controller.getOneSauce);
// UPDATE
router.put('/:id', auth, multer, controller.updateSauce);
// DELETE
router.delete('/:id', auth, controller.deleteSauce);

module.exports = router;