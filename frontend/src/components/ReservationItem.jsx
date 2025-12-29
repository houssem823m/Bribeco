import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ReservationItem = ({ reservation, showActions = false, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString, timeSlot) => {
    const date = formatDate(dateString);
    return timeSlot ? `${date} - ${timeSlot}` : date;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {reservation.service?.title || 'Service'}
            </h3>
            <StatusBadge status={reservation.status} type="reservation" />
          </div>

          {reservation.service?.category && (
            <p className="text-sm text-gray-600 mb-2">
              Catégorie: {reservation.service.category.name}
            </p>
          )}

          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Adresse:</span> {reservation.address}
            </p>
            <p>
              <span className="font-medium">Code postal:</span> {reservation.postal_code}
            </p>
            {reservation.date_requested && (
              <p>
                <span className="font-medium">Date:</span>{' '}
                {formatDateTime(reservation.date_requested, reservation.time_slot)}
              </p>
            )}
            {reservation.urgent && (
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                Urgent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Partner Info */}
      {reservation.assigned_partner && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Partenaire assigné:</p>
          {reservation.assigned_partner.user ? (
            <p className="text-sm text-blue-700">
              {reservation.assigned_partner.user.first_name}{' '}
              {reservation.assigned_partner.user.last_name}
            </p>
          ) : (
            <p className="text-sm text-blue-700">Partenaire ID: {reservation.assigned_partner}</p>
          )}
          {reservation.partner_status && (
            <StatusBadge status={reservation.partner_status} type="assignment" />
          )}
        </div>
      )}

      {/* Payment Info */}
      {reservation.payment && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Paiement</p>
              <p className="text-sm text-gray-600">
                Montant: {reservation.payment.amount}€
              </p>
            </div>
            {reservation.payment.status && (
              <StatusBadge status={reservation.payment.status} type="payment" />
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {reservation.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Description:</span> {reservation.description}
          </p>
        </div>
      )}

      {/* View Details */}
      {showActions && onViewDetails ? (
        <button
          onClick={() => onViewDetails(reservation._id)}
          className="mt-4 text-primary hover:underline text-sm"
        >
          Voir les détails →
        </button>
      ) : (
        !showActions && (
          <Link
            to={`/reservations/${reservation._id}`}
            className="inline-block text-primary hover:underline text-sm mt-2"
          >
            Voir les détails →
          </Link>
        )
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        Créée le: {formatDate(reservation.createdAt)}
      </div>
    </div>
  );
};

export default ReservationItem;

