import React from 'react'
import "../styles/Scomponents/Header.css";

export default function HeaderAdmin({titulo=""}) {
  return (
    <div className="header-admin">
        <h1>{titulo}</h1>
    </div>
  )
}

