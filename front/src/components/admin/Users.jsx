import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import UserModal from './UserModal';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const currentUser = user;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'No se pudo obtener la lista de usuarios.', 'error');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5001/api/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
    }
  };

  const handleSaveUser = (savedUser) => {
    if (selectedUser) {
      setUsers(users.map(user => (user._id === savedUser._id ? savedUser : user)));
    } else {
      setUsers([...users, savedUser]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Crear Usuario
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Correo</th>
            <th className="border border-gray-300 p-2">Rol</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2">{user._id}</td>
              <td className="border border-gray-300 p-2">{user.username}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                {currentUser.role === 'Taquilla' && (
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <UserModal user={selectedUser} onClose={() => setShowModal(false)} onSave={handleSaveUser} />}
    </div>
  );
};

export default Users;
