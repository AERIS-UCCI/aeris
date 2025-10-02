import React, { useState } from 'react';
import { Twitter, Facebook, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AerisLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

  const handleSubmit = () => {
    console.log('Login submitted:', formData);
  };

  return (
    <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50">
                <div className="w-8 h-8 border-4 border-white transform rotate-45"></div>
            </div>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
                Bienvenido
            </h1>
            <p className="text-gray-400">
                Inicia sesión para continuar con AERIS
            </p>
            </div>

            {/* Inicio Rapido */}
            <p className="text-gray-400 text-center text-sm mb-4">
            Inicia sesión rápidamente con:
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
            <button className="flex items-center justify-center h-12 border-2 border-teal-700 rounded-full hover:border-teal-500 hover:bg-teal-900/20 transition-all">
                <Twitter className="w-5 h-5 text-white" />
            </button>
            <button className="flex items-center justify-center h-12 border-2 border-teal-700 rounded-full hover:border-teal-500 hover:bg-teal-900/20 transition-all">
                <Facebook className="w-5 h-5 text-white" />
            </button>
            <button className="flex items-center justify-center h-12 border-2 border-teal-700 rounded-full hover:border-teal-500 hover:bg-teal-900/20 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            </button>
            </div>

            {/* Division */}
            <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-gray-500">O usa tu email</span>
            </div>
            </div>

            {/* Formulario del login */}
            <div className="space-y-5 mb-6">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-teal-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-teal-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
            </div>

            {/* Recuperacion de password y recuerdame */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                <div 
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-teal-500 border-teal-500' : 'border-teal-700'
                    }`}
                >
                    {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    )}
                </div>
                <span className="text-gray-400 text-sm">Recuérdame</span>
                </label>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                ¿Olvidaste tu contraseña?
                </a>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold py-4 rounded-full hover:from-cyan-500 hover:to-teal-500 transition-all transform hover:scale-[1.02] shadow-lg"
            >
                Iniciar Sesión
            </button>
            </div>

            {/* Enlace de Pantalla Registro*/}
            <p className="text-center text-gray-400 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/Registro">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Regístrate gratis
                </a>
            </Link>
            </p>

            {/* Terminos y Politicas */}
            <p className="text-center text-gray-500 text-xs mt-8">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Términos de Servicio
            </a>
            {' '}y{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Política de Privacidad
            </a>
            </p>
        </div>
        </div>
    </>
  );
}
