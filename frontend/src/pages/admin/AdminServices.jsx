import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import PageContainer from '../../components/PageContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ErrorBlock from '../../components/ErrorBlock';
import EmptyState from '../../components/EmptyState';
import SEO from '../../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../../utils/seo';
import { getServices, getCategories } from '../../api/services';
import { createService, updateService, deleteService } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const initialFormState = {
  title: '',
  categoryId: '',
  price_range: '',
  description: '',
  includes: '',
  images: '',
};

const AdminServices = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const canonical = absoluteUrl('/admin/services');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadData = async () => {
    setLoading(true);
    const [servicesResult, categoriesResult] = await Promise.all([
      getServices(),
      getCategories(),
    ]);

    if (!servicesResult.success) {
      setError(servicesResult.message || 'Impossible de charger les services');
    } else if (!categoriesResult.success) {
      setError(categoriesResult.message || 'Impossible de charger les catégories');
    } else {
      setServices(servicesResult.data || []);
      setCategories(categoriesResult.data || []);
      if (!editingId && (categoriesResult.data || []).length > 0) {
        setFormState((prev) => ({
          ...prev,
          categoryId: categoriesResult.data[0]._id,
        }));
      }
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentCategoryOptions = useMemo(
    () => categories.map((cat) => ({ label: cat.name, value: cat._id })),
    [categories]
  );

  // Filter services based on search term
  const filteredServices = useMemo(() => {
    if (!searchTerm) return services;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return services.filter(
      (service) =>
        service.title?.toLowerCase().includes(lowerSearchTerm) ||
        service.description?.toLowerCase().includes(lowerSearchTerm) ||
        service.price_range?.toLowerCase().includes(lowerSearchTerm) ||
        service.category?.name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [services, searchTerm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState((prev) => ({
      ...initialFormState,
      categoryId: currentCategoryOptions[0]?.value || '',
    }));
    setEditingId(null);
  };

  const buildPayload = () => {
    const includes = formState.includes
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    const images = formState.images
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      title: formState.title.trim(),
      categoryId: formState.categoryId,
      price_range: formState.price_range.trim(),
      description: formState.description.trim(),
      includes,
      images,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = buildPayload();

    const action = editingId
      ? updateService(editingId, payload)
      : createService(payload);

    const result = await action;
    if (result.success) {
      showToast(
        editingId ? 'Service mis à jour.' : 'Service créé avec succès.',
        'success'
      );
      resetForm();
      loadData();
    } else {
      showToast(result.message || 'Impossible de sauvegarder le service.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormState({
      title: service.title,
      categoryId: service.category?._id || service.category,
      price_range: service.price_range || '',
      description: service.description || '',
      includes: (service.includes || []).join('\n'),
      images: (service.images || []).join('\n'),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    const result = await deleteService(id);
    if (result.success) {
      showToast('Service supprimé.', 'success');
      if (editingId === id) {
        resetForm();
      }
      loadData();
    } else {
      showToast(result.message || 'Suppression impossible.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des services — BRIBECO"
        description="Ajoutez ou modifiez les services proposés aux clients."
        path="/admin/services"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Services CRUD
          </h1>
          <p className="text-lg text-gray-400">
            Créez et maintenez l'offre de services BRIBECO.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label htmlFor="search-services" className="block text-sm font-semibold text-gray-300 mb-2">
                Rechercher un service
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search-services"
                  type="text"
                  placeholder="Rechercher par titre, description, prix ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            {searchTerm && (
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-4">
                  {filteredServices.length} résultat(s) trouvé(s)
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Card */}
          <Card className="xl:col-span-1 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Modifier le service' : 'Nouveau service'}
            </h2>
            {!currentCategoryOptions.length && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-xl">
                <p className="text-sm text-red-300">
                  Créez d'abord au moins une catégorie pour pouvoir ajouter des services.
                </p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Titre
                </label>
                <input
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ex: Réparation de fuite"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  name="categoryId"
                  value={formState.categoryId}
                  onChange={handleChange}
                  required
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Fourchette de prix
                </label>
                <input
                  name="price_range"
                  value={formState.price_range}
                  onChange={handleChange}
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ex: 80€ - 150€"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows={3}
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Décrivez le service..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Inclusions (une par ligne)
                </label>
                <textarea
                  name="includes"
                  value={formState.includes}
                  onChange={handleChange}
                  rows={3}
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                  placeholder={'Diagnostic complet\nRéparation\nGarantie...'}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Images (URL, une par ligne)
                </label>
                <textarea
                  name="images"
                  value={formState.images}
                  onChange={handleChange}
                  rows={3}
                  disabled={!currentCategoryOptions.length}
                  className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                  placeholder={'https://exemple.com/img1.jpg\nhttps://exemple.com/img2.jpg'}
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 justify-center py-3.5 font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 shadow-lg shadow-blue-500/25"
                  isLoading={isSubmitting}
                  disabled={!currentCategoryOptions.length}
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
          <Card className="xl:col-span-2 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Services existants</h2>
            {loading && <Loader message="Chargement des services..." />}
            {!loading && error && <ErrorBlock message={error} onRetry={loadData} />}
            {!loading && !error && filteredServices.length === 0 && services.length === 0 && (
              <EmptyState
                icon="🔧"
                title="Aucun service"
                description="Ajoutez un premier service pour alimenter le catalogue."
              />
            )}
            {!loading && !error && filteredServices.length === 0 && services.length > 0 && (
              <EmptyState
                icon="🔍"
                title="Aucun résultat"
                description={`Aucun service ne correspond à "${searchTerm}".`}
              />
            )}
            {!loading && !error && filteredServices.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Modifié
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/30">
                    {filteredServices.map((service) => (
                      <tr 
                        key={service._id} 
                        className="hover:bg-gray-700/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-semibold text-white">
                            {service.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {service.category?.name || <span className="text-gray-500 italic">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {service.price_range || <span className="text-gray-500 italic">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {service.updatedAt
                              ? new Date(service.updatedAt).toLocaleDateString('fr-FR')
                              : <span className="text-gray-500 italic">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              title="Modifier"
                            >
                              <PencilIcon className="w-4 h-4 mr-1.5" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
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
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminServices;
