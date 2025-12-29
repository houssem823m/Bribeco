import { useEffect, useState, useMemo } from 'react';
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
import { getServiceRequests, getAllPartners } from '../../api/admin';
import { updateReservationStatus, assignPartnerToReservation } from '../../api/reservations';
import { useToast } from '../../context/ToastContext';
import { UserPlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const STATUS_OPTIONS = ['all', 'nouvelle', 'confirmée', 'en cours', 'terminée', 'annulée'];

const AdminServiceRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const canonical = absoluteUrl('/admin/service-requests');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadRequests = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (onlyUrgent) params.urgent = true;

    const result = await getServiceRequests(params);
    if (result.success) {
      setRequests(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les demandes de service');
    }
    setLoading(false);
  };

  const loadPartners = async () => {
    const result = await getAllPartners();
    if (result.success) {
      setPartners(result.data || []);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, onlyUrgent]);

  const handleStatusChange = async (reservationId, nextStatus) => {
    setUpdatingId(reservationId);
    const result = await updateReservationStatus(reservationId, nextStatus);
    if (result.success) {
      showToast('Statut mis à jour.', 'success');
      loadRequests();
    } else {
      showToast(result.message || 'Impossible de mettre à jour le statut.', 'error');
    }
    setUpdatingId(null);
  };

  const handleAssignPartner = async (reservationId, partnerId) => {
    setAssigningId(reservationId);
    const result = await assignPartnerToReservation(reservationId, partnerId);
    if (result.success) {
      showToast('Partenaire assigné avec succès.', 'success');
      loadRequests();
      setShowAssignModal(null);
    } else {
      showToast(result.message || 'Impossible d\'assigner le partenaire.', 'error');
    }
    setAssigningId(null);
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
        request.service?.title?.toLowerCase().includes(lowerSearchTerm) ||
        request.service?.category?.name?.toLowerCase().includes(lowerSearchTerm) ||
        request.address?.toLowerCase().includes(lowerSearchTerm) ||
        request.status?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [requests, searchTerm]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Demandes de service — BRIBECO"
        description="Suivez et traitez les réservations clients."
        path="/admin/service-requests"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <div className="max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] mx-auto px-6 lg:px-12 py-section">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Reservations
          </h1>
          <p className="text-lg text-gray-400">
            Surveillez l'ensemble des réservations clients et mettez à jour leur statut.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label htmlFor="search-requests" className="block text-sm font-semibold text-gray-300 mb-2">
                Rechercher une réservation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search-requests"
                  type="text"
                  placeholder="Rechercher par client, service, adresse ou statut..."
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-1">Filtres</p>
              <p className="text-xs text-gray-400">
                Choisissez un statut ou affichez uniquement les demandes urgentes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'Tous' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setOnlyUrgent((prev) => !prev)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  onlyUrgent
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {onlyUrgent ? 'Urgentes ✓' : 'Urgentes'}
              </button>
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          {loading && <Loader message="Chargement des demandes..." />}
          {!loading && error && <ErrorBlock message={error} onRetry={loadRequests} />}
          {!loading && !error && filteredRequests.length === 0 && requests.length === 0 && (
            <EmptyState
              icon="📋"
              title="Aucune demande"
              description="Aucune réservation ne correspond à vos filtres."
            />
          )}
          {!loading && !error && filteredRequests.length === 0 && requests.length > 0 && (
            <EmptyState
              icon="🔍"
              title="Aucun résultat"
              description={`Aucune réservation ne correspond à "${searchTerm}".`}
            />
          )}
          {!loading && !error && filteredRequests.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Urgent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Partenaire
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Créée le
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/30">
                    {filteredRequests.map((request) => (
                    <tr 
                      key={request._id} 
                      className="hover:bg-gray-700/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {request.user?.first_name} {request.user?.last_name}
                          </p>
                          <p className="text-sm text-gray-400">{request.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-base font-semibold text-white">{request.service?.title}</p>
                          <p className="text-sm text-gray-400">
                            {request.service?.category?.name || ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} type="reservation" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.urgent ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-900/30 text-red-300 border border-red-700/50">
                            Oui
                          </span>
                        ) : (
                          <span className="text-gray-400">Non</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {request.assigned_partner ? (
                          <div>
                            <p className="text-base font-semibold text-white">
                              {request.assigned_partner.user?.first_name} {request.assigned_partner.user?.last_name}
                            </p>
                            <p className="text-sm text-gray-400">{request.assigned_partner.user?.email}</p>
                            {request.partner_status && (
                              <div className="mt-1">
                                <StatusBadge status={request.partner_status} type="assignment" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(request.createdAt).toLocaleString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.filter((status) => status !== 'all').map((status) => (
                              <button
                                key={status}
                                disabled={updatingId === request._id}
                                onClick={() => handleStatusChange(request._id, status)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                  request.status === status
                                    ? 'bg-green-600/80 text-white shadow-lg shadow-green-500/25'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                          <button
                            disabled={assigningId === request._id || request.status === 'annulée' || request.status === 'terminée'}
                            onClick={() => setShowAssignModal(request._id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserPlusIcon className="w-3 h-3 mr-1.5" />
                            {request.assigned_partner ? 'Réassigner' : 'Assigner'} un partenaire
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

        {/* Assign Partner Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full bg-gray-800 border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Assigner un partenaire</h3>
                <button
                  onClick={() => setShowAssignModal(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              {partners.length === 0 ? (
                <p className="text-gray-400 mb-4">Aucun partenaire disponible.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {partners.map((partner) => (
                    <button
                      key={partner._id}
                      onClick={() => handleAssignPartner(showAssignModal, partner._id)}
                      disabled={assigningId === showAssignModal}
                      className="w-full text-left p-4 border-2 border-gray-700 rounded-xl hover:border-blue-500/50 hover:bg-gray-700/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <p className="font-semibold text-white">
                        {partner.user?.first_name} {partner.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-400">{partner.user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Service: {partner.service_type} {partner.verified && '✓ Vérifié'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowAssignModal(null)}
                  disabled={assigningId === showAssignModal}
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  Annuler
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminServiceRequests;
