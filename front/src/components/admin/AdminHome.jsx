// src/components/admin/AdminHome.jsx
import React from 'react';
import Sidebar from './SideBar'; // Asegúrate de importar el Sidebar

const AdminHome = () => {
  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {/* Aquí puedes agregar el contenido principal del panel de administración */}
      </div>
    </div>
  );
};

export default AdminHome;
