import React from "react";

interface BotonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<BotonProps> = ({ children, onClick }) => {
  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold px-12 py-3 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all transform hover:scale-105 shadow-lg"
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
