import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { useToast } from '../context/ToastContext';
import { respondToAssignment } from '../api/partners';
import Button from './Button';
import Loader from './Loader';
import ErrorBlock from './ErrorBlock';
import EmptyState from './EmptyState';

const PartnerAssignmentItem = ({ assignment, onUpdate }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRespond = async (action) => {
    try {
      setLoading(true);
      const result = await respondToAssignment(assignment._id, action);
      if (result.success) {
        showToast(
          `Mission ${action === 'accept' ? 'acceptée' : 'refusée'} avec succès!`,
          'success'
        );
        if (onUpdate) {
          onUpdate();
        }
      } else {
        showToast(result.message || 'Erreur lors de la réponse', 'error');
      }
    } catch (error) {
      showToast('Une erreur inattendue s\'est produite', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reservation = assignment.reservation;
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {reservation?.service?.title || 'Service'}
            </h3>
            <StatusBadge status={assignment.status} type="assignment" />
          </div>

          {reservation?.service?.category && (
            <p className="text-sm text-gray-600 mb-2">
              Catégorie: {reservation.service.category.name}
            </p>
          )}

          <div className="space-y-1 text-sm text-gray-600 mb-4">
            {reservation?.user && (
              <p>
                <span className="font-medium">Client:</span> {reservation.user.first_name}{' '}
                {reservation.user.last_name}
              </p>
            )}
            <p>
              <span className="font-medium">Adresse:</span> {reservation?.address}
            </p>
            <p>
              <span className="font-medium">Code postal:</span> {reservation?.postal_code}
            </p>
            {reservation?.date_requested && (
              <p>
                <span className="font-medium">Date:</span>{' '}
                {formatDate(reservation.date_requested)}
                {reservation?.time_slot && ` - ${reservation.time_slot}`}
              </p>
            )}
            {reservation?.urgent && (
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                Urgent
              </span>
            )}
          </div>

          {reservation?.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Description:</span> {reservation.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {assignment.status === 'envoyée' && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={() => handleRespond('accept')}
            isLoading={loading}
            disabled={loading}
            variant="secondary"
            className="flex-1 justify-center"
          >
            Accepter
          </Button>
          <Button
            onClick={() => handleRespond('reject')}
            isLoading={loading}
            disabled={loading}
            variant="danger"
            className="flex-1 justify-center"
          >
            Refuser
          </Button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        Assignée le: {formatDate(assignment.createdAt)}
      </div>
    </div>
  );
};

const PartnerAssignmentList = ({ assignments, loading, error, onUpdate, onRetry }) => {
  if (loading) {
    return <Loader message="Chargement des missions..." />;
  }

  if (error) {
    return <ErrorBlock message={error} onRetry={onRetry} />;
  }

  if (!assignments || assignments.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Aucune mission assignée"
        description="Vous n'avez pas encore de missions assignées."
      />
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <PartnerAssignmentItem
          key={assignment._id}
          assignment={assignment}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default PartnerAssignmentList;

