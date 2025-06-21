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
    // Check authentication status
    fetch('/.auth/me')
      .then(response => {
        if (!response.ok) {
          throw new Error('Authentication check failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Auth response:', data);
        if (data.clientPrincipal && data.clientPrincipal.userId) {
          setIsAuthenticated(true);
          setUserInfo(data.clientPrincipal);
        } else {
          setIsAuthenticated(false);
          // Redirect to login if not authenticated
          window.location.href = '/.auth/login/github?post_login_redirect_uri=' + encodeURIComponent(window.location.pathname);
        }
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        // Only redirect if we're actually on the admin page
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/.auth/login/github?post_login_redirect_uri=' + encodeURIComponent(window.location.pathname);
        }
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Wymagana autoryzacja</h1>
          <p className="text-gray-600 mb-6">Musisz się zalogować, aby uzyskać dostęp do panelu administracyjnego.</p>
          <a
            href="/.auth/login/github?post_login_redirect_uri=/admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
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