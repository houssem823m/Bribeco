const StatusBadge = ({ status, type = 'reservation' }) => {
  // Status color mapping
  const getStatusColor = (status, type) => {
    if (type === 'reservation') {
      const colors = {
        nouvelle: 'bg-blue-100 text-blue-800',
        confirmée: 'bg-green-100 text-green-800',
        'en cours': 'bg-yellow-100 text-yellow-800',
        terminée: 'bg-gray-100 text-gray-800',
        annulée: 'bg-red-100 text-red-800',
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    } else if (type === 'payment') {
      const colors = {
        'en attente': 'bg-yellow-100 text-yellow-800',
        payé: 'bg-green-100 text-green-800',
        échoué: 'bg-red-100 text-red-800',
        remboursé: 'bg-purple-100 text-purple-800',
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    } else if (type === 'assignment') {
      const colors = {
        envoyée: 'bg-blue-100 text-blue-800',
        acceptée: 'bg-green-100 text-green-800',
        refusée: 'bg-red-100 text-red-800',
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    } else if (type === 'partner') {
      const colors = {
        'en attente': 'bg-yellow-100 text-yellow-800',
        acceptée: 'bg-green-100 text-green-800',
        refusée: 'bg-red-100 text-red-800',
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    if (!status || typeof status !== 'string') {
      return 'Non défini';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Return null if status is not provided
  if (!status) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status,
        type
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;

