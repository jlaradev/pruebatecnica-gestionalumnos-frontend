import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import AlumnosPage from './pages/AlumnosPage.tsx';
import MateriasPage from './pages/MateriasPage.tsx';
import NotasPage from './pages/NotasPage.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
        {/* Navbar Global */}
        <Navbar />

        {/* Contenido Dinámico */}
        <main className="flex-1 p-6 md:p-10">
          <Routes>
            {/* Redirección por defecto a alumnos */}
            <Route path="/" element={<Navigate to="/alumnos" />} />
            
            <Route path="/alumnos" element={<AlumnosPage />} />
            <Route path="/materias" element={<MateriasPage />} />
            <Route path="/notas" element={<NotasPage />} />
            
            {/* 404 - Opcional */}
            <Route path="*" element={<div className="text-center mt-20 text-neutral-500">Página no encontrada</div>} />
          </Routes>
        </main>

        {/* Footer Global */}
        <footer className="p-6 border-t border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-[0.2em] flex justify-between">
          <span>Prueba Técnica Abril 2026</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;