import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CategoryModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      if (category.image) {
        setImage(`http://localhost:5001/uploads/${category.image}`);
        setImageToDelete(category.image);
      } else {
        setImage(null);
        setImageToDelete(null);
      }
      setIsEditing(true);
    } else {
      setName('');
      setImage(null);
      setImageToDelete(null);
      setIsEditing(false);
    }
  }, [category]);

  useEffect(() => {
    return () => {
      if (imageToDelete) {
        handleDeleteImage(true);
      }
    };
  }, [onClose]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImageToDelete(null);  
    } else {
      Swal.fire('Error', 'Por favor selecciona un archivo de imagen válido.', 'error');
    }
  };

  const handleDeleteImage = async (isCancel = false) => {
    if (!isEditing || !imageToDelete) return;

    const result = isCancel
      ? { isConfirmed: true }
      : await Swal.fire({
          title: '¿Estás seguro?',
          text: 'No podrás revertir esta acción.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5001/api/images?file=${imageToDelete}`);
        await axios.put(`http://localhost:5001/api/categories/${category._id}`, { name, image: null });
        
        setImage(null);
        setImageToDelete(null);

        Swal.fire('¡Eliminada!', 'La imagen ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar la imagen.', 'error');
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (image && image instanceof File) {
      formData.append('image', image);
    }
    
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:5001/api/categories/${category._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onSave(response.data);
        Swal.fire('Actualizado!', 'La categoría ha sido actualizada correctamente.', 'success');
      } else {
        const response = await axios.post('http://localhost:5001/api/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onSave(response.data);
        Swal.fire('Creado!', 'La categoría ha sido creada correctamente.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response && error.response.data.message === 'Category with the same name already exists') {
        Swal.fire('Error', 'Ya existe una categoría con el mismo nombre.', 'error');
      } else {
        Swal.fire('Error', 'Hubo un problema al guardar la categoría.', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Imagen</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          {image && (
            <div className="mt-4">
              <img
                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                alt={name}
                className="w-16 h-16 object-cover"
              />
              {typeof image === 'string' && (
                <button
                  onClick={handleDeleteImage}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Eliminar Imagen
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
