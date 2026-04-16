import { useEffect, useState } from 'react'
import { alumnoService } from './services/alumnoService'
import { materiaService } from './services/materiaService'
import { notaService } from './services/notaService'
import type { Alumno, Materia, Nota } from './interfaces/types'

function App() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [notasAlumno1, setNotasAlumno1] = useState<Nota[]>([])
  const [notasAlumno2, setNotasAlumno2] = useState<Nota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [resAlumnos, resMaterias, resNotas1, resNotas2] = await Promise.all([
          alumnoService.obtenerTodos(),
          materiaService.obtenerTodos(),
          notaService.obtenerPorAlumno(1),
          notaService.obtenerPorAlumno(2)
        ])
        
        setAlumnos(resAlumnos)
        setMaterias(resMaterias)
        setNotasAlumno1(resNotas1)
        setNotasAlumno2(resNotas2)
      } catch (err) {
        console.error("Error en la sincronización:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarTodo()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-10 font-sans">
      
      {/* 1. Encabezado Original */}
      <section className="mb-12 border-b border-neutral-800 pb-6">
        <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Entorno de Pruebas
        </h1>
        <p className="text-neutral-400 text-xl mt-2">Verificación de componentes atómicos, utilidades CSS y API.</p>
      </section>

      {/* 2. Status Pills */}
      <div className="flex flex-wrap gap-4 mb-12">
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-cyan-400 font-mono text-sm">
          flex-layout: ok
        </div>
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-pink-400 font-mono text-sm">
          gap-spacing: ok
        </div>
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-yellow-400 font-mono text-sm">
          api-records: {alumnos.length + materias.length}
        </div>
      </div>

      {/* 3. Grid Original (Hover, Sombras, etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        
        <div className="group p-8 bg-neutral-800 rounded-3xl transition-all duration-300 hover:bg-neutral-700 cursor-pointer border-2 border-transparent hover:border-cyan-500">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
          <h3 className="text-xl font-bold mb-2">Interacción</h3>
          <p className="text-neutral-400 text-sm">Si pasas el mouse, esta caja cambia de color y el icono crece.</p>
        </div>

        <div className="p-8 bg-neutral-800 rounded-3xl ring-4 ring-blue-500/20 shadow-2xl shadow-blue-500/10">
          <div className="text-3xl mb-4">💎</div>
          <h3 className="text-xl font-bold mb-2">Sombras y Rings</h3>
          <p className="text-neutral-400 text-sm">Verificación de elevación y anillos de enfoque.</p>
        </div>

        <div className="p-8 bg-cyan-900/20 border border-cyan-500/30 rounded-3xl">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2 text-cyan-400">Transparencias</h3>
          <p className="text-cyan-200/60 text-sm">Prueba de colores con canal alfa (opacidad).</p>
        </div>

        <div className="p-8 bg-neutral-800 rounded-3xl flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-4">Botones</h3>
          <button className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform hover:bg-neutral-200">
            Click Me
          </button>
        </div>

      </div>

      {/* --- 4. DATA VISUALIZER (Grid de 4 paneles - Debajo de lo original) --- */}
      <section className="mt-20 border-t border-neutral-800 pt-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <span className="bg-white text-black px-3 py-1 rounded-lg text-sm uppercase">Live</span>
          Data Visualizer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Panel Alumnos */}
          <div className="p-6 bg-neutral-800/40 border border-neutral-800 rounded-3xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Alumnos
            </h2>
            <pre className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-cyan-300 overflow-x-auto h-64">
              {JSON.stringify(alumnos, null, 2)}
            </pre>
          </div>

          {/* Panel Materias */}
          <div className="p-6 bg-neutral-800/40 border border-neutral-800 rounded-3xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-pink-400">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              Materias
            </h2>
            <pre className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-pink-300 overflow-x-auto h-64">
              {JSON.stringify(materias, null, 2)}
            </pre>
          </div>

          {/* Panel Notas Alumno 1 */}
          <div className="p-6 bg-neutral-800/40 border border-neutral-800 rounded-3xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Notas: Santiago (ID 1)
            </h2>
            <pre className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-purple-300 overflow-x-auto h-64">
              {notasAlumno1.length > 0 ? JSON.stringify(notasAlumno1, null, 2) : "// Sin registros"}
            </pre>
          </div>

          {/* Panel Notas Alumno 2 */}
          <div className="p-6 bg-neutral-800/40 border border-neutral-800 rounded-3xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Notas: Carlos (ID 2)
            </h2>
            <pre className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-orange-300 overflow-x-auto h-64">
              {notasAlumno2.length > 0 ? JSON.stringify(notasAlumno2, null, 2) : "// Sin registros"}
            </pre>
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-20 pt-8 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-[0.2em]">
        <span>Vite + React + Tailwind v4</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
          {loading ? 'Sincronizando...' : 'Conexión Exitosa'}
        </div>
      </footer>

    </div>
  )
}

export default App