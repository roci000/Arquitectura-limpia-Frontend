// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './presentation/pages/DashboardPage';
import ProductoListPage from './presentation/pages/ProductoListPage';
import ProductoFormPage from './presentation/pages/ProductoFormPage';
import ProveedorListPage from './presentation/pages/ProveedorListPage';
import ProveedorFormPage from './presentation/pages/ProveedorFormPage';
import EmpleadoListPage from './presentation/pages/EmpleadoListPage';
import EmpleadoFormPage from './presentation/pages/EmpleadoFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        
        <Route path="/productos" element={<ProductoListPage />} />
        <Route path="/productos/nuevo" element={<ProductoFormPage />} />
        <Route path="/productos/editar/:id" element={<ProductoFormPage />} />
        
        <Route path="/proveedores" element={<ProveedorListPage />} />
        <Route path="/proveedores/nuevo" element={<ProveedorFormPage />} />
        <Route path="/proveedores/editar/:id" element={<ProveedorFormPage />} />

        <Route path="/empleados" element={<EmpleadoListPage />} />
        <Route path="/empleados/nuevo" element={<EmpleadoFormPage />} />
        <Route path="/empleados/editar/:id" element={<EmpleadoFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}