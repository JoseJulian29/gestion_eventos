import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const EventFormModal = ({ isOpen, onClose, onEventCreated, eventToEdit, isEditMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [logo, setLogo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setBanner(eventToEdit.banner);
      setLogo(eventToEdit.logo);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setLocation(eventToEdit.location);
      setCategory(eventToEdit.category);
    }
  }, [isEditMode, eventToEdit]);

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !time || !location || !category) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos requeridos.',
      });
      return;
    }

    const eventData = {
      title,
      description,
      banner,
      logo,
      date,
      time,
      location,
      category,
      createdBy: user.id
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5001/api/events/${eventToEdit._id}`, eventData);
        Swal.fire({
          icon: 'success',
          title: 'Evento actualizado',
          text: 'El evento ha sido actualizado exitosamente.',
        });
      } else {
        await axios.post('http://localhost:5001/api/events', eventData);
        Swal.fire({
          icon: 'success',
          title: 'Evento creado',
          text: 'El evento ha sido creado exitosamente.',
        });
      }
      onEventCreated();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el evento. Inténtalo de nuevo.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
        <form onSubmit={handleSaveEvent}>
          <input
            type="text"
            placeholder="Título"
            className="border p-2 mb-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción"
            className="border p-2 mb-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Banner (URL)"
            className="border p-2 mb-2 w-full"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
          />
          <input
            type="text"
            placeholder="Logo (URL)"
            className="border p-2 mb-2 w-full"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 mb-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            className="border p-2 mb-2 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ubicación"
            className="border p-2 mb-2 w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <select
            className="border p-2 mb-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
