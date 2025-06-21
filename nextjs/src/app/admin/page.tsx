'use client';

import { useState } from 'react';
import './admin-styles.css';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { ProjectsManagement } from '@/components/admin/ProjectsManagement';
import { TestimonialsManagement } from '@/components/admin/TestimonialsManagement';
import { ContactsManagement } from '@/components/admin/ContactsManagement';
import { DatabaseStatus } from '@/components/admin/DatabaseStatus';

type AdminSection = 'dashboard' | 'team' | 'projects' | 'testimonials' | 'contacts' | 'database';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

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