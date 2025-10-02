
import logo from '/assets/Logo.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
    <>
        <nav className="w-full flex items-center justify-between px-12 py-3 bg-[#0B1C12] text-white">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-600 rotate-45"></div>
                <span className="font-bold text-sm tracking-wide">aeris</span>
            </div>

            {/* Menú */}
            <ul className="hidden md:flex gap-8 text-sm font-sans">
                <li className="cursor-pointer hover:text-green-400">Inicio</li>
                <li className="cursor-pointer hover:text-green-400">Características</li>
                <li className="cursor-pointer hover:text-green-400">Sobre nosotros</li>
                <li className="cursor-pointer hover:text-green-400">Contacto</li>
            </ul>

            {/* Botón */}
           <Link 
            to="/Registro" 
            className="bg-green-500 text-black px-5 py-2 rounded-md font-medium hover:bg-green-400 transition inline-block"
            >
            Empezar
            </Link>
        </nav>
    </>
    )
}

export default Footer;
