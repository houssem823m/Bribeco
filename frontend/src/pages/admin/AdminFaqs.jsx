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
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const initialForm = {
  question: '',
  answer: '',
};

const AdminFaqs = () => {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canonical = absoluteUrl('/admin/faqs');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadFaqs = async () => {
    setLoading(true);
    const result = await getFaqs();
    if (result.success) {
      setFaqs(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les FAQs');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
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
      question: formState.question.trim(),
      answer: formState.answer.trim(),
    };
    const action = editingId ? updateFaq(editingId, payload) : createFaq(payload);
    const result = await action;
    if (result.success) {
      showToast(
        editingId ? 'FAQ mise à jour.' : 'FAQ ajoutée.',
        'success'
      );
      resetForm();
      loadFaqs();
    } else {
      showToast(result.message || 'Impossible de sauvegarder la FAQ.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormState({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    const result = await deleteFaq(id);
    if (result.success) {
      showToast('FAQ supprimée.', 'success');
      if (editingId === id) resetForm();
      loadFaqs();
    } else {
      showToast(result.message || 'Suppression impossible.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des FAQs — BRIBECO"
        description="Ajoutez des questions-réponses pour informer vos utilisateurs."
        path="/admin/faqs"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            FAQ
          </h1>
          <p className="text-lg text-gray-400">
            Maintenez la base de connaissances pour les clients et partenaires.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Modifier la FAQ' : 'Nouvelle FAQ'}
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Question
                </label>
                <input
                  name="question"
                  value={formState.question}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Ex: Comment fonctionne le service BRIBECO ?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Réponse
                </label>
                <textarea
                  name="answer"
                  value={formState.answer}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
                  placeholder="Décrivez la réponse..."
                />
              </div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Questions existantes</h2>
            {loading && <Loader message="Chargement des FAQs..." />}
            {!loading && error && <ErrorBlock message={error} onRetry={loadFaqs} />}
            {!loading && !error && faqs.length === 0 && (
              <EmptyState
                icon="❓"
                title="Aucune question"
                description="Ajoutez votre première FAQ pour guider vos utilisateurs."
              />
            )}
            {!loading && !error && faqs.length > 0 && (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div 
                    key={faq._id} 
                    className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-900/70 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-white mb-2 text-lg">{faq.question}</p>
                        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4 mr-1.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
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

export default AdminFaqs;
