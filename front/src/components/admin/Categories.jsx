import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CategoryModal from './CategoryModal';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const currentUser = user;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Swal.fire('Error', 'No se pudo obtener la lista de categorías.', 'error');
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5001/api/categories/${categoryId}`);
        setCategories(categories.filter(category => category._id !== categoryId));
        Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar la categoría.', 'error');
    }
  };

  const handleSaveCategory = (savedCategory) => {
    if (selectedCategory) {
      setCategories(categories.map(category => (category._id === savedCategory._id ? savedCategory : category)));
    } else {
      setCategories([...categories, savedCategory]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Crear Categoría
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Imagen</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="border border-gray-300 p-2">{category._id}</td>
              <td className="border border-gray-300 p-2">{category.name}</td>
              <td className="border border-gray-300 p-2">
                {category.image ? (
                  <img src={`http://localhost:5001/uploads/${category.image}`} alt={category.name} className="w-16 h-16 object-cover" />
                ) : (
                  'No hay imagen'
                )}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => handleEdit(category)}
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <FaEdit />
                </button>
                {currentUser.role === 'Taquilla' && (
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default Categories;
