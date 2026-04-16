import { useEffect, useState } from 'react';
import { notaService } from '../services/notaService';
import { alumnoService } from '../services/alumnoService';
import { materiaService } from '../services/materiaService';
import type { Nota, Alumno, Materia } from '../interfaces/types';

const NotasPage = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroId, setFiltroId] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    valor: 0,
    alumno_id: 0,
    materia_id: 0
  });

  // Estados temporales para los inputs de "buscar por código" en el modal
  const [buscarAlumnoId, setBuscarAlumnoId] = useState('');
  const [buscarMateriaId, setBuscarMateriaId] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const cargarDatosRelacionales = async () => {
      try {
        const [resAlumnos, resMaterias] = await Promise.all([
          alumnoService.obtenerTodos(),
          materiaService.obtenerTodos()
        ]);
        setAlumnos(resAlumnos);
        setMaterias(resMaterias);
      } catch (error) {
        showToast("Error al cargar datos del sistema", "error");
      }
    };
    cargarDatosRelacionales();
  }, []);

  const obtenerNombreMateria = (materiaId: number) => {
    const materia = materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : `Materia #${materiaId}`;
  };

  const buscarNotasAlumno = async () => {
    if (!filtroId.trim()) return;
    setLoading(true);
    try {
      const alumno = await alumnoService.obtenerPorId(Number(filtroId));
      setAlumnoSeleccionado(alumno);
      const data = await notaService.obtenerPorAlumno(alumno.id!);
      setNotas(data);
    } catch (error) {
      setAlumnoSeleccionado(null);
      setNotas([]);
      showToast("No se encontró el alumno", "error");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltro = () => {
    setFiltroId('');
    setAlumnoSeleccionado(null);
    setNotas([]);
  };

  // Sincronizar input de texto con el Select de Alumno
  const handleBuscarAlumnoChange = (idStr: string) => {
    setBuscarAlumnoId(idStr);
    const idNum = Number(idStr);
    if (alumnos.some(a => a.id === idNum)) {
      setFormData(prev => ({ ...prev, alumno_id: idNum }));
    }
  };

  // Sincronizar input de texto con el Select de Materia
  const handleBuscarMateriaChange = (idStr: string) => {
    setBuscarMateriaId(idStr);
    const idNum = Number(idStr);
    if (materias.some(m => m.id === idNum)) {
      setFormData(prev => ({ ...prev, materia_id: idNum }));
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Obtenemos la fecha y hora local (Bogotá)
      const ahora = new Date();
    
      // 2. Formateamos manualmente a YYYY-MM-DDTHH:mm:ss (Formato que entiende LocalDateTime)
      const fechaLocal = ahora.getFullYear() + "-" +
        String(ahora.getMonth() + 1).padStart(2, '0') + "-" +
        String(ahora.getDate()).padStart(2, '0') + "T" +
        String(ahora.getHours()).padStart(2, '0') + ":" +
        String(ahora.getMinutes()).padStart(2, '0') + ":" +
        String(ahora.getSeconds()).padStart(2, '0');

      const payload = {
        valor: formData.valor,
        alumno_id: formData.alumno_id,
        materia_id: formData.materia_id,
        fecha_registro: fechaLocal // <--- Ya no usamos .toISOString()
      };

      await notaService.crear(payload as any);
      showToast("Nota registrada con éxito");
      setIsModalOpen(false);
      setBuscarAlumnoId('');
      setBuscarMateriaId('');
    
      if (alumnoSeleccionado?.id === formData.alumno_id) {
        buscarNotasAlumno();
      }
    } catch (error) {
      showToast("Error al procesar el registro", "error");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* TOAST */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${
          toast.type === 'success' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          <span className="text-sm font-bold uppercase tracking-wider italic">{toast.message}</span>
          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic">Calificaciones</h1>
          <p className="text-neutral-500 text-sm font-medium">Panel de rendimiento académico.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="flex bg-neutral-800 border border-neutral-700 rounded-xl p-1 items-center">
            <input 
              type="number"
              placeholder="ID Alumno..."
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent px-3 py-1 text-sm focus:outline-none w-24 transition-all text-white font-mono"
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarNotasAlumno()}
            />
            <button 
              onClick={buscarNotasAlumno}
              className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs font-black transition-all uppercase tracking-tight text-white active:scale-95"
            >
              Consultar
            </button>
            
            {alumnoSeleccionado && (
              <button 
                onClick={limpiarFiltro}
                className="ml-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-xs font-bold text-cyan-500 transition-colors uppercase"
              >
                Limpiar
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20 uppercase text-xs"
          >
            + Nueva Nota
          </button>
        </div>
      </div>

      {/* Info del Estudiante Seleccionado */}
      {alumnoSeleccionado && (
        <div className="mb-4 px-2 animate-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
              {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}
              <span className="ml-3 text-neutral-600 font-mono text-sm not-italic font-medium tracking-normal">ID: #{alumnoSeleccionado.id}</span>
            </h2>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-neutral-800/40 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800/60 text-neutral-400 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-6 py-4 font-bold">Materia</th>
              <th className="px-6 py-4 font-bold text-center">Fecha Registro</th>
              <th className="px-6 py-4 font-bold text-right">Calificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-20 text-center animate-pulse text-neutral-500 uppercase text-xs font-bold tracking-widest">Consultando registros...</td></tr>
            ) : !alumnoSeleccionado ? (
              <tr><td colSpan={3} className="px-6 py-20 text-center text-neutral-600 uppercase text-[10px] font-bold tracking-widest italic">Ingrese un ID de alumno para ver sus notas</td></tr>
            ) : notas.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center text-neutral-500 font-medium italic">
                  El alumno <span className="text-neutral-300 font-bold">{alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</span> no tiene notas cargadas.
                </td>
              </tr>
            ) : (
              notas.map((nota) => (
                <tr key={nota.id} className="hover:bg-cyan-500/[0.03] transition-colors group">
                  <td className="px-6 py-4 font-bold text-white tracking-tight">
                    {obtenerNombreMateria(nota.materia_id)}
                  </td>
                  <td className="px-6 py-4 text-center text-neutral-500 font-mono text-xs italic">
                    {nota.fecha_registro ? (
                        <div className="flex items-center justify-center gap-2">
                            <span>{new Date(nota.fecha_registro).toLocaleDateString()}</span>
                            <span className="text-neutral-700">|</span>
                            <span className="text-cyan-500/70 not-italic font-bold">
                                {new Date(nota.fecha_registro).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ) : '---'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xl font-black font-mono ${nota.valor >= 3 ? 'text-cyan-400' : 'text-red-500'}`}>
                      {nota.valor.toFixed(1)}
                    </span>
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
            <h2 className="text-2xl font-black mb-6 tracking-tighter text-white uppercase italic">Registrar Nota</h2>
            
            <form onSubmit={handleGuardar} className="space-y-6">
              {/* Sección Alumno con Búsqueda por ID */}
              <div>
                <label className="text-[9px] uppercase font-bold text-neutral-600 mb-1 block ml-1">Estudiante</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="ID"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-20 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono text-sm"
                    value={buscarAlumnoId}
                    onChange={(e) => handleBuscarAlumnoChange(e.target.value)}
                  />
                  <select 
                    required
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm"
                    value={formData.alumno_id || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({...formData, alumno_id: val});
                      setBuscarAlumnoId(val.toString());
                    }}
                  >
                    <option value="">Seleccione alumno...</option>
                    {alumnos.map(a => (
                      <option key={a.id} value={a.id}>{a.id} - {a.nombre} {a.apellido}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sección Materia con Búsqueda por ID */}
              <div>
                <label className="text-[9px] uppercase font-bold text-neutral-600 mb-1 block ml-1">Materia</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="ID"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-20 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono text-sm"
                    value={buscarMateriaId}
                    onChange={(e) => handleBuscarMateriaChange(e.target.value)}
                  />
                  <select 
                    required
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 text-sm"
                    value={formData.materia_id || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({...formData, materia_id: val});
                      setBuscarMateriaId(val.toString());
                    }}
                  >
                    <option value="">Seleccione asignatura...</option>
                    {materias.map(m => (
                      <option key={m.id} value={m.id}>{m.id} - {m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calificación */}
              <div>
                <label className="text-[9px] uppercase font-bold text-neutral-600 mb-1 block ml-1">Calificación (0.0 - 5.0)</label>
                <input 
                  required 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="5"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500 font-mono"
                  value={formData.valor || ''}
                  onChange={(e) => setFormData({...formData, valor: Number(e.target.value)})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-neutral-500 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-all text-xs uppercase tracking-widest">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotasPage;