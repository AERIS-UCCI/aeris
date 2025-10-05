import logo from './../../../public/img/Logo.png';
import { NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';

const SecondHeader = () => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="AERIS Logo"
                        className="w-16 h-16"
                    />
                    <span className="text-white font-bold text-lg">AERIS</span>
                </div>

                {/* Navegación */}
                <nav className="flex items-center gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white font-bold text-sm"
                                : "text-gray-400 hover:text-white transition-colors text-sm"
                        }
                    >
                        Inicio
                    </NavLink>

                    <NavLink
                        to="/Rutas"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white font-bold text-sm"
                                : "text-gray-400 hover:text-white transition-colors text-sm"
                        }
                    >
                        Mapa
                    </NavLink>

                    <NavLink
                        to="/RutasGuardadas"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white font-bold text-sm"
                                : "text-gray-400 hover:text-white transition-colors text-sm"
                        }
                    >
                        Rutas
                    </NavLink>

                    <NavLink
                        to="/Perfil"
                        className={({ isActive }) =>
                            isActive
                                ? "text-cyan-400 font-bold text-sm"
                                : "text-gray-400 hover:text-white transition-colors text-sm"
                        }
                    >
                        Perfil
                    </NavLink>
                </nav>

                {/* Usuario */}
                <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Usuario"
                        className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover cursor-pointer hover:scale-105 transition-transform"
                    />
                </div>
            </div>
        </header>
    );
};

export default SecondHeader;
