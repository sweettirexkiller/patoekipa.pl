'use client';

import { useState, useEffect } from 'react';

interface DatabaseStatusData {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data?action=test');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        error: 'Failed to connect to database'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Status bazy danych</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sprawdzanie...' : 'Odśwież'}
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Sprawdzanie połączenia...</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status?.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`font-medium ${
              status?.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {status?.success ? 'Połączono' : 'Błąd połączenia'}
            </span>
          </div>
          
          {status?.message && (
            <p className="text-sm text-gray-600">{status.message}</p>
          )}
          
          {status?.error && (
            <p className="text-sm text-red-600">{status.error}</p>
          )}
          
          {status?.data && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Informacje o bazie:</p>
              <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                {JSON.stringify(status.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 