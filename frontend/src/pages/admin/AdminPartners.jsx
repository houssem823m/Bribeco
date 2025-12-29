import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import PageContainer from '../../components/PageContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ErrorBlock from '../../components/ErrorBlock';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import SEO from '../../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../../utils/seo';
import { getAllPartners } from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, EyeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const AdminPartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // 'all', 'verified', 'unverified'

  const canonical = absoluteUrl('/admin/partners');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllPartners();
      if (result.success) {
        setPartners(result.data || []);
      } else {
        setError(result.message || 'Impossible de charger les partenaires');
      }
    } catch (err) {
      setError('Erreur lors du chargement des partenaires');
      console.error('Error loading partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // Filter partners based on search term and verification status
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      !searchTerm ||
      partner.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.service_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && partner.verified) ||
      (verifiedFilter === 'unverified' && !partner.verified);

    return matchesSearch && matchesVerified;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des Partenaires — BRIBECO"
        description="Consultez et gérez tous les partenaires de la plateforme."
        path="/admin/partners"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Gérer les Partenaires
          </h1>
          <p className="text-lg text-gray-400">
            Consultez toutes les informations des partenaires de la plateforme BRIBECO.
          </p>
        </div>

        {/* Filters Card */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-300 mb-2">Rechercher un partenaire</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou type de service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-96 pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'verified', 'unverified'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVerifiedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    verifiedFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'Tous' : filter === 'verified' ? 'Vérifiés' : 'Non vérifiés'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-2">{partners.length}</div>
              <div className="text-gray-300">Total Partenaires</div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {partners.filter((p) => p.verified).length}
              </div>
              <div className="text-gray-300">Partenaires Vérifiés</div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {partners.filter((p) => !p.verified).length}
              </div>
              <div className="text-gray-300">En Attente de Vérification</div>
            </Card>
          </div>
        )}

        {loading && <Loader message="Chargement des partenaires..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={loadPartners} />}
        {!loading && !error && filteredPartners.length === 0 && (
          <EmptyState
            icon="🤝"
            title="Aucun partenaire trouvé"
            description={
              searchTerm || verifiedFilter !== 'all'
                ? 'Aucun partenaire ne correspond à vos critères de recherche.'
                : 'Aucun partenaire n\'est enregistré sur la plateforme.'
            }
          />
        )}

        {!loading && !error && filteredPartners.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredPartners.map((partner) => (
              <Card key={partner._id} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Partner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {partner.user?.first_name} {partner.user?.last_name}
                        </h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          {partner.verified ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-700/50">
                              <CheckCircleIcon className="w-5 h-5 text-green-400" />
                              <span className="font-semibold text-green-300">Vérifié</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-900/30 border border-yellow-700/50">
                              <XCircleIcon className="w-5 h-5 text-yellow-400" />
                              <span className="font-semibold text-yellow-300">Non vérifié</span>
                            </div>
                          )}
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-900/30 text-blue-300 border border-blue-700/50">
                            {partner.service_type || 'Non spécifié'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-4">
                      {partner.user?.email && (
                        <div className="flex items-center gap-3">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                          <a
                            href={`mailto:${partner.user.email}`}
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                          >
                            {partner.user.email}
                          </a>
                        </div>
                      )}
                      {partner.user?.phone && (
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-5 h-5 text-gray-400" />
                          <a
                            href={`tel:${partner.user.phone}`}
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                          >
                            {partner.user.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {partner.createdAt && (
                        <div>
                          <p className="text-gray-400 mb-1">Date d'inscription</p>
                          <p className="text-gray-200">{formatDate(partner.createdAt)}</p>
                        </div>
                      )}
                      {partner.updatedAt && (
                        <div>
                          <p className="text-gray-400 mb-1">Dernière mise à jour</p>
                          <p className="text-gray-200">{formatDate(partner.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    <button
                      onClick={() => navigate(`/admin/partners/${partner._id}`)}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Voir les détails
                    </button>
                    <button
                      onClick={() => navigate(`/admin/partners/${partner._id}/missions`)}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-purple-600/80 hover:bg-purple-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                      Voir les missions
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && !error && filteredPartners.length > 0 && (
          <div className="mt-6 text-center text-gray-400">
            <p>
              {filteredPartners.length} partenaire(s) trouvé(s)
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminPartners;
