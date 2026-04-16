import { useEffect, useState } from 'react';
import { materiaService } from '../services/materiaService';
import type { Materia } from '../interfaces/types';

const MateriasPage = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
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
  
  const [formData, setFormData] = useState<Materia>({
    nombre: '',
    codigo: '',
    creditos: 0
  });

  useEffect(() => {
    cargarMaterias();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarMaterias = async () => {
    setLoading(true);
    setMensajeError(null);
    setIsFiltered(false);
    setFiltroId('');
    try {
      const data = await materiaService.obtenerTodos();
      setMaterias(data);
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
      const materia = await materiaService.obtenerPorId(Number(filtroId));
      setMaterias([materia]);
      setIsFiltered(true);
    } catch (error: any) {
      setMaterias([]);
      setIsFiltered(true);
      setMensajeError(`No existe una materia con el ID #${filtroId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (confirmDelete.id) {
      try {
        await materiaService.eliminar(confirmDelete.id);
        setMaterias(materias.filter(m => m.id !== confirmDelete.id));
        setConfirmDelete({ isOpen: false, id: null });
        showToast("Materia eliminada correctamente");
      } catch (error) {
        showToast("Error al eliminar la materia", "error");
      }
    }
  };

  const abrirModal = (materia?: Materia) => {
    setMensajeError(null);
    if (materia) {
      setEditandoId(materia.id!);
      setFormData({ ...materia });
    } else {
      setEditandoId(null);
      setFormData({ nombre: '', codigo: '', creditos: 0 });
    }
    setIsModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const actualizado = await materiaService.actualizar(editandoId, formData);
        setMaterias(materias.map(m => m.id === editandoId ? actualizado : m));
        showToast("Materia actualizada con éxito");
      } else {
        await materiaService.crear(formData);
        await cargarMaterias();
        showToast("Nueva materia registrada");
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast("Error al procesar la solicitud", "error");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* TOAST */}
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
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic">Materias</h1>
          <p className="text-neutral-500 text-sm font-medium">Gestión del catálogo de asignaturas.</p>
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
            <button onClick={buscarPorId} className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs font-black transition-all uppercase tracking-tight text-white active:scale-95">
              Buscar
            </button>
            {isFiltered && (
              <button onClick={cargarMaterias} className="ml-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-xs font-bold text-cyan-500 transition-colors uppercase">
                Limpiar
              </button>
            )}
          </div>

          <button onClick={() => abrirModal()} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20 uppercase text-xs">
            + Nueva Materia
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-neutral-800/40 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800/60 text-neutral-400 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">Código</th>
              <th className="px-6 py-4 font-bold">Materia</th>
              <th className="px-6 py-4 font-bold">Créditos</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-20 text-center animate-pulse text-neutral-500 uppercase text-xs font-bold tracking-widest">Sincronizando Catálogo...</td></tr>
            ) : mensajeError ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-neutral-400 font-medium">
                  <span className="block mb-2">{mensajeError}</span>
                  <button onClick={cargarMaterias} className="text-cyan-500 underline uppercase text-[10px] font-bold">Mostrar todas las materias</button>
                </td>
              </tr>
            ) : materias.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-neutral-500 uppercase text-xs font-bold tracking-widest">
                  No se encontraron materias en el catálogo
                </td>
              </tr>
            ) : (
              materias.map((materia) => (
                <tr key={materia.id} className="hover:bg-cyan-500/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs group-hover:text-cyan-500/50">#{materia.id}</td>
                  <td className="px-6 py-4 font-mono text-cyan-500 text-xs">{materia.codigo}</td>
                  <td className="px-6 py-4 font-bold text-white tracking-tight">{materia.nombre}</td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-700 text-neutral-300 text-[10px] px-2 py-1 rounded-md font-bold">
                      {materia.creditos} CR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => abrirModal(materia)} className="hover:bg-cyan-500/20 text-neutral-500 hover:text-cyan-400 p-2 rounded-lg transition-all">✎</button>
                      <button onClick={() => setConfirmDelete({ isOpen: true, id: materia.id! })} className="hover:bg-red-500/20 text-neutral-500 hover:text-red-400 p-2 rounded-lg transition-all">✕</button>
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
              {editandoId ? 'Actualizar Materia' : 'Nueva Asignatura'}
            </h2>
            <form onSubmit={handleGuardar} className="space-y-4">
              <input required placeholder="Nombre de la materia" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Código (ej. MAT-101)" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors font-mono uppercase"
                  value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})} />
                
                <input required type="number" placeholder="Créditos" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                  value={formData.creditos} onChange={(e) => setFormData({...formData, creditos: Number(e.target.value)})} />
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-neutral-500 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-all active:scale-95 text-xs uppercase tracking-widest">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-200">
          <div className="bg-neutral-900 border border-red-900/30 max-w-sm w-full rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">✕</div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">¿Retirar materia?</h3>
            <p className="text-neutral-500 text-sm mb-8 leading-relaxed">Esta acción eliminará la asignatura del catálogo académico permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete({ isOpen: false, id: null })} className="flex-1 py-3 bg-neutral-800 text-neutral-400 rounded-xl font-bold text-[10px] uppercase hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleEliminar} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-red-500 transition-all active:scale-95">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MateriasPage;