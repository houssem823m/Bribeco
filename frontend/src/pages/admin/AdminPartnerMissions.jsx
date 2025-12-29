import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { getPartnerById, getPartnerAssignments } from '../../api/admin';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminPartnerMissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canonical = absoluteUrl(`/admin/partners/${id}/missions`);
  const alternateLocales = buildAlternateLocales(canonical);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [partnerResult, assignmentsResult] = await Promise.all([
          getPartnerById(id),
          getPartnerAssignments(id),
        ]);

        if (partnerResult.success) {
          setPartner(partnerResult.data);
        } else {
          setError(partnerResult.message || 'Partenaire introuvable');
          return;
        }

        if (assignmentsResult.success) {
          setAssignments(assignmentsResult.data || []);
        } else {
          console.error('Error loading assignments:', assignmentsResult.message);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: assignments.length,
    envoyée: assignments.filter((a) => a.status === 'envoyée').length,
    acceptée: assignments.filter((a) => a.status === 'acceptée').length,
    refusée: assignments.filter((a) => a.status === 'refusée').length,
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title={`Missions de ${partner?.user?.first_name || 'Partenaire'} ${partner?.user?.last_name || ''} — BRIBECO Admin`}
        description="Missions assignées au partenaire"
        path={`/admin/partners/${id}/missions`}
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        <button
          onClick={() => navigate(`/admin/partners/${id}`)}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour aux détails du partenaire
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            View missions
          </h1>
          <p className="text-lg text-gray-400">
            Toutes les missions assignées à {partner?.user?.first_name || 'ce partenaire'}
          </p>
        </div>

        {loading && <Loader message="Chargement des missions..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={() => window.location.reload()} />}

        {!loading && !error && partner && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-white mb-2">{stats.total}</div>
                <div className="text-gray-300">Total Missions</div>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.envoyée}</div>
                <div className="text-gray-300">En Attente</div>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-green-400 mb-2">{stats.acceptée}</div>
                <div className="text-gray-300">Acceptées</div>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-red-400 mb-2">{stats.refusée}</div>
                <div className="text-gray-300">Refusées</div>
              </Card>
            </div>

            {/* Assignments List */}
            {assignments.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Aucune mission"
                description="Ce partenaire n'a pas encore de missions assignées."
              />
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <Card key={assignment._id} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {assignment.reservation?.service?.title || 'Service'}
                            </h3>
                            {assignment.reservation?.service?.category && (
                              <p className="text-gray-400 mb-2">
                                Catégorie: {assignment.reservation.service.category.name}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={assignment.status} type="assignment" />
                        </div>

                        {/* Client Info */}
                        {assignment.reservation?.user && (
                          <div className="mb-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <UserIcon className="w-5 h-5 text-gray-400" />
                              <span className="font-semibold text-white">Client</span>
                            </div>
                            <p className="text-gray-200">
                              {assignment.reservation.user.first_name} {assignment.reservation.user.last_name}
                            </p>
                            <p className="text-sm text-gray-400">{assignment.reservation.user.email}</p>
                            {assignment.reservation.user.phone && (
                              <p className="text-sm text-gray-400">{assignment.reservation.user.phone}</p>
                            )}
                          </div>
                        )}

                        {/* Reservation Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {assignment.reservation?.address && (
                            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                              <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Adresse</p>
                                <p className="text-gray-200">{assignment.reservation.address}</p>
                                {assignment.reservation.postal_code && (
                                  <p className="text-gray-200">{assignment.reservation.postal_code}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {assignment.reservation?.date_requested && (
                            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                              <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Date souhaitée</p>
                                <p className="text-gray-200">
                                  {formatDate(assignment.reservation.date_requested)}
                                  {assignment.reservation.time_slot && ` - ${assignment.reservation.time_slot}`}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {assignment.reservation?.description && (
                          <div className="mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <p className="text-sm text-gray-400 mb-1">Description</p>
                            <p className="text-gray-200">{assignment.reservation.description}</p>
                          </div>
                        )}

                        {/* Dates */}
                        <div className="text-sm text-gray-400">
                          <p>Mission créée le: <span className="text-gray-300">{formatDateTime(assignment.createdAt)}</span></p>
                          {assignment.updatedAt && assignment.updatedAt !== assignment.createdAt && (
                            <p>Dernière mise à jour: <span className="text-gray-300">{formatDateTime(assignment.updatedAt)}</span></p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:min-w-[200px]">
                        {assignment.reservation?._id && (
                          <Link
                            to={`/reservations/${assignment.reservation._id}`}
                            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          >
                            Voir la réservation
                          </Link>
                        )}
                        <button
                          onClick={() => navigate(`/admin/partners/${id}`)}
                          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
                        >
                          Retour aux détails
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminPartnerMissions;
