import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserModal = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Taquilla');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setIsEditing(true);
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('Taquilla');
      setIsEditing(false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:5001/api/users/${user._id}`, { username, email, role });
        onSave(response.data);
        Swal.fire('Actualizado!', 'El usuario ha sido actualizado correctamente.', 'success');
      } else {
        const response = await axios.post('http://localhost:5001/api/users', { username, email, password, role });
        onSave(response.data);
        Swal.fire('Creado!', 'El usuario ha sido creado correctamente.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      Swal.fire('Error', 'Hubo un problema al guardar el usuario.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        {!isEditing && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="Taquilla">Taquilla</option>
            <option value="Organizador">Organizador</option>
            <option value="Participante">Participante</option>
          </select>
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

export default UserModal;
