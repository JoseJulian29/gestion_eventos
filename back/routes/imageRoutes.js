const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Rutas para manejar imágenes
router.post('/', imageController.upload.single('file'), imageController.uploadImage);
router.delete('/', imageController.deleteImage);

module.exports = router;
