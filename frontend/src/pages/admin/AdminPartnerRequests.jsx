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
import {
  getPartnerRequests,
  acceptPartnerRequest,
  rejectPartnerRequest,
} from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

const AdminPartnerRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('en attente');
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const canonical = absoluteUrl('/admin/partner-requests');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadRequests = async () => {
    setLoading(true);
    const result = await getPartnerRequests(filter !== 'all' ? filter : undefined);
    if (result.success) {
      setRequests(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les demandes partenaires');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDecision = async (id, action) => {
    setProcessingId(id);
    const result =
      action === 'accept'
        ? await acceptPartnerRequest(id)
        : await rejectPartnerRequest(id);
    if (result.success) {
      showToast(
        action === 'accept'
          ? 'Demande acceptée. Le partenaire a été créé.'
          : 'Demande refusée.',
        'success'
      );
      loadRequests();
    } else {
      showToast(result.message || 'Action impossible.', 'error');
    }
    setProcessingId(null);
  };

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    if (!searchTerm) return requests;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return requests.filter(
      (request) =>
        request.user?.first_name?.toLowerCase().includes(lowerSearchTerm) ||
        request.user?.last_name?.toLowerCase().includes(lowerSearchTerm) ||
        request.user?.email?.toLowerCase().includes(lowerSearchTerm) ||
        request.service_type?.toLowerCase().includes(lowerSearchTerm) ||
        request.message?.toLowerCase().includes(lowerSearchTerm) ||
        request.status?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [requests, searchTerm]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Demandes partenaires — BRIBECO"
        description="Examinez et traitez les demandes de partenariat reçues."
        path="/admin/partner-requests"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Partner Requests
          </h1>
          <p className="text-lg text-gray-400">
            Validez ou refusez les demandes transmises par les utilisateurs.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label htmlFor="search-partner-requests" className="block text-sm font-semibold text-gray-300 mb-2">
                Rechercher une demande de partenariat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search-partner-requests"
                  type="text"
                  placeholder="Rechercher par nom, email, type de service ou message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            {searchTerm && (
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-4">
                  {filteredRequests.length} résultat(s) trouvé(s)
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

        {/* Filters Card */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-1">Filtrer par statut</p>
              <p className="text-xs text-gray-400">
                Affichez seulement les demandes selon leur état.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['en attente', 'acceptée', 'refusée', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'Toutes' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Requests List */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          {loading && <Loader message="Chargement des demandes..." />}
          {!loading && error && <ErrorBlock message={error} onRetry={loadRequests} />}
          {!loading && !error && filteredRequests.length === 0 && requests.length === 0 && (
            <EmptyState
              icon="🤝"
              title="Aucune demande"
              description="Aucune demande de partenariat pour le moment."
            />
          )}
          {!loading && !error && filteredRequests.length === 0 && requests.length > 0 && (
            <EmptyState
              icon="🔍"
              title="Aucun résultat"
              description={`Aucune demande ne correspond à "${searchTerm}".`}
            />
          )}
          {!loading && !error && filteredRequests.length > 0 && (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-900/70 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-lg font-bold text-white mb-1">
                          {request.user?.first_name} {request.user?.last_name}
                        </p>
                        <p className="text-sm text-gray-400">{request.user?.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Service:</span>
                          <span className="text-gray-300 ml-2 font-semibold">{request.service_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Expérience:</span>
                          <span className="text-gray-300 ml-2 font-semibold">{request.experience_years} ans</span>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                            {request.message}
                          </p>
                        </div>
                      )}
                      <div className="mt-2">
                        <StatusBadge status={request.status} type="partner" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
                      {request.status === 'en attente' ? (
                        <>
                          <button
                            disabled={processingId === request._id}
                            onClick={() => handleDecision(request._id, 'accept')}
                            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-green-600/80 hover:bg-green-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Accepter
                          </button>
                          <button
                            disabled={processingId === request._id}
                            onClick={() => handleDecision(request._id, 'reject')}
                            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Refuser
                          </button>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">
                          Dernière mise à jour:{' '}
                          <span className="text-gray-300">
                            {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminPartnerRequests;
