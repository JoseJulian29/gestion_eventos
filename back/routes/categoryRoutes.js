const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Rutas para CRUD de categorías
router.get('/', getCategories); // Obtener todas las categorías
router.get('/:id', getCategoryById); // Obtener una categoría por ID
router.post('/', createCategory); // Crear una nueva categoría
router.put('/:id', updateCategory); // Actualizar una categoría por ID
router.delete('/:id', deleteCategory); // Eliminar una categoría por ID

module.exports = router;
