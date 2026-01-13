// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './presentation/pages/DashboardPage';
import ProductoListPage from './presentation/pages/ProductoListPage';
import ProductoFormPage from './presentation/pages/ProductoFormPage';
import ProveedorListPage from './presentation/pages/ProveedorListPage';
import ProveedorFormPage from './presentation/pages/ProveedorFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        
        {/* Productos */}
        <Route path="/productos" element={<ProductoListPage />} />
        <Route path="/productos/nuevo" element={<ProductoFormPage />} />
        <Route path="/productos/editar/:id" element={<ProductoFormPage />} />
        
        {/* Proveedores */}
        <Route path="/proveedores" element={<ProveedorListPage />} />
        <Route path="/proveedores/nuevo" element={<ProveedorFormPage />} />
        <Route path="/proveedores/editar/:id" element={<ProveedorFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}