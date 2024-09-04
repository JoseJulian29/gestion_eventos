const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }, // URL de la imagen de portada representativa
});

module.exports = mongoose.model('Category', UserSchema);
