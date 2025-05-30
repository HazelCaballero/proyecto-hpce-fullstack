import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import ProtectedRoute from './ProtectedRoute';
import AdminUsuarias from '../pages/AdminUsuarias';
import AdminTrueques from '../pages/AdminTrueques';
import AdminPublicaciones from '../pages/AdminPublicaciones';
import AdminContactos from '../pages/AdminContactos';
import UserInicio from '../pages/UserInicio';
import UserHogar from '../pages/UserHogar';
import UserPerfil from '../pages/UserPerfil';
import UserContactanos from '../pages/UserContactanos';
import UserMercado from '../pages/UserMercado';
import UserMuro from '../pages/UserMuro';



function RountingCC() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/AdminUsuarias" />} />
        
        <Route path="/AdminUsuarias" element={<AdminUsuarias />} />
        <Route path="/AdminTrueques" element={<AdminTrueques />} />
        <Route path="/AdminPublicaciones" element={<AdminPublicaciones />} />
        <Route path="/AdminContactos" element={<AdminContactos />} />
        <Route path="/UserInicio" element={<UserInicio />} />
        <Route path="/UserHogar" element={
          <ProtectedRoute>
            <UserHogar />
          </ProtectedRoute>
        } />
        <Route path="/UserPerfil" element={
          <ProtectedRoute>
            <UserPerfil />
          </ProtectedRoute>
        } />
        <Route path="/UserContactanos" element={
          <ProtectedRoute>
            <UserContactanos />
          </ProtectedRoute>
        } />
        <Route path="/UserMercado" element={
          <ProtectedRoute>
            <UserMercado />
          </ProtectedRoute>
        } />
        <Route path="/UserMuro" element={
          <ProtectedRoute>
            <UserMuro />
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default RountingCC;