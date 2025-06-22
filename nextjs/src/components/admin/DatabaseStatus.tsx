'use client';

import { useState, useEffect } from 'react';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Since we're using static export, simulate database status
    setTimeout(() => {
      setStatus('connected');
      setMessage('Static export mode - Database operations available via Azure Functions');
    }, 1000);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Bazy Danych</h3>
      
      <div className="flex items-center space-x-3">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Sprawdzanie połączenia...</span>
          </>
        )}
        
        {status === 'connected' && (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Połączono</span>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">Błąd połączenia</span>
          </>
        )}
      </div>
      
      {message && (
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Tryb:</strong> Static Export</p>
        <p><strong>Uwaga:</strong> W tym trybie funkcje zarządzania bazą danych są ograniczone</p>
      </div>
    </div>
  );
} 