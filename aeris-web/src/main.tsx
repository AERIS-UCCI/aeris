import React from 'react';
import ReactDOM from 'react-dom/client';

import "./i18n";
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Home from './routes/Inicio';
import Registro from './routes/Registro';
import Login from './routes/Login';
import Perfil from './routes/Pefil';
import Rutas from './routes/Rutas';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
    
  },

   {
    path: '/Registro',
    element: <Registro />,
  },

  {
    path: '/Login',
    element: <Login />,
  },

  {
    path: '/Perfil',
    element: <Perfil />,
  },

  {
    path: '/Rutas',
    element: <Rutas />,
  },
])


ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <RouterProvider router={router} />
    
  </React.StrictMode>,
  
)