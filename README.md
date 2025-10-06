# 🌍 Proyecto - Instalación y Configuración

Este proyecto combina un **frontend en React + Vite** con un **backend en FastAPI**, además de datos externos.  
Sigue los pasos a continuación para configurar correctamente el entorno de desarrollo.  

---

## 🧩 Frontend

### 🚀 1. Clonar el repositorio

```bash
git clone https://github.com/AERIS-UCCI/aeris
cd aeris-web
```

### 📦 2. Instalar dependencias

Ejecuta los siguientes comandos:

```bash
npm install
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install @heroicons/react lucide-react
npm install leaflet leaflet.heat react-leaflet
npm install polyline
npm install gh-pages --save-dev
npm install --save-dev @types/leaflet
npm install i18next react-i18next
```

### ▶️ 3. Ejecutar el entorno de desarrollo

```bash
npm run dev
```

Por defecto, la aplicación estará disponible en:  
👉 [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Backend (FastAPI)

### 🧱 1. Crear y activar el entorno virtual

```bash
cd aeris-web-backend
python -m venv venv
.\venv\Scripts\activate   # En Windows
# source venv/bin/activate  # En macOS / Linux
```

### 📦 2. Instalar dependencias de Python

```bash
pip install fastapi uvicorn requests polyline
```

### ▶️ 3. Iniciar el servidor backend

```bash
uvicorn main:app --reload --port 8000
```

El backend se ejecutará en:  
👉 [http://localhost:8000](http://localhost:8000)

---

## 📊 Datos

Si los datos no se cargan correctamente, descárgalos desde el siguiente enlace y colócalos en la carpeta `data/` del proyecto:

📁 **[Descargar datos desde Google Drive](https://drive.google.com/drive/folders/1DPUtVaCK_cc9bJ7NNPVB2uPVI6OOOHub?usp=sharing)**

Estructura esperada:
```
/data
 ├── archivo1.json
 ├── archivo2.json
 └── ...
```

---

## 🧠 Requisitos previos

Asegúrate de tener instaladas las siguientes herramientas:

| Requisito | Versión recomendada |
|------------|---------------------|
| Node.js | >= 18.x |
| npm | >= 9.x |
| Python | >= 3.10 |
| Git | Última versión |

---

## 🧰 Recomendaciones

- Verifica que los puertos **5173** (frontend) y **8000** (backend) estén libres.  
- Si utilizas **VS Code**, se recomienda instalar las extensiones:
  - 🌀 *Tailwind CSS IntelliSense*  
  - 🐍 *Python*  
- Usa un archivo `.env` si necesitas configurar variables de entorno personalizadas.

---

## 🧾 Scripts útiles

| Comando | Descripción |
|----------|--------------|
| `npm run dev` | Inicia el servidor de desarrollo de Vite |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Visualiza la build localmente |
| `uvicorn main:app --reload --port 8000` | Ejecuta el backend con recarga automática |

---

## 📚 Estructura del Proyecto

```
📦 proyecto/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   |___ main.py
│ ├── data/
│   └── (archivos descargados)
└── README.md
```

---

## ✨ Autor / Créditos

Proyecto desarrollado con ❤️ por [Tu Nombre o Equipo].
