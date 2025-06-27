'use client';

import { useState, useEffect } from 'react';
import './admin-styles.css';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { ProjectsManagement } from '@/components/admin/ProjectsManagement';
import { TestimonialsManagement } from '@/components/admin/TestimonialsManagement';
import { ContactsManagement } from '@/components/admin/ContactsManagement';
import { DatabaseStatus } from '@/components/admin/DatabaseStatus';

type AdminSection = 'dashboard' | 'team' | 'projects' | 'testimonials' | 'contacts' | 'database';

interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<ClientPrincipal | null>(null);

  useEffect(() => {
    // Check if we're already authenticated
    fetch('/.auth/me')
      .then(response => response.json())
      .then(data => {
        console.log('Auth response:', data);
        console.log('Auth response type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        // Handle case where response is a string that needs to be parsed
        let parsedData = data;
        if (typeof data === 'string') {
          console.log('Response is string, parsing...');
          try {
            parsedData = JSON.parse(data);
            console.log('Parsed data:', parsedData);
          } catch (e) {
            console.error('Failed to parse JSON string:', e);
            setIsAuthenticated(false);
            return;
          }
        }
        
        // Handle Azure App Service v2 format (array with user data)
        if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].user_id) {
          const userInfo = parsedData[0];
          console.log('User info from array:', userInfo);
          console.log('User claims:', userInfo.user_claims);
          
          // Find GitHub username from claims
          let username = 'Unknown User';
          if (userInfo.user_claims && Array.isArray(userInfo.user_claims)) {
            const loginClaim = userInfo.user_claims.find((claim: any) => claim.typ === 'urn:github:login');
            console.log('Login claim:', loginClaim);
            username = loginClaim?.val || userInfo.user_id;
          }
          
          console.log('Extracted username:', username);
          
          // Convert to expected ClientPrincipal format
          const clientPrincipal: ClientPrincipal = {
            identityProvider: userInfo.provider_name || 'github',
            userId: userInfo.user_id,
            userDetails: username,
            userRoles: ['authenticated']
          };
          
          console.log('Created clientPrincipal:', clientPrincipal);
          
          setIsAuthenticated(true);
          setUserInfo(clientPrincipal);
        }
        // Handle legacy format (if it exists)
        else if (parsedData.clientPrincipal && parsedData.clientPrincipal.userId) {
          console.log('Using legacy clientPrincipal format');
          setIsAuthenticated(true);
          setUserInfo(parsedData.clientPrincipal);
        } else {
          console.log('No authentication found, parsedData:', parsedData);
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
      });
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panel Administracyjny</h1>
          <p className="text-gray-600 mb-6">Musisz się zalogować przez GitHub, aby uzyskać dostęp do panelu administracyjnego.</p>
          <a
            href="/.auth/login/github?post_login_redirect_uri=/admin"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Zaloguj się przez GitHub
          </a>
        </div>
      </div>
    );
  }

  const navigation = [
    { id: 'dashboard' as AdminSection, name: 'Dashboard', icon: '📊' },
    { id: 'team' as AdminSection, name: 'Zespół', icon: '👥' },
    { id: 'projects' as AdminSection, name: 'Projekty', icon: '🚀' },
    { id: 'testimonials' as AdminSection, name: 'Opinie', icon: '⭐' },
    { id: 'contacts' as AdminSection, name: 'Kontakty', icon: '📧' },
    { id: 'database' as AdminSection, name: 'Baza danych', icon: '🗄️' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zalogowany jako:</h3>
              <p className="text-gray-600">{userInfo?.userDetails} ({userInfo?.identityProvider})</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Członkowie zespołu</p>
                    <p className="text-2xl font-semibold text-gray-900">4</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Projekty</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Opinie</p>
                    <p className="text-2xl font-semibold text-gray-900">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Nowe kontakty</p>
                    <p className="text-2xl font-semibold text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </div>
            <DatabaseStatus />
          </div>
        );
      case 'team':
        return <TeamManagement />;
      case 'projects':
        return <ProjectsManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'contacts':
        return <ContactsManagement />;
      case 'database':
        return <DatabaseStatus />;
      default:
        return <div>Wybierz sekcję z menu</div>;
    }
  };

  return (
    <div className="admin-panel min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Patoekipa</p>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-6 left-6">
            <a
              href="/.auth/logout"
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Wyloguj się
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 