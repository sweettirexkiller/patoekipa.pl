'use client';

import { useState, useEffect } from 'react';
import { ContactMessage } from '@/lib/database-schema';

export function ContactsManagement() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('new');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/contact' : `/api/contact?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const handleStatusChange = async (contact: ContactMessage, newStatus: ContactMessage['status']) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contact.id,
          status: newStatus,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setContacts(contacts.map(c => 
          c.id === contact.id ? { ...c, status: newStatus } : c
        ));
      } else {
        alert('Błąd podczas zmiany statusu: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas zmiany statusu');
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ContactMessage['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Zarządzanie kontaktami</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Wszystkie</option>
          <option value="new">Nowe</option>
          <option value="in_progress">W trakcie</option>
          <option value="completed">Zakończone</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </span>
                    {contact.urgency === 'high' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Pilne
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>📧 {contact.email}</span>
                    {contact.phone && <span>📞 {contact.phone}</span>}
                    {contact.company && <span>🏢 {contact.company}</span>}
                  </div>
                  
                  {contact.subject && (
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Temat: {contact.subject}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{contact.message}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      {new Date(contact.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                    {contact.projectType && <span>Typ: {contact.projectType}</span>}
                    {contact.budget && <span>Budżet: {contact.budget}</span>}
                    {contact.timeline && <span>Czas: {contact.timeline}</span>}
                    <span>Odpowiedzi: {contact.responseCount}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact, e.target.value as any)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="new">Nowy</option>
                    <option value="read">Przeczytany</option>
                    <option value="in_progress">W trakcie</option>
                    <option value="replied">Odpowiedziano</option>
                    <option value="completed">Zakończony</option>
                    <option value="archived">Zarchiwizowany</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 