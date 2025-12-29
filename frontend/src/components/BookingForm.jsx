import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../api/reservations';
import { createPaymentIntent, confirmPayment } from '../api/payments';
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Card from './Card';
import EmptyState from './EmptyState';
import ErrorBlock from './ErrorBlock';

const BookingForm = ({ serviceId, service, onSuccess, onError }) => {
  const { user, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState(null);

  // Extract price from price_range (e.g., "50€ - 100€" -> 50, "50€" -> 50)
  const extractPrice = (priceRange) => {
    if (!priceRange) return 0;
    // Extract first number from price range string (handles formats like "50€", "50€ - 100€", "50-100€")
    const match = priceRange.match(/(\d+(?:[.,]\d+)?)/);
    if (match) {
      const price = parseFloat(match[1].replace(',', '.'));
      return price > 0 ? price : 0;
    }
    return 0;
  };

  const servicePrice = service ? extractPrice(service.price_range) : 0;

  // Validation schema
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('Le prénom est requis')
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    last_name: Yup.string()
      .required('Le nom est requis')
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: Yup.string()
      .email('Email invalide')
      .required('L\'email est requis'),
    phone: Yup.string()
      .required('Le téléphone est requis')
      .matches(/^[0-9+\s-]+$/, 'Format de téléphone invalide'),
    address: Yup.string()
      .required('L\'adresse est requise')
      .min(5, 'L\'adresse doit contenir au moins 5 caractères'),
    postal_code: Yup.string()
      .required('Le code postal est requis')
      .matches(/^[0-9]{5}$/, 'Le code postal doit contenir 5 chiffres'),
    description: Yup.string()
      .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
    date_requested: Yup.date()
      .nullable()
      .min(new Date(), 'La date ne peut pas être dans le passé'),
    time_slot: Yup.string()
      .when('date_requested', {
        is: (date) => date !== null && date !== undefined,
        then: (schema) => schema.required('L\'horaire est requis si une date est sélectionnée'),
      }),
  });

  // Initial values (pre-fill if user is logged in)
  const initialValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    postal_code: '',
    description: '',
    urgent: false,
    date_requested: '',
    time_slot: '',
  };

  // Time slots
  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
  ];

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitError(null);
      
      // Step 1: Create reservation
      const reservationData = {
        serviceId,
        address: values.address,
        postal_code: values.postal_code,
        description: values.description,
        urgent: values.urgent,
        date_requested: values.date_requested || null,
        time_slot: values.time_slot || null,
      };

      const reservationResult = await createReservation(reservationData);

      if (!reservationResult.success) {
        const errorMessage = reservationResult.message || 'Erreur lors de la création de la réservation';
        if (reservationResult.errors) {
          reservationResult.errors.forEach((error) => {
            setFieldError(error.param || 'general', error.msg || error.message);
          });
        }
        setSubmitError(errorMessage);
        onError(errorMessage);
        setSubmitting(false);
        return;
      }

      const reservation = reservationResult.data;

      // Step 2: Create payment intent (use service price)
      if (servicePrice <= 0) {
        const errorMessage = 'Le prix du service n\'est pas disponible. Veuillez contacter le support.';
        setSubmitError(errorMessage);
        onError(errorMessage);
        setSubmitting(false);
        return;
      }

      const paymentIntentResult = await createPaymentIntent(
        reservation._id,
        servicePrice
      );

      if (!paymentIntentResult.success) {
        const errorMessage = paymentIntentResult.message || 'Erreur lors de la création du paiement';
        setSubmitError(errorMessage);
        onError(errorMessage);
        setSubmitting(false);
        return;
      }

      const { paymentIntentId } = paymentIntentResult.data;

      // Step 3: Simulate payment confirmation (fake Stripe)
      const confirmResult = await confirmPayment(paymentIntentId, true);

      if (!confirmResult.success) {
        const errorMessage = confirmResult.message || 'Erreur lors de la confirmation du paiement';
        setSubmitError(errorMessage);
        onError(errorMessage);
        setSubmitting(false);
        return;
      }

      // Success!
      setSubmitError(null);
      onSuccess(reservation);
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Une erreur inattendue s\'est produite lors de la réservation. Veuillez réessayer.';
      setSubmitError(errorMessage);
      onError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <EmptyState
          icon="🔒"
          title="Connexion requise"
          description="Vous devez être connecté pour effectuer une réservation."
          action={
            <Button as="a" href="/login" variant="primary" className="justify-center">
              Se connecter
            </Button>
          }
        />
      </Card>
    );
  }

  if (user?.role !== 'client') {
    return (
      <Card>
        <EmptyState
          icon="🧾"
          title="Compte non autorisé"
          description="Seuls les clients peuvent effectuer des réservations."
        />
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Réserver ce service</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Prénom *" name="first_name" />
              <InputField label="Nom *" name="last_name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email *" name="email" type="email" />
              <InputField label="Téléphone *" name="phone" type="tel" />
            </div>

            <InputField label="Adresse *" name="address" />

            <InputField label="Code postal *" name="postal_code" />

            {/* Service Price Display */}
            {service && service.price_range && (
              <div className="p-4 bg-primary-pastel rounded-wecasa border-2 border-primary/20">
                <p className="text-sm text-gray-600 mb-1">Prix du service</p>
                <p className="text-2xl font-bold text-primary">{service.price_range}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Décrivez votre besoin..."
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <InputField
                label="Date souhaitée (optionnel)"
                name="date_requested"
                type="date"
                optional
                min={new Date().toISOString().split('T')[0]}
              />
              </div>

              <SelectField
                label="Horaire (optionnel)"
                name="time_slot"
                optional
                disabled={!values.date_requested}
              >
                <option value="">Sélectionnez un horaire</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </SelectField>
            </div>

            {/* Urgent Checkbox */}
            <div className="flex items-center">
              <Field
                type="checkbox"
                id="urgent"
                name="urgent"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                Intervention urgente
              </label>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-wecasa p-4">
                <p className="text-red-800 text-sm font-medium">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full justify-center">
              Réserver et Payer
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default BookingForm;

