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
import { getCategories } from '../../api/services';
import { createCategory, updateCategory, deleteCategory } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

const initialFormState = {
  name: '',
  slug: '',
  description: '',
};

const AdminCategories = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const canonical = absoluteUrl('/admin/categories');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategories();
    if (result.success) {
      setCategories(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les catégories');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Helper function to generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Auto-generate slug when name changes (only if slug is empty or matches previous name)
    if (name === 'name' && (!formState.slug || formState.slug === generateSlug(formState.name))) {
      setFormState((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (name === 'slug') {
      // Format slug input: lowercase, replace spaces with hyphens, remove invalid chars
      const formattedSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormState((prev) => ({ ...prev, [name]: formattedSlug }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim(),
    };

    const action = editingId
      ? updateCategory(editingId, payload)
      : createCategory(payload);

    const result = await action;
    if (result.success) {
      showToast(
        editingId ? 'Catégorie mise à jour.' : 'Catégorie créée.',
        'success'
      );
      resetForm();
      loadCategories();
    } else {
      showToast(result.message || 'Une erreur est survenue.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormState({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    const result = await deleteCategory(id);
    if (result.success) {
      showToast('Catégorie supprimée.', 'success');
      if (editingId === id) {
        resetForm();
      }
      loadCategories();
    } else {
      showToast(result.message || 'Suppression impossible.', 'error');
    }
  };

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(lowerSearchTerm) ||
        category.slug?.toLowerCase().includes(lowerSearchTerm) ||
        category.description?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [categories, searchTerm]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des catégories — BRIBECO"
        description="Ajoutez, éditez et supprimez les catégories de services BRIBECO."
        path="/admin/categories"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Categories CRUD
          </h1>
          <p className="text-lg text-gray-400">
            Organisez les catégories proposées sur la plateforme.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label htmlFor="search-categories" className="block text-sm font-semibold text-gray-300 mb-2">
                Rechercher une catégorie
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search-categories"
                  type="text"
                  placeholder="Rechercher par nom, slug ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            {searchTerm && (
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-4">
                  {filteredCategories.length} résultat(s) trouvé(s)
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
                >
                  Effacer
                </button>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <Card className="lg:col-span-1 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Ex: Plomberie"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Slug
                </label>
                <input
                  name="slug"
                  value={formState.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Ex: plomberie-sanitaire"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Généré automatiquement depuis le nom. Format: minuscules, tirets uniquement.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 resize-none"
                  placeholder="Brève description..."
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

          {/* Table Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Catégories existantes</h2>
              {loading && <Loader message="Chargement des catégories..." />}
              {!loading && error && (
                <ErrorBlock message={error} onRetry={loadCategories} />
              )}
            {!loading && !error && filteredCategories.length === 0 && categories.length === 0 && (
              <EmptyState
                icon="📂"
                title="Aucune catégorie"
                description="Ajoutez votre première catégorie pour commencer."
              />
            )}
            {!loading && !error && filteredCategories.length === 0 && categories.length > 0 && (
              <EmptyState
                icon="🔍"
                title="Aucun résultat"
                description={`Aucune catégorie ne correspond à "${searchTerm}".`}
              />
            )}
            {!loading && !error && filteredCategories.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/30">
                    {filteredCategories.map((category, index) => (
                        <tr 
                          key={category._id} 
                          className="hover:bg-gray-700/30 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base font-semibold text-white">
                              {category.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400 font-mono">
                              {category.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300 max-w-md truncate">
                              {category.description || <span className="text-gray-500 italic">—</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                title="Modifier"
                              >
                                <PencilIcon className="w-4 h-4 mr-1.5" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                title="Supprimer"
                              >
                                <TrashIcon className="w-4 h-4 mr-1.5" />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminCategories;
