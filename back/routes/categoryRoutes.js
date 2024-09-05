const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  upload
} = require('../controllers/categoryController');

// Rutas para CRUD de categorías
router.get('/', getCategories); // Obtener todas las categorías
router.get('/:id', getCategoryById); // Obtener una categoría por ID
router.post('/', upload.single('image'), createCategory); // Crear una nueva categoría
router.put('/:id', upload.single('image'), updateCategory); // Actualizar una categoría por ID
router.delete('/:id', deleteCategory); // Eliminar una categoría por ID

module.exports = router;
