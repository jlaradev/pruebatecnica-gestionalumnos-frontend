function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-10 font-sans">
      
      {/* 1. Prueba de Tipografía y Colores Gradientes */}
      <section className="mb-12 border-b border-neutral-800 pb-6">
        <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Entorno de Pruebas
        </h1>
        <p className="text-neutral-400 text-xl mt-2">Verificación de componentes atómicos y utilidades CSS.</p>
      </section>

      {/* 2. Prueba de Flexbox, Gap y Bordes */}
      <div className="flex flex-wrap gap-4 mb-12">
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-cyan-400 font-mono">
          flex-layout: ok
        </div>
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-pink-400 font-mono">
          gap-spacing: ok
        </div>
        <div className="px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-yellow-400 font-mono">
          rounded-full: ok
        </div>
      </div>

      {/* 3. Prueba de Grid y Estados (Hover/Active) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Caja con Hover */}
        <div className="group p-8 bg-neutral-800 rounded-3xl transition-all duration-300 hover:bg-neutral-700 cursor-pointer border-2 border-transparent hover:border-cyan-500">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
          <h3 className="text-xl font-bold mb-2 text-white">Interacción</h3>
          <p className="text-neutral-400 text-sm">Si pasas el mouse, esta caja cambia de color y el icono crece.</p>
        </div>

        {/* Caja con Sombra (Ring) */}
        <div className="p-8 bg-neutral-800 rounded-3xl ring-4 ring-blue-500/20 shadow-2xl shadow-blue-500/10">
          <div className="text-3xl mb-4">💎</div>
          <h3 className="text-xl font-bold mb-2 text-white">Sombras y Rings</h3>
          <p className="text-neutral-400 text-sm">Verificación de elevación y anillos de enfoque.</p>
        </div>

        {/* Caja con Opacidad */}
        <div className="p-8 bg-cyan-900/20 border border-cyan-500/30 rounded-3xl">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2 text-cyan-400">Transparencias</h3>
          <p className="text-cyan-200/60 text-sm">Prueba de colores con canal alfa (opacidad).</p>
        </div>

        {/* Caja de Botones */}
        <div className="p-8 bg-neutral-800 rounded-3xl flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-4 text-white">Botones</h3>
          <button className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform hover:bg-neutral-200">
            Click Me
          </button>
        </div>

      </div>

      {/* 4. Footer de Status */}
      <footer className="mt-20 pt-8 border-top border-neutral-800 flex justify-between items-center text-xs text-neutral-500 uppercase tracking-widest">
        <span>Vite + React + Tailwind v4</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema Listo
        </div>
      </footer>

    </div>
  )
}

export default App