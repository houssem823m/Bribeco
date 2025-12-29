import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOverview, getServiceRequests } from '../api/admin';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [latestRequests, setLatestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [overviewResult, requestsResult] = await Promise.all([
          getAdminOverview(),
          getServiceRequests({ limit: 5 }),
        ]);

        if (overviewResult.success) {
          setOverview(overviewResult.data);
        } else {
          throw new Error(
            overviewResult.message || 'Erreur lors du chargement des statistiques'
          );
        }

        if (requestsResult.success) {
          setLatestRequests(requestsResult.data || []);
        } else {
          throw new Error(
            requestsResult.message || 'Erreur lors du chargement des demandes'
          );
        }

        setError(null);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const canonical = absoluteUrl('/admin/dashboard');
  const alternateLocales = buildAlternateLocales(canonical);

  return (
    <>
      <SEO
        title="Dashboard Admin — BRIBECO"
        description="Pilotez les réservations, partenaires et paiements depuis un tableau de bord centralisé."
        path="/admin/dashboard"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <div className="mb-12 text-left animate-fade-in">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-medium">
          Gérez la plateforme BRIBECO
        </p>
      </div>

      {loading && <Loader message="Chargement des statistiques..." />}

      {error && !loading && (
        <ErrorBlock
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            Promise.all([getAdminOverview(), getServiceRequests({ limit: 5 })]).then(
              ([overviewResult, requestsResult]) => {
                if (overviewResult.success) {
                  setOverview(overviewResult.data);
                } else {
                  setError(
                    overviewResult.message ||
                      'Erreur lors du chargement des statistiques'
                  );
                }

                if (requestsResult.success) {
                  setLatestRequests(requestsResult.data || []);
                } else {
                  setError(
                    requestsResult.message ||
                      'Erreur lors du chargement des demandes'
                  );
                }
                setLoading(false);
              }
            );
          }}
        />
      )}

      {!loading && !error && (
        <>
          {/* Overview Stats */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Utilisateurs', value: overview.users?.total || 0, icon: '👥', color: 'bg-gray-800 border-gray-700' },
                { label: 'Partenaires', value: overview.users?.partners || 0, icon: '🤝', color: 'bg-gray-800 border-gray-700' },
                { label: 'Réservations', value: overview.reservations?.total || 0, icon: '📋', color: 'bg-gray-800 border-gray-700' },
                { label: 'Paiements en attente', value: overview.payments?.pending || 0, icon: '💳', color: 'bg-yellow-900/30 border-yellow-700/50' },
              ].map((stat) => (
                <Card key={stat.label} className={`${stat.color} border-2 hover:shadow-wecasa-hover hover:scale-[1.02] transition-all duration-300`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-semibold mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="text-5xl">{stat.icon}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Reservations by Status */}
          {overview?.reservations?.byStatus && (
            <Card className="mb-12 shadow-wecasa bg-gray-800 border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">Réservations par Statut</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {Object.entries(overview.reservations.byStatus).map(([status, count]) => (
                  <div key={status} className="text-center p-6 bg-gray-700/50 rounded-wecasa border border-gray-600">
                    <StatusBadge status={status} type="reservation" />
                    <p className="text-3xl font-bold mt-3 text-white">{count}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { to: '/admin/categories', icon: '📁', title: 'Gérer les Catégories', desc: 'Créer, modifier et supprimer les catégories de services', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/services', icon: '🔧', title: 'Gérer les Services', desc: 'Créer, modifier et supprimer les services proposés', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/faqs', icon: '❓', title: 'Gérer les FAQs', desc: 'Ajouter et modifier les questions fréquentes', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/testimonials', icon: '⭐', title: 'Gérer les Témoignages', desc: 'Modérer et approuver les témoignages clients', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/partner-requests', icon: '🤝', title: 'Demandes de Partenariat', desc: 'Examiner et approuver les demandes de partenariat', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/partners', icon: '👥', title: 'Gérer les Partenaires', desc: 'Consulter toutes les informations des partenaires de la plateforme', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/service-requests', icon: '🛠️', title: 'Demandes de Service', desc: 'Consulter et traiter toutes les réservations clients', color: 'bg-gray-800 border-gray-700' },
              { to: '/admin/payments', icon: '💳', title: 'Gérer les Paiements', desc: 'Voir et gérer tous les paiements de la plateforme', color: 'bg-gray-800 border-gray-700' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${item.color} text-white rounded-wecasa-lg shadow-wecasa p-8 hover:shadow-wecasa-hover hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary-light`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-5xl mr-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>

          {/* Recent Service Requests */}
          <Card className="mb-12 shadow-wecasa bg-gray-800 border-gray-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Demandes récentes</h2>
                <p className="text-gray-300">
                  Dernières réservations créées sur la plateforme.
                </p>
              </div>
              <Button as={Link} to="/admin/service-requests" variant="primary">
                Voir toutes les demandes
              </Button>
            </div>
            {latestRequests.length === 0 ? (
              <p className="text-sm text-gray-400">
                Aucune demande de service récente.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Urgent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">
                        Créée le
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {latestRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-200">
                          {request.user?.first_name} {request.user?.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-200">
                          {request.service?.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-200">
                          <StatusBadge status={request.status} type="reservation" />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-200">
                          {request.urgent ? (
                            <span className="text-red-400 font-semibold">Oui</span>
                          ) : (
                            <span className="text-gray-400">Non</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(request.createdAt).toLocaleString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          {overview?.reservations?.recent && (
            <Card className="shadow-wecasa bg-gray-800 border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Activité Récente</h2>
              <p className="text-gray-300 text-lg">
                {overview.reservations.recent} nouvelles réservations au cours des 7 derniers jours
              </p>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default AdminDashboard;
