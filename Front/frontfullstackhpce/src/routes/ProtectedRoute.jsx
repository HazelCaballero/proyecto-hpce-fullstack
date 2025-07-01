import React from 'react';
import { Navigate } from 'react-router-dom';


/*
  Componente de ruta protegida.
 
  Si no hay token de acceso en localStorage, redirige a /UserInicio.
  Si hay token, renderiza los hijos (children).
 
  Uso:
  <ProtectedRoute>
    <ComponenteProtegido />
  </ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access');
  if (!token) {
    // Si no hay token, redirige a la página de inicio de usuaria
    return <Navigate to="/UserInicio" replace />;
  }
  // Si hay token, renderiza el contenido protegido
  return children;
}
