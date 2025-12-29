import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import PageContainer from '../../components/PageContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ErrorBlock from '../../components/ErrorBlock';
import EmptyState from '../../components/EmptyState';
import SEO from '../../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../../utils/seo';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const initialForm = {
  name: '',
  rating: 5,
  comment: '',
  approved: true,
};

const AdminTestimonials = () => {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canonical = absoluteUrl('/admin/testimonials');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadTestimonials = async () => {
    setLoading(true);
    const result = await getTestimonials();
    if (result.success) {
      setTestimonials(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les témoignages');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormState(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = {
      name: formState.name.trim(),
      rating: Number(formState.rating),
      comment: formState.comment.trim(),
      approved: formState.approved,
    };
    const action = editingId
      ? updateTestimonial(editingId, payload)
      : createTestimonial(payload);
    const result = await action;
    if (result.success) {
      showToast(
        editingId ? 'Témoignage mis à jour.' : 'Témoignage ajouté.',
        'success'
      );
      resetForm();
      loadTestimonials();
    } else {
      showToast(result.message || 'Impossible de sauvegarder le témoignage.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormState({
      name: testimonial.name || testimonial.user?.first_name || '',
      rating: testimonial.rating || 5,
      comment: testimonial.comment || '',
      approved: testimonial.approved ?? false,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    const result = await deleteTestimonial(id);
    if (result.success) {
      showToast('Témoignage supprimé.', 'success');
      if (editingId === id) resetForm();
      loadTestimonials();
    } else {
      showToast(result.message || 'Suppression impossible.', 'error');
    }
  };

  const toggleApproval = async (testimonial) => {
    const result = await updateTestimonial(testimonial._id, {
      approved: !testimonial.approved,
    });
    if (result.success) {
      showToast('Statut mis à jour.', 'success');
      loadTestimonials();
    } else {
      showToast(result.message || 'Impossible de modifier le statut.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des témoignages — BRIBECO"
        description="Modérez les retours clients et contrôlez leur publication."
        path="/admin/testimonials"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Testimonials
          </h1>
          <p className="text-lg text-gray-400">
            Ajoutez ou modérez les retours clients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Modifier le témoignage' : 'Nouveau témoignage'}
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nom (optionnel)
                </label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Note (1-5)
                </label>
                <select
                  name="rating"
                  value={formState.rating}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value} className="bg-gray-800">
                      {value} {value === 1 ? 'étoile' : 'étoiles'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Commentaire
                </label>
                <textarea
                  name="comment"
                  value={formState.comment}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 resize-none"
                  placeholder="Partagez le témoignage..."
                />
              </div>
              <label className="inline-flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="approved"
                  checked={formState.approved}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 transition-all"
                />
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                  Approuvé
                </span>
              </label>
              <div className="flex space-x-3 pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 justify-center py-3.5 font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 shadow-lg shadow-blue-500/25" 
                  isLoading={isSubmitting}
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 justify-center py-3.5 font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50"
                    onClick={resetForm}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* List Card */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Témoignages</h2>
            {loading && <Loader message="Chargement des témoignages..." />}
            {!loading && error && (
              <ErrorBlock message={error} onRetry={loadTestimonials} />
            )}
            {!loading && !error && testimonials.length === 0 && (
              <EmptyState
                icon="⭐"
                title="Aucun témoignage"
                description="Ajoutez des retours clients pour renforcer la crédibilité."
              />
            )}
            {!loading && !error && testimonials.length > 0 && (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial._id} 
                    className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-900/70 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-white mb-2 text-lg">
                          {testimonial.name ||
                            `${testimonial.user?.first_name || 'Client'} ${
                              testimonial.user?.last_name || ''
                            }`.trim()}
                        </p>
                        <p className="text-yellow-400 mb-2 text-base">
                          {'★'.repeat(testimonial.rating || 0)}
                        </p>
                        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-2">
                          {testimonial.comment}
                        </p>
                        <div className="flex items-center space-x-2">
                          {testimonial.approved ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300 border border-green-700/50">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Approuvé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-900/30 text-yellow-300 border border-yellow-700/50">
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              En attente
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4 mr-1.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => toggleApproval(testimonial)}
                          className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 ${
                            testimonial.approved
                              ? 'text-white bg-yellow-600/80 hover:bg-yellow-500 hover:shadow-yellow-500/25 focus:ring-yellow-500/50'
                              : 'text-white bg-green-600/80 hover:bg-green-500 hover:shadow-green-500/25 focus:ring-green-500/50'
                          }`}
                        >
                          {testimonial.approved ? (
                            <>
                              <XCircleIcon className="w-4 h-4 mr-1.5" />
                              Mettre en attente
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                              Approuver
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4 mr-1.5" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminTestimonials;
