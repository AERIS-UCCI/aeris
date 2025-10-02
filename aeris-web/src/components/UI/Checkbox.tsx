import React from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const SeleccionarCheckbox : React.FC<CustomCheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-teal-500 border-teal-500" : "border-slate-600"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-gray-300 text-sm">{label}</span>
    </label>
  );
};

export default SeleccionarCheckbox ;
