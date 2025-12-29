import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getMyReservations } from '../api/reservations';
import ReservationList from '../components/ReservationList';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import Badge from '../components/Badge';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!isAuthenticated || user?.role !== 'client') {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getMyReservations();
      if (result.success) {
        setReservations(result.data || []);
        setError(null);
      } else {
        const errorMessage = result.message || 'Erreur lors du chargement des réservations';
        setError(errorMessage);
        console.error('Error fetching reservations:', errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur lors du chargement des réservations';
      setError(errorMessage);
      console.error('Exception fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  };

  const handleSave = async () => {
    // TODO: Implement update user API call
    showToast('Fonctionnalité de modification en cours de développement', 'info');
    setEditing(false);
  };

  const handleViewDetails = (reservationId) => {
    navigate(`/reservations/${reservationId}`);
  };

  const canonical = absoluteUrl('/profile');
  const alternateLocales = buildAlternateLocales(canonical);

  // Show loading state while checking authentication
  if (authLoading || (loading && !user)) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <Loader message="Chargement de votre profil..." />
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-br from-primary-pastel via-beige-light to-blue-50 min-h-screen py-section">
        <SEO
          title="Mon Profil — BRIBECO"
          description="Consultez vos informations personnelles et votre historique de réservations."
          path="/profile"
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        <PageContainer>
          <SectionTitle title="Mon Profil" align="left" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1">
              <Card className="shadow-wecasa border-2 border-primary/20 bg-gradient-to-br from-white to-primary-pastel">
                <div className="text-center mb-8">
                  <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-wecasa">
                    <span className="text-white text-4xl font-bold">
                      {user?.first_name?.[0]?.toUpperCase()}
                      {user?.last_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-600 mt-2">{user?.email}</p>
                  <div className="mt-4">
                    <Badge variant="info">
                      {user?.role === 'client' ? 'Client' : user?.role === 'partenaire' ? 'Partenaire' : 'Admin'}
                    </Badge>
                  </div>
                </div>

                {!editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prénom
                      </label>
                      <p className="text-gray-700 text-lg">{user?.first_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom
                      </label>
                      <p className="text-gray-700 text-lg">{user?.last_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <p className="text-gray-700 text-lg">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Téléphone
                      </label>
                      <p className="text-gray-700 text-lg">{user?.phone || 'N/A'}</p>
                    </div>
                    <Button onClick={handleEdit} variant="primary" className="w-full justify-center text-lg py-4">
                      Modifier mes informations
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleSave} className="flex-1 justify-center" variant="secondary">
                        Enregistrer
                      </Button>
                      <Button onClick={handleCancel} className="flex-1 justify-center" variant="ghost">
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}

                {/* Become Partner Button for Clients */}
                {user?.role === 'client' && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Button as={Link} to="/become-partner" variant="secondary" className="w-full justify-center text-lg py-4">
                      Devenir Partenaire
                    </Button>
                  </div>
                )}

                {/* Dashboard Links */}
                {user?.role === 'partenaire' && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Button as={Link} to="/partner/dashboard" variant="primary" className="w-full justify-center text-lg py-4">
                      Dashboard Partenaire
                    </Button>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Button as={Link} to="/admin/dashboard" variant="primary" className="w-full justify-center text-lg py-4">
                      Dashboard Admin
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Reservations History (for clients) */}
            {user?.role === 'client' && (
              <div className="lg:col-span-2">
                <Card className="shadow-wecasa border-2 border-primary/20">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">Mes Réservations</h2>
                  {error && (
                    <ErrorBlock 
                      message={error || 'Une erreur est survenue lors du chargement de vos réservations'} 
                      onRetry={fetchReservations}
                      showHomeButton={false}
                    />
                  )}
                  {!error && (
                    <ReservationList
                      reservations={reservations}
                      loading={loading}
                      error={null}
                      showActions={true}
                      onViewDetails={handleViewDetails}
                      onRetry={fetchReservations}
                    />
                  )}
                </Card>
              </div>
            )}

            {/* For non-clients, show empty state or other content */}
            {user?.role !== 'client' && (
              <div className="lg:col-span-2">
                <Card className="shadow-wecasa border-2 border-primary/20 bg-gradient-to-br from-white to-primary-pastel">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Tableau de bord</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {user?.role === 'partenaire'
                      ? 'Accédez à votre dashboard partenaire pour voir vos missions assignées.'
                      : 'Accédez à votre dashboard administrateur pour gérer la plateforme.'}
                  </p>
                </Card>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
