import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

import SecondHeader from "../../components/Header/SecondHeader"
import SeleccionarOpciones from "../../components/UI/SeleccionarOpciones";
import SeleccionarCheckbox from "../../components/UI/Checkbox";
import Boton from "../../components/UI/Button";

export default function Perfil() {

  const [respiratoryCondition, setRespiratoryCondition] = useState('');
  const [allergy, setAllergy] = useState('');
  const [sensitivity, setSensitivity] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [notifications, setNotifications] = useState({
    airQuality: true,
    ecoRoutes: false
  });

  const completionPercentage = 75;
  
  const profileStatus = [
    { label: 'Condición Respiratoria', status: 'Completado', color: 'text-green-400' },
    { label: 'Alergias', status: 'Completado', color: 'text-green-400' },
    { label: 'Otras Sensibilidades', status: 'Pendiente', color: 'text-yellow-400' },
    { label: 'Unidades de Medida', status: 'Pendiente', color: 'text-yellow-400' }
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Header */}

        <SecondHeader/>
        
      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - perfil*/}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Perfil de Salud</h1>

            {/* Condiciones Respiratorias */}
                <SeleccionarOpciones
                    title="Condiciones Respiratorias"
                    label="Condición"
                    value={respiratoryCondition}
                    onChange={setRespiratoryCondition}
                    options={[
                    { value: "", label: "Seleccionar condición" },
                    { value: "asma", label: "Asma" },
                    { value: "epoc", label: "EPOC" },
                    { value: "bronquitis", label: "Bronquitis" },
                    { value: "ninguna", label: "Ninguna" },
                    ]}
                />

        {/* Alergias */}


             <SeleccionarOpciones
                    title="Alergias"
                    label="Alergia"
                    value={allergy}
                    onChange={setAllergy}
                    options={[
                    { value: "", label: "Seleccionar álergia" },
                    
                    { value: "acaros", label: "Ácaros" }, 
                    { value: "moho", label: "Moho" },
                    { value: "ninguna", label: "Ninguna" },
                    ]}
            /> 

        {/* Unidades de Medida */}

            {/* <SeleccionarOpciones
                    title="Unidades de Medida"
                    label="Unidad de temperatura"
                    value={temperatureUnit}
                    onChange={setTemperatureUnit}
                    options={[
                    { value: "", label: "Seleccionar Medidas" },
                    { value: "ppm", label: "(ppm) Partes por millon " },
                    { value: "acaros", label: "(μg/m³) microgramo/metro cúbico" },
                    ]}
            /> */}


            {/* Otras Sensibilidades */}

            <SeleccionarOpciones
                    title="Otras Sensibilidades"
                    label="Sensibilidad"
                    value={sensitivity}
                    onChange={setSensitivity}
                    options={[
                    { value: "", label: "Seleccionar sensibilidad" },
                    { value: "humo", label: "Humo" },
                    { value: "oloresfuertes", label: "Olores fuertes" },
                    { value: "ninguna", label: "Ninguna" },
                    ]}
            />

            {/* Preferencias de Notificación */}
                <SeleccionarCheckbox
                    label="Notificaciones de calidad del aire"
                    checked={notifications.airQuality}
                    onChange={() =>
                        setNotifications({ ...notifications, airQuality: !notifications.airQuality })
                    }
                />

                <SeleccionarCheckbox
                    label="Alertas de rutas ecológicas"
                    checked={notifications.ecoRoutes}
                    onChange={() =>
                        setNotifications({ ...notifications, ecoRoutes: !notifications.ecoRoutes })
                    }
                />

           

            {/* Boton de guardar */}
            <Boton onClick={() => console.log("Cambios de perfil guardados!")}>
                Guardar Cambios
            </Boton>
        </div>

          {/* Columna derecha - status*/}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-6">Tu Perfil de Salud</h3>
              
              {/* Circulo Progresivo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionPercentage / 100)}`}
                      className="text-teal-400 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-teal-400">{completionPercentage}%</div>
                      <div className="text-xs text-gray-400">Completado</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto de estado */}
              <p className="text-center text-gray-400 text-sm mb-6">
                Completa tu perfil para obtener recomendaciones personalizadas y mejorar tu experiencia AERIS.
              </p>

              {/* Lista de estado */}
              <div className="space-y-3 mb-6">
                {profileStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.status === 'Completado' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-gray-300 text-sm">{item.label}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>

              {/* Mensaje de beneficios */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-xs text-center">
                  ¡Desbloquea más beneficios completando todos los campos!
                </p>
              </div>

                <Boton onClick={() => console.log("Cambios de perfil guardados!")}>
                    Ver recompensas
                </Boton>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
