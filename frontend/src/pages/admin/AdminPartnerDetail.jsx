import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import PageContainer from '../../components/PageContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ErrorBlock from '../../components/ErrorBlock';
import SEO from '../../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../../utils/seo';
import { getPartnerById } from '../../api/admin';
import { EnvelopeIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const AdminPartnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canonical = absoluteUrl(`/admin/partners/${id}`);
  const alternateLocales = buildAlternateLocales(canonical);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getPartnerById(id);
        if (result.success) {
          setPartner(result.data);
        } else {
          setError(result.message || 'Partenaire introuvable');
        }
      } catch (err) {
        setError('Erreur lors du chargement du partenaire');
        console.error('Error loading partner:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title={`${partner?.user?.first_name || 'Partenaire'} ${partner?.user?.last_name || ''} — BRIBECO Admin`}
        description="Détails du partenaire"
        path={`/admin/partners/${id}`}
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        <button
          onClick={() => navigate('/admin/partners')}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour à la liste des partenaires
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            View details
          </h1>
          <p className="text-lg text-gray-400">
            Informations complètes du partenaire
          </p>
        </div>

        {loading && <Loader message="Chargement des détails du partenaire..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={() => window.location.reload()} />}

        {!loading && !error && partner && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Partner Info Card */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      {partner.user?.first_name} {partner.user?.last_name}
                    </h2>
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

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Informations de Contact</h3>
                    <div className="space-y-3">
                      {partner.user?.email && (
                        <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Email</p>
                            <a
                              href={`mailto:${partner.user.email}`}
                              className="text-gray-200 hover:text-blue-400 transition-colors font-medium"
                            >
                              {partner.user.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {partner.user?.phone && (
                        <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                          <PhoneIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Téléphone</p>
                            <a
                              href={`tel:${partner.user.phone}`}
                              className="text-gray-200 hover:text-blue-400 transition-colors font-medium"
                            >
                              {partner.user.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Information */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Informations de Service</h3>
                    <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-1">Type de service</p>
                      <p className="text-lg font-semibold text-white">{partner.service_type || 'Non spécifié'}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partner.createdAt && (
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                          <p className="text-sm text-gray-400 mb-1">Date d'inscription</p>
                          <p className="text-gray-200 font-medium">{formatDate(partner.createdAt)}</p>
                        </div>
                      )}
                      {partner.updatedAt && (
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                          <p className="text-sm text-gray-400 mb-1">Dernière mise à jour</p>
                          <p className="text-gray-200 font-medium">{formatDate(partner.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/admin/partners/${id}/missions`)}
                    className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                    Voir les missions
                  </button>
                  <button
                    onClick={() => navigate('/admin/partners')}
                    className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
                  >
                    Retour à la liste
                  </button>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Statut</span>
                    <span className={`font-semibold ${partner.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {partner.verified ? 'Vérifié' : 'Non vérifié'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Type de service</span>
                    <span className="font-semibold text-white">{partner.service_type || 'N/A'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminPartnerDetail;
