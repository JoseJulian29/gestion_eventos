const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Cargar imagen
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
};

// Eliminar imagen
const deleteImage = (req, res) => {
  const fileUrl = req.query.file;

  if (!fileUrl) {
    return res.status(400).send('No file specified');
  }

  const filePath = path.join(__dirname, '..', 'uploads', path.basename(fileUrl));

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to delete file:', err);
      return res.status(500).send('Failed to delete file');
    }

    res.send('File deleted');
  });
};

module.exports = {
  upload,
  uploadImage,
  deleteImage,
};
