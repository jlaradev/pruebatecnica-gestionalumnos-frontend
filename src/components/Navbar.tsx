import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyles = ({ isActive }: { isActive: boolean }) => 
    `px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
      isActive 
        ? 'bg-white text-black shadow-lg shadow-white/10' 
        : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo actualizado sin degradado */}
        <div className="flex items-center">
          <span className="font-black tracking-tighter text-xl italic text-white">
            PRUEBA<span className="text-cyan-500">TÉCNICA</span>
          </span>
        </div>
        
        <div className="flex gap-2">
          <NavLink to="/alumnos" className={linkStyles}>Alumnos</NavLink>
          <NavLink to="/materias" className={linkStyles}>Materias</NavLink>
          <NavLink to="/notas" className={linkStyles}>Notas</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;