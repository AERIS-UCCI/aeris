
import logo from '/assets/Logo.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
    <>
        <footer className="w-full flex items-center justify-between px-12 py-4 bg-[#0B1C12] text-gray-400 text-sm">
        {/* Texto izquierda */}
        <p>© 2025 AERIS. Todos los derechos reservados.</p>

        {/* Links derecha */}
        <ul className="flex gap-8">
            <li>
            <a href="#" className="hover:text-green-400 transition">
                Política de privacidad
            </a>
            </li>
            <li>
            <a href="#" className="hover:text-green-400 transition">
                Términos de servicio
            </a>
            </li>
            <li>
            <a href="#" className="hover:text-green-400 transition">
                Contacto
            </a>
            </li>
        </ul>
        </footer>
    </>
    )
}

export default Footer;
