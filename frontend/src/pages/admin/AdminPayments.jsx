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
import { getAllPayments } from '../../api/admin';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const canonical = absoluteUrl('/admin/payments');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadPayments = async () => {
    setLoading(true);
    const result = await getAllPayments(statusFilter !== 'all' ? statusFilter : undefined);
    if (result.success) {
      setPayments(result.data || []);
      setError(null);
    } else {
      setError(result.message || 'Impossible de charger les paiements');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Filter payments based on search term
  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return payments.filter(
      (payment) =>
        payment.reservation?._id?.toLowerCase().includes(lowerSearchTerm) ||
        payment.payment_intent_id?.toLowerCase().includes(lowerSearchTerm) ||
        payment.status?.toLowerCase().includes(lowerSearchTerm) ||
        payment.amount?.toString().includes(lowerSearchTerm) ||
        payment.reservation?.user?.email?.toLowerCase().includes(lowerSearchTerm) ||
        payment.reservation?.user?.first_name?.toLowerCase().includes(lowerSearchTerm) ||
        payment.reservation?.user?.last_name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [payments, searchTerm]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des paiements — BRIBECO"
        description="Suivez les transactions et leur statut en temps réel."
        path="/admin/payments"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Payments
          </h1>
          <p className="text-lg text-gray-400">
            Consultez les transactions enregistrées et surveillez leur statut.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label htmlFor="search-payments" className="block text-sm font-semibold text-gray-300 mb-2">
                Rechercher un paiement
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search-payments"
                  type="text"
                  placeholder="Rechercher par ID réservation, intent, montant, client ou statut..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            {searchTerm && (
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-4">
                  {filteredPayments.length} résultat(s) trouvé(s)
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
              <p className="text-xs text-gray-400">Sélectionnez une catégorie de paiements.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'en attente', 'payé', 'échoué', 'remboursé'].map((status) => (
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
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          {loading && <Loader message="Chargement des paiements..." />}
          {!loading && error && <ErrorBlock message={error} onRetry={loadPayments} />}
          {!loading && !error && filteredPayments.length === 0 && payments.length === 0 && (
            <EmptyState
              icon="💳"
              title="Aucun paiement"
              description="Aucune transaction correspondant au filtre sélectionné."
            />
          )}
          {!loading && !error && filteredPayments.length === 0 && payments.length > 0 && (
            <EmptyState
              icon="🔍"
              title="Aucun résultat"
              description={`Aucun paiement ne correspond à "${searchTerm}".`}
            />
          )}
          {!loading && !error && filteredPayments.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Réservation
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Intent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/30">
                    {filteredPayments.map((payment) => (
                    <tr 
                      key={payment._id} 
                      className="hover:bg-gray-700/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-300">
                          {payment.reservation?._id?.slice(-8) || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-bold text-white">
                          {payment.amount?.toFixed(2)} €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} type="payment" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-400 max-w-xs truncate">
                          {payment.payment_intent_id || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleString('fr-FR')
                            : '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminPayments;
