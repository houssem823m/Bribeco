import ReservationItem from './ReservationItem';
import Loader from './Loader';
import ErrorBlock from './ErrorBlock';
import EmptyState from './EmptyState';

const ReservationList = ({
  reservations,
  loading,
  error,
  showActions = false,
  onViewDetails,
  onRetry,
}) => {
  if (loading) {
    return <Loader message="Chargement des réservations..." />;
  }

  if (error) {
    return <ErrorBlock message={error} onRetry={onRetry} />;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Aucune réservation"
        description="Vous n'avez pas encore de réservations. Réservez un service pour voir l'historique ici."
      />
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <ReservationItem
          key={reservation._id}
          reservation={reservation}
          showActions={showActions}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ReservationList;

