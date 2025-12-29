import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { getReservationById } from '../api/reservations';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const result = await getReservationById(id);
        if (result.success) {
          setReservation(result.data);
        } else {
          setError(result.message || 'Réservation introuvable');
        }
      } catch (err) {
        setError('Erreur lors du chargement de la réservation');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id]);

  const canonical = absoluteUrl(`/reservations/${id}`);
  const alternateLocales = buildAlternateLocales(canonical);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <PageContainer className="py-8 max-w-4xl">
        <SEO
          title="Détails de la réservation — BRIBECO"
          description="Consultez toutes les informations liées à votre réservation."
          path={`/reservations/${id}`}
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        {loading && <Loader message="Chargement de la réservation..." />}
        {!loading && error && (
          <ErrorBlock 
            message={error || 'Une erreur est survenue'} 
            onRetry={() => {
              setError(null);
              setLoading(true);
              if (id) {
                getReservationById(id).then((result) => {
                  if (result.success) {
                    setReservation(result.data);
                    setError(null);
                  } else {
                    setError(result.message || 'Réservation introuvable');
                  }
                  setLoading(false);
                });
              }
            }}
            showHomeButton={true}
          />
        )}
        {!loading && reservation && (
          <>
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Fil d'Ariane">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary">Accueil</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/profile" className="hover:text-primary">Profil</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">Détails de la réservation</li>
          </ol>
        </nav>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Détails de la Réservation</h1>
            <StatusBadge status={reservation.status} type="reservation" />
          </div>

          {/* Service Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Service</h2>
            <div className="space-y-2">
              <p className="text-lg font-medium">{reservation.service?.title || 'Service'}</p>
              {reservation.service?.category && (
                <p className="text-gray-600">
                  Catégorie: {reservation.service.category.name}
                </p>
              )}
              {reservation.service?.description && (
                <p className="text-gray-600">{reservation.service.description}</p>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Adresse d'intervention</h2>
            <div className="space-y-2">
              <p className="text-gray-700">{reservation.address}</p>
              <p className="text-gray-700">Code postal: {reservation.postal_code}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Date et Horaire</h2>
            <div className="space-y-2">
              {reservation.date_requested ? (
                <>
                  <p className="text-gray-700">
                    Date: {formatDate(reservation.date_requested)}
                  </p>
                  {reservation.time_slot && (
                    <p className="text-gray-700">Horaire: {reservation.time_slot}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-700">Date non spécifiée</p>
              )}
              {reservation.urgent && (
                <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded mt-2">
                  Intervention urgente
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {reservation.description && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700">{reservation.description}</p>
            </div>
          )}

          {/* Partner Info */}
          {reservation.assigned_partner && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Partenaire Assigné</h2>
              <div className="space-y-2">
                {reservation.assigned_partner.user ? (
                  <>
                    <p className="text-gray-700">
                      {reservation.assigned_partner.user.first_name}{' '}
                      {reservation.assigned_partner.user.last_name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {reservation.assigned_partner.user.email}
                    </p>
                    {reservation.assigned_partner.user.phone && (
                      <p className="text-gray-600 text-sm">
                        Téléphone: {reservation.assigned_partner.user.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-700">Partenaire ID: {reservation.assigned_partner}</p>
                )}
                {reservation.partner_status && (
                  <div className="mt-2">
                    <StatusBadge status={reservation.partner_status} type="assignment" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          {reservation.payment && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Paiement</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Montant: <span className="font-semibold">{reservation.payment.amount}€</span>
                </p>
                {reservation.payment.status && (
                  <StatusBadge status={reservation.payment.status} type="payment" />
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Créée le: {formatDate(reservation.createdAt)}</p>
            {reservation.updatedAt && reservation.updatedAt !== reservation.createdAt && (
              <p>Modifiée le: {formatDate(reservation.updatedAt)}</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/profile')} variant="ghost">
              Retour au profil
            </Button>
          </div>
        </Card>
          </>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
};

export default ReservationDetail;

