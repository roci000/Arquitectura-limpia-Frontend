// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './presentation/pages/DashboardPage';
import ProductoPage from './presentation/pages/ProductoPage';
import VentaPage from './presentation/pages/VentaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/productos" element={<ProductoPage />} />
        <Route path="/ventas" element={<VentaPage />} />
      </Routes>
    </BrowserRouter>
  );
}