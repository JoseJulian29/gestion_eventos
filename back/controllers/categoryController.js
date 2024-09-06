const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getIo } = require('../socket');

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with the same name already exists' });
    }

    const newCategory = new Category({
      name,
      image,
    });

    const savedCategory = await newCategory.save();

    const io = getIo();
    io.emit('categoryUpdate');
    
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría por ID
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    
    const io = getIo();
    io.emit('categoryUpdate');

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una categoría por ID
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });

    // Eliminar imagen asociada si existe
    if (deletedCategory.image) {
      const imagePath = path.join(__dirname, '../uploads', deletedCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const io = getIo();
    io.emit('categoryUpdate');

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Cambia esto a la ruta donde deseas guardar los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Inicializa multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

// Exporta `upload` para usarlo en las rutas
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  upload
};
