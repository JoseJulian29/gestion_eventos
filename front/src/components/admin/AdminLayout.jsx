// src/components/admin/AdminLayout.jsx
import React from 'react';
import Sidebar from './SideBar'; // Asegúrate de importar el Sidebar

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
