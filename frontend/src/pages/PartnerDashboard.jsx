import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getPartnerAssignments, getCurrentPartner } from '../api/partners';
import PartnerAssignmentList from '../components/PartnerAssignmentList';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import SectionTitle from '../components/SectionTitle';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const canonical = absoluteUrl('/partner/dashboard');
  const alternateLocales = buildAlternateLocales(canonical);

  const loadAssignments = async () => {
    if (!user || user.role !== 'partenaire') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const partnerResult = await getCurrentPartner();
      if (partnerResult.success && partnerResult.data?._id) {
        const pid = partnerResult.data._id;
        setPartnerId(pid);
        const result = await getPartnerAssignments(pid);
        if (result.success) {
          setAssignments(result.data);
          setError(null);
        } else {
          setError(result.message || 'Erreur lors du chargement des missions');
        }
      } else {
        setError(
          'Impossible de récupérer vos informations partenaire. Veuillez contacter un administrateur.'
        );
      }
    } catch (err) {
      console.error('Error loading partner dashboard:', err);
      setError(
        partnerResult.message || 'Erreur lors du chargement de vos informations partenaire. Veuillez contacter un administrateur.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = () => {
    if (partnerId) {
      loadAssignments();
    }
  };

  return (
    <ProtectedRoute allowedRoles={['partenaire']}>
      <SEO
        title="Dashboard Partenaire — BRIBECO"
        description="Consultez vos missions et répondez aux demandes en attente."
        path="/partner/dashboard"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      <PageContainer>
        <SectionTitle
          title="Dashboard Partenaire"
          description="Gérez vos missions assignées et répondez aux demandes de réservation."
          align="left"
        />

        {loading && <Loader message="Chargement de vos missions..." />}

        {error && !loading && (
          <ErrorBlock
            message={error}
            onRetry={loadAssignments}
          />
        )}

        {!loading && !error && assignments.length === 0 && (
          <EmptyState
            icon="🧰"
            title="Aucune mission disponible"
            description="Vous n'avez pas encore de missions assignées. Revenez plus tard."
          />
        )}

        {!loading && !error && assignments.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold mb-6">Missions Assignées</h2>
            <PartnerAssignmentList
              assignments={assignments}
              loading={false}
              error={null}
              onUpdate={handleUpdate}
              onRetry={loadAssignments}
            />
          </Card>
        )}

        {!loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center bg-blue-50">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {assignments.filter((a) => a.status === 'envoyée').length}
              </div>
              <div className="text-gray-600">En attente</div>
            </Card>
            <Card className="text-center bg-green-50">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {assignments.filter((a) => a.status === 'acceptée').length}
              </div>
              <div className="text-gray-600">Acceptées</div>
            </Card>
            <Card className="text-center bg-red-50">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {assignments.filter((a) => a.status === 'refusée').length}
              </div>
              <div className="text-gray-600">Refusées</div>
            </Card>
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
};

export default PartnerDashboard;
