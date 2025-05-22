import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import AdminUsuarias from '../pages/AdminUsuarias';
import UserInicio from '../pages/UserInicio';

function RountingCC() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/AdminUsuarias" />} />
        
        <Route path="/AdminUsuarias" element={<AdminUsuarias />} />
        <Route path="/UserInicio" element={<UserInicio />} />
        
      </Routes>
    </Router>
  );
}

export default RountingCC;