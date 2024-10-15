import React, { useEffect, useState } from 'react';

const StatusBar = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose(); // Fechar a barra de status após 4 segundos
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 p-2 rounded shadow-lg transition-opacity duration-500 
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
      ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <p className="text-white">{message}</p>
    </div>
  );
};

export default StatusBar;
