'use client';

import { useState, useEffect } from 'react';
import './admin-styles.css';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { ProjectsManagement } from '@/components/admin/ProjectsManagement';
import { TestimonialsManagement } from '@/components/admin/TestimonialsManagement';
import { ContactsManagement } from '@/components/admin/ContactsManagement';
import { DatabaseStatus } from '@/components/admin/DatabaseStatus';
import AdminUsersManagement from '@/components/admin/AdminUsersManagement';

type AdminSection = 'dashboard' | 'team' | 'projects' | 'testimonials' | 'contacts' | 'database' | 'users';

interface AuthenticatedUser {
  githubUsername: string;
  githubUserId: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions?: {
    canManageUsers?: boolean;
    canManageProjects?: boolean;
    canManageTeam?: boolean;
    canManageTestimonials?: boolean;
    canManageContacts?: boolean;
  };
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGitHubAuthenticated, setIsGitHubAuthenticated] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check authentication status via our API
    const checkAuth = async () => {
      try {
        // First get the authentication data from Azure App Service
        const authResponse = await fetch('/.auth/me');
        
        // Check if the response is successful and has content
        if (!authResponse.ok) {
          setIsAuthenticated(false);
          setIsGitHubAuthenticated(false);
          return;
        }

        const responseText = await authResponse.text();
        if (!responseText.trim()) {
          setIsAuthenticated(false);
          setIsGitHubAuthenticated(false);
          return;
        }

        let authData;
        try {
          authData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse authentication response:', parseError);
          setIsAuthenticated(false);
          setIsGitHubAuthenticated(false);
          setAuthError('Błąd parsowania danych autoryzacji');
          return;
        }
                
        // Handle Azure App Service v2 format (array with user data)
        if (Array.isArray(authData) && authData.length > 0 && authData[0].user_id) {
          const userInfo = authData[0];
          
          // User is authenticated via GitHub
          setIsGitHubAuthenticated(true);
          
          // Find GitHub username from claims
          let username = 'Unknown User';
          if (userInfo.user_claims && Array.isArray(userInfo.user_claims)) {
            const loginClaim = userInfo.user_claims.find((claim: any) => claim.typ === 'urn:github:login');
            username = loginClaim?.val || userInfo.user_id;
          }
          
          const verifyResponse = await fetch('/api/admin-users/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              githubUsername: username,
              githubUserId: userInfo.user_id
            })
          });
                    
          if (verifyResponse.ok) {
            const userData = await verifyResponse.json();
            
            setCurrentUser({
              githubUsername: userData.githubUsername,
              githubUserId: userData.githubUserId,
              displayName: userData.displayName,
              role: userData.role,
              permissions: userData.permissions
            });
            setIsAuthenticated(true);
          } else if (verifyResponse.status === 401) {
            const errorData = await verifyResponse.json();
            setIsAuthenticated(false);
            setAuthError(`Użytkownik "${username}" nie ma uprawnień do panelu administracyjnego.`);
          } else {
            console.error('Verification failed:', verifyResponse.status);
            const errorData = await verifyResponse.text();
            console.error('Error response:', errorData);
            setIsAuthenticated(false);
            setAuthError('Błąd weryfikacji uprawnień administratora');
          }
        } else {
          setIsAuthenticated(false);
          setIsGitHubAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsGitHubAuthenticated(false);
        setAuthError('Błąd sprawdzania autoryzacji');
      }
    };
    
    checkAuth();
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
          
          {authError && isGitHubAuthenticated ? (
            // User is authenticated via GitHub but not authorized for admin access
            <>
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-600 mb-4 font-semibold">Brak uprawnień</p>
              <p className="text-gray-600 mb-6">{authError}</p>
              <p className="text-sm text-gray-500 mb-6">
                Jeśli uważasz, że powinieneś mieć dostęp do panelu administracyjnego, skontaktuj się z administratorem systemu.
              </p>
              <div className="space-y-3">
                <a
                  href="/.auth/logout"
                  className="block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Wyloguj się
                </a>
                <a
                  href="/"
                  className="block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Wróć do strony głównej
                </a>
              </div>
            </>
          ) : (
            // User is not authenticated at all
            <>
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
              {authError && !isGitHubAuthenticated && (
                <p className="text-red-500 text-sm mt-4">{authError}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  const navigation = [
    { id: 'dashboard' as AdminSection, name: 'Dashboard', icon: '📊' },
    ...(currentUser?.role === 'super_admin' ? [{ id: 'users' as AdminSection, name: 'Administratorzy', icon: '👤' }] : []),
    { id: 'team' as AdminSection, name: 'Zespół', icon: '👥' },
    { id: 'projects' as AdminSection, name: 'Projekty', icon: '🚀' },
    { id: 'testimonials' as AdminSection, name: 'Opinie', icon: '⭐' },
    { id: 'contacts' as AdminSection, name: 'Kontakty', icon: '📧' },
    { id: 'database' as AdminSection, name: 'Baza danych', icon: '��️' },
  ];

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="admin-desktop-header">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zalogowany jako:</h3>
              <p className="text-gray-600">{currentUser?.displayName} (@{currentUser?.githubUsername}) - {currentUser?.role}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
      case 'users':
        return <AdminUsersManagement currentUser={currentUser ? {
          githubUsername: currentUser.githubUsername,
          role: currentUser.role
        } : undefined} />;
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
      {/* Mobile header */}
      <div className="admin-mobile-header md:hidden">
        <h1>Admin Panel</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-button"
          aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchStart={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`admin-sidebar w-64 bg-white shadow-lg ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="p-6 admin-desktop-header">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Patoekipa</p>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
                  activeSection === item.id
                    ? 'active bg-blue-50 text-blue-700 border-r-2 border-blue-700'
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
              className="admin-logout-btn hover:text-red-800 text-sm font-medium"
            >
              Wyloguj się
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="admin-main-content flex-1 overflow-hidden">
          {/* Mobile section header */}
          <div className="mobile-section-header p-4 md:hidden">
            <h2 className="text-lg font-semibold">
              {navigation.find(item => item.id === activeSection)?.name}
            </h2>
          </div>
          
          <div className="h-full overflow-y-auto p-4 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 