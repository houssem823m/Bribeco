const users_role_enum = ['client', 'admin', 'partenaire'];
const reservations_status_enum = ['nouvelle', 'confirmée', 'en cours', 'terminée', 'annulée'];
const payment_status_enum = ['en attente', 'payé', 'échoué', 'remboursé'];
const partner_request_status = ['en attente', 'acceptée', 'refusée'];
const partner_assignment_status = ['envoyée', 'acceptée', 'refusée'];

module.exports = {
  users_role_enum,
  reservations_status_enum,
  payment_status_enum,
  partner_request_status,
  partner_assignment_status,
};

