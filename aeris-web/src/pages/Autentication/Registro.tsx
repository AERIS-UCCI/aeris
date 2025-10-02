import React, { useState } from 'react';
import { Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AerisRegister() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: ''
  });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Aquí irían las acciones de registro
  };

  return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Título */}
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Crear cuenta
        </h1>

        {/* Formulario */}
        <div className="space-y-5 mb-8">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-transparent border-2 border-teal-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-transparent border-2 border-teal-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-transparent border-2 border-teal-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold py-4 rounded-full hover:from-cyan-500 hover:to-teal-500 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Registrarse
          </button>
        </div>

        {/* Division de inicio rapido */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-auto text-gray-500">O continuar con</span>
          </div>
        </div>

        {/* Inicio rapido */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-700 rounded-full text-white hover:border-teal-500 hover:bg-teal-900/20 transition-all">
            <Twitter className="w-5 h-5" />
            <span className="font-medium text-sm">Twitter</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-700 rounded-full text-white hover:border-teal-500 hover:bg-teal-900/20 transition-all">
            <Facebook className="w-5 h-5" />
            <span className="font-medium text-sm">Facebook</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-700 rounded-full text-white hover:border-teal-500 hover:bg-teal-900/20 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-sm">Google</span>
          </button>
        </div>

        {/* Enlace de inicio */}
        <p className="text-center text-gray-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/Login">
            <a className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
              Inicia sesión
            </a>
          </Link>
        </p>
      </div>
    </div>
  </>
  );
}