'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/database-schema';
import { inputClassName, selectClassName, textareaClassName, buttonPrimaryClassName, buttonSecondaryClassName } from './AdminInputStyles';

interface TeamManagementProps {}

export function TeamManagement({}: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego członka zespołu?')) return;
    
    try {
      const response = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
      } else {
        alert('Błąd podczas usuwania: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas usuwania');
    }
  };

  const handleSave = async (memberData: Partial<TeamMember>) => {
    try {
      const method = editingMember ? 'PUT' : 'POST';
      const response = await fetch('/api/team', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTeamMembers();
        setShowForm(false);
        setEditingMember(null);
      } else {
        alert('Błąd podczas zapisywania: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas zapisywania');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setShowForm(true);
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
        <h2 className="text-2xl font-bold text-gray-900">Zarządzanie zespołem</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Dodaj członka zespołu
        </button>
      </div>

      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <li key={member.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {member.avatar ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={member.avatar}
                        alt={member.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {member.skills.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </span>
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface TeamMemberFormProps {
  member: TeamMember | null;
  onSave: (data: Partial<TeamMember>) => void;
  onCancel: () => void;
}

function TeamMemberForm({ member, onSave, onCancel }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    skills: member?.skills.join(', ') || '',
    avatar: member?.avatar || '',
    portfolioUrl: member?.portfolioUrl || '',
    github: member?.social?.github || '',
    linkedin: member?.social?.linkedin || '',
    twitter: member?.social?.twitter || '',
    website: member?.social?.website || '',
    location: member?.location || '',
    timezone: member?.timezone || '',
    yearsOfExperience: member?.yearsOfExperience || 0,
    isActive: member?.isActive !== undefined ? member.isActive : true,
    certifications: member?.certifications?.join(', ') || '',
    languages: member?.languages?.join(', ') || '',
    availability: member?.availability || 'available',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: Partial<TeamMember> = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
      languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
      social: {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        website: formData.website,
      },
    };

    if (member) {
      submitData.id = member.id;
    }

    onSave(submitData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {member ? 'Edytuj członka zespołu' : 'Dodaj członka zespołu'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Imię i nazwisko *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClassName}
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Stanowisko *
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio *
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Umiejętności (oddzielone przecinkami) *
            </label>
            <input
              type="text"
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, Node.js, Python..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              URL zdjęcia
            </label>
            <input
              type="url"
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700">
              GitHub
            </label>
            <input
              type="text"
              id="github"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn
            </label>
            <input
              type="text"
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Lata doświadczenia
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
              Dostępność
            </label>
            <select
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Dostępny</option>
              <option value="busy">Zajęty</option>
              <option value="unavailable">Niedostępny</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Aktywny członek zespołu
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {member ? 'Zapisz zmiany' : 'Dodaj członka'}
          </button>
        </div>
      </form>
    </div>
  );
} 