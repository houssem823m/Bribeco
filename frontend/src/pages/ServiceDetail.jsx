import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById } from '../api/services';
import BookingForm from '../components/BookingForm';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SEO from '../components/SEO';
import {
  absoluteUrl,
  buildAlternateLocales,
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
} from '../utils/seo';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const result = await getServiceById(id);
        if (result.success) {
          setService(result.data);
        } else {
          setError(result.message || 'Service introuvable');
        }
      } catch (err) {
        setError('Erreur lors du chargement du service');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const handleBookingSuccess = (reservation) => {
    showToast('Réservation créée avec succès!', 'success');
    // Navigate to reservation detail page instead of profile
    if (reservation && reservation._id) {
      setTimeout(() => {
        navigate(`/reservations/${reservation._id}`);
      }, 1500);
    } else {
      // Fallback to profile if no reservation ID
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  const handleBookingError = (message) => {
    const errorMessage = message || 'Une erreur est survenue lors de la réservation. Veuillez réessayer.';
    showToast(errorMessage, 'error');
    console.error('Booking error:', message);
  };

  // Note: Service viewing is public, but booking requires authentication
  // The BookingForm component handles the authentication check

  if (loading) {
    return (
      <PageContainer>
        <Loader message="Chargement du service..." />
      </PageContainer>
    );
  }

  if (error || !service) {
    return (
      <PageContainer>
        <ErrorBlock message={error || 'Service introuvable'} onRetry={() => navigate('/services')} />
      </PageContainer>
    );
  }

  const images =
    service.images && service.images.length > 0
      ? service.images
      : ['https://via.placeholder.com/800x400?text=Service+Image'];

  const canonical = absoluteUrl(`/services/${service?._id || id}`);
  const alternateLocales = buildAlternateLocales(canonical);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service._id}` },
  ]);
  const serviceJsonLd = buildServiceJsonLd(service, { url: canonical });

  return (
    <PageContainer>
      <SEO
        title={`${service.title} — BRIBECO`}
        description={service.description?.slice(0, 150) || 'Service BRIBECO'}
        path={`/services/${service._id}`}
        canonical={canonical}
        alternateLocales={alternateLocales}
        image={images[0]}
        type="article"
        jsonLd={[breadcrumbJsonLd, serviceJsonLd]}
      />
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary">
                Accueil
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/services" className="hover:text-primary">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{service.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Service Details */}
          <div>
            {/* Image Carousel */}
            <div className="mb-6">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <img
                  src={images[currentImageIndex]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Non+Disponible';
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Category Badge */}
            {service.category && (
              <div className="mb-4">
                <Badge variant="info">{service.category.name}</Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

            {/* Price Range */}
            {service.price_range && (
              <div className="mb-6">
                <p className="text-2xl font-semibold text-primary">{service.price_range}</p>
                <p className="text-sm text-gray-600 mt-1">Prix indicatif</p>
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            )}

            {/* What's Included */}
            {service.includes && service.includes.length > 0 && (
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Ce que comprend ce service</h2>
                <ul className="space-y-2">
                  {service.includes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <BookingForm
              serviceId={id}
              service={service}
              onSuccess={handleBookingSuccess}
              onError={handleBookingError}
            />
          </div>
        </div>

        {/* Testimonials Section (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder testimonials - can be replaced with real data */}
            <Card>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "Service professionnel et rapide. Je recommande vivement!"
              </p>
              <p className="font-semibold text-sm">- Client satisfait</p>
            </Card>
            <Card>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "Intervention de qualité, prix raisonnable. Parfait!"
              </p>
              <p className="font-semibold text-sm">- Client satisfait</p>
            </Card>
            <Card>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "Très satisfait du service, je reviendrai sans hésiter."
              </p>
              <p className="font-semibold text-sm">- Client satisfait</p>
            </Card>
          </div>
        </div>
      </PageContainer>
  );
};

export default ServiceDetail;
