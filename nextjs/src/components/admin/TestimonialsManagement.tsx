'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/lib/database-schema';

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials?approved=false');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę opinię?')) return;
    
    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      } else {
        alert('Błąd podczas usuwania: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas usuwania');
    }
  };

  const handleSave = async (testimonialData: Partial<Testimonial>) => {
    try {
      const method = editingTestimonial ? 'PUT' : 'POST';
      const response = await fetch('/api/testimonials', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        setShowForm(false);
        setEditingTestimonial(null);
      } else {
        alert('Błąd podczas zapisywania: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas zapisywania');
    }
  };

  const handleApprove = async (testimonial: Testimonial) => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: testimonial.id,
          approved: true,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTestimonials(testimonials.map(t => 
          t.id === testimonial.id ? { ...t, approved: true } : t
        ));
      } else {
        alert('Błąd podczas zatwierdzania: ' + data.error);
      }
    } catch (error) {
      alert('Błąd podczas zatwierdzania');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
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
        <h2 className="text-2xl font-bold text-gray-900">Zarządzanie opiniami</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Dodaj opinię
        </button>
      </div>

      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTestimonial(null);
          }}
        />
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xl">{testimonial.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{testimonial.name}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.company}</p>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">{testimonial.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {new Date(testimonial.testimonialDate).toLocaleDateString('pl-PL')}
                      </span>
                      <span>Język: {testimonial.language}</span>
                      <span>Źródło: {testimonial.source}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      {testimonial.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Wyróżniona
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        testimonial.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testimonial.approved ? 'Zatwierdzona' : 'Oczekuje'}
                      </span>
                      {testimonial.verified && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Zweryfikowana
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!testimonial.approved && (
                        <button
                          onClick={() => handleApprove(testimonial)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Zatwierdź
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => void;
  onCancel: () => void;
}

function TestimonialForm({ testimonial, onSave, onCancel }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    avatar: testimonial?.avatar || '👤',
    featured: testimonial?.featured || false,
    approved: testimonial?.approved || false,
    verified: testimonial?.verified || false,
    language: testimonial?.language || 'pl',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: Partial<Testimonial> = {
      ...formData,
    };

    if (testimonial) {
      submitData.id = testimonial.id;
    }

    onSave(submitData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {testimonial ? 'Edytuj opinię' : 'Dodaj opinię'}
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Firma *
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Ocena (1-5) *
            </label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} ⭐</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Treść opinii *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar (emoji)
            </label>
            <input
              type="text"
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="👤"
            />
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Język
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pl">Polski</option>
              <option value="en">Angielski</option>
            </select>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                checked={formData.approved}
                onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="approved" className="ml-2 block text-sm text-gray-900">
                Zatwierdzona
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Wyróżniona
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                Zweryfikowana
              </label>
            </div>
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
            {testimonial ? 'Zapisz zmiany' : 'Dodaj opinię'}
          </button>
        </div>
      </form>
    </div>
  );
} 