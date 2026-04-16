import { useEffect, useState } from 'react';
import { alumnoService } from '../services/alumnoService';
import type { Alumno } from '../interfaces/types';

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroId, setFiltroId] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  // Estado para la notificación (Toast)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Alumno>({
    nombre: '',
    apellido: '',
    email: '',
    fecha_nacimiento: ''
  });

  useEffect(() => {
    cargarAlumnos();
  }, []);

  // Función para mostrar mensajes temporales
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarAlumnos = async () => {
    setLoading(true);
    setMensajeError(null);
    setIsFiltered(false);
    setFiltroId('');
    try {
      const data = await alumnoService.obtenerTodos();
      setAlumnos(data);
    } catch (error) {
      setMensajeError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const buscarPorId = async () => {
    if (!filtroId.trim()) return;
    setMensajeError(null);
    setLoading(true);
    try {
      const alumno = await alumnoService.obtenerPorId(Number(filtroId));
      setAlumnos([alumno]);
      setIsFiltered(true);
    } catch (error: any) {
      setAlumnos([]);
      setIsFiltered(true);
      setMensajeError(`No existe un alumno con el ID #${filtroId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (confirmDelete.id) {
      try {
        await alumnoService.eliminar(confirmDelete.id);
        setAlumnos(alumnos.filter(a => a.id !== confirmDelete.id));
        setConfirmDelete({ isOpen: false, id: null });
        showToast("Registro eliminado correctamente");
      } catch (error) {
        showToast("Error al eliminar el registro", "error");
      }
    }
  };

  const abrirModal = (alumno?: Alumno) => {
    setMensajeError(null);
    if (alumno) {
      setEditandoId(alumno.id!);
      setFormData({ ...alumno });
    } else {
      setEditandoId(null);
      setFormData({ nombre: '', apellido: '', email: '', fecha_nacimiento: '' });
    }
    setIsModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const actualizado = await alumnoService.actualizar(editandoId, formData);
        setAlumnos(alumnos.map(a => a.id === editandoId ? actualizado : a));
        showToast("Alumno actualizado con éxito");
      } else {
        await alumnoService.crear(formData);
        await cargarAlumnos();
        showToast("Nuevo alumno registrado");
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast("Error al procesar la solicitud", "error");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* NOTIFICACIÓN FLOTANTE (Toast) */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${
          toast.type === 'success' 
            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          <span className="text-sm font-bold uppercase tracking-wider italic">{toast.message}</span>
          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic">Estudiantes</h1>
          <p className="text-neutral-500 text-sm font-medium">Control de registros académicos.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="flex bg-neutral-800 border border-neutral-700 rounded-xl p-1 items-center">
            <input 
              type="number"
              placeholder="ID..."
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent px-3 py-1 text-sm focus:outline-none w-20 transition-all text-white font-mono"
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPorId()}
            />
            <button 
              onClick={buscarPorId}
              className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs font-black transition-all uppercase tracking-tight text-white active:scale-95"
            >
              Buscar
            </button>
            
            {isFiltered && (
              <button 
                onClick={cargarAlumnos}
                className="ml-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-xs font-bold text-cyan-500 transition-colors uppercase"
              >
                Limpiar
              </button>
            )}
          </div>

          <button 
            onClick={() => abrirModal()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20 uppercase text-xs"
          >
            + Nuevo Registro
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-neutral-800/40 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800/60 text-neutral-400 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">Estudiante</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Fecha Nac.</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-20 text-center animate-pulse text-neutral-500 uppercase text-xs font-bold tracking-widest">Sincronizando Sistema...</td></tr>
            ) : mensajeError ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-neutral-400 font-medium">
                  <span className="block mb-2">{mensajeError}</span>
                  <button onClick={cargarAlumnos} className="text-cyan-500 underline uppercase text-[10px] font-bold">Mostrar todos los alumnos</button>
                </td>
              </tr>
            ) : alumnos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-neutral-500 uppercase text-xs font-bold tracking-widest">
                  No se encontraron registros en el sistema
                </td>
              </tr>
            ) : (
              alumnos.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-cyan-500/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs group-hover:text-cyan-500/50 transition-colors">#{alumno.id}</td>
                  <td className="px-6 py-4 font-bold text-white tracking-tight">{alumno.nombre} {alumno.apellido}</td>
                  <td className="px-6 py-4 text-neutral-400 text-sm lowercase font-medium">{alumno.email}</td>
                  <td className="px-6 py-4 text-neutral-400 text-sm font-mono">
                    {alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toLocaleDateString() : '---'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => abrirModal(alumno)} className="hover:bg-cyan-500/20 text-neutral-500 hover:text-cyan-400 p-2 rounded-lg transition-all">
                        ✎
                      </button>
                      <button onClick={() => setConfirmDelete({ isOpen: true, id: alumno.id! })} className="hover:bg-red-500/20 text-neutral-500 hover:text-red-400 p-2 rounded-lg transition-all">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORMULARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-8 shadow-2xl scale-in-center">
            <h2 className="text-2xl font-black mb-6 tracking-tighter text-white uppercase italic">
              {editandoId ? 'Actualizar Datos' : 'Registrar Estudiante'}
            </h2>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Nombre" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
                  value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <input required placeholder="Apellido" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
                  value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
              </div>
              <input required type="email" placeholder="Email institucional" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <div className="relative">
                <label className="text-[9px] uppercase font-bold text-neutral-600 absolute -top-2 left-3 bg-neutral-900 px-1">Fecha Nacimiento</label>
                <input required type="date" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 color-scheme-dark"
                  value={formData.fecha_nacimiento} onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-neutral-500 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-all active:scale-95 text-xs uppercase tracking-widest">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-200">
          <div className="bg-neutral-900 border border-red-900/30 max-w-sm w-full rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">✕</div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">¿Eliminar registro?</h3>
            <p className="text-neutral-500 text-sm mb-8 leading-relaxed">Esta acción eliminará los datos del estudiante de forma permanente en el servidor.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete({ isOpen: false, id: null })} className="flex-1 py-3 bg-neutral-800 text-neutral-400 rounded-xl font-bold text-[10px] uppercase hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleEliminar} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95">Confirmar Baja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumnosPage;