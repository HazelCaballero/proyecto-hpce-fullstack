import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
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
        <Route path="/UserHogar" element={<UserHogar />} />
        <Route path="/UserPerfil" element={<UserPerfil />} />
        <Route path="/UserContactanos" element={<UserContactanos />} />
        <Route path="/UserMercado" element={<UserMercado />} />
        <Route path="/UserMuro" element={<UserMuro />} />
        
      </Routes>
    </Router>
  );
}

export default RountingCC;