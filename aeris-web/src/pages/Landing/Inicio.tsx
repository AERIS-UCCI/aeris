import React from "react";
import { Wind, Map, Heart } from "lucide-react";
import backgroundimg from 'aeris-web/public/img/Ciudad-verde.jpg';

const Inicio = () => {

    

    return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-teal-900 to-teal-950">
      {/* 1° Sección - foto con palabras */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/img/Ciudad-verde.jpg')" }}
        ></div>
        
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/70 to-teal-950/90 z-0"></div>
        
        {/* Palabras encima del fondo */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Respira un aire más limpio, vive mejor.
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            AERIS te ayuda a planificar tus rutas y actividades diarias considerando la calidad del aire en tiempo real.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg">
            Descubre tu aire saludable
          </button>
        </div>
      </div>

      {/* 2° Sección - servicios */}
      <div className="bg-teal-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Cómo AERIS mejora tu día a día
          </h2>
          <p className="text-gray-300 text-lg mb-16 max-w-2xl">
            Con AERIS, puedes tomar decisiones informadas para proteger tu salud y contribuir a un futuro más sostenible.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Aqui iran las caracteristicas de la app
            /* caracteristica del app 1 */}
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-700/50 rounded-xl p-8 hover:border-green-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <Wind className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Pronóstico de calidad del aire
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Accede a información precisa y actualizada sobre la calidad del aire en tu zona y alrededores.
              </p>
            </div>

            {/* caracteristica del app 2*/}
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-700/50 rounded-xl p-8 hover:border-green-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <Map className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Rutas ecológicas
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Planifica tus desplazamientos eligiendo las rutas con menor contaminación.
              </p>
            </div>

            {/* caracteristica del app 3*/}
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-700/50 rounded-xl p-8 hover:border-green-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Recomendaciones personalizadas
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Recibe sugerencias adaptadas a tus necesidades y preferencias para un estilo de vida más saludable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    )
}

export default Inicio;