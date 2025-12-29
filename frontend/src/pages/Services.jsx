import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServices, getCategories } from '../api/services';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';
import { WrenchScrewdriverIcon, ArrowRightIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const canonical = absoluteUrl('/services');
  const alternateLocales = buildAlternateLocales(canonical);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesResult, categoriesResult] = await Promise.all([
          getServices(),
          getCategories(),
        ]);
        
        if (servicesResult.success) {
          setServices(servicesResult.data);
        } else {
          setError(servicesResult.message || 'Impossible de charger les services');
        }
        
        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    try {
      const [servicesResult, categoriesResult] = await Promise.all([
        getServices(),
        getCategories(),
      ]);
      
      if (servicesResult.success) {
        setServices(servicesResult.data);
        setError(null);
      } else {
        setError(servicesResult.message || 'Impossible de charger les services');
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Filter services based on search query and selected category
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = 
        searchQuery === '' ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === '' ||
        service.category?._id === selectedCategory ||
        service.category?.slug === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Couleurs alternées pour les cartes
  const cardColors = [
    { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { bg: 'bg-yellow-50', border: 'border-yellow-200', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { bg: 'bg-pink-50', border: 'border-pink-200', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
  ];

  // Get service image - use service image if available, otherwise use category-based fallback
  const getServiceImage = (service, serviceIndex) => {
    // If service has images array and first image exists, use it
    if (service.images && service.images.length > 0 && service.images[0]) {
      return service.images[0];
    }

    // Otherwise, use category-based Unsplash images
    const categoryName = service.category?.name?.toLowerCase() || '';
    const serviceTitle = service.title?.toLowerCase() || '';
    
    // Use service ID or index to deterministically select image
    const seed = service._id ? service._id.toString().charCodeAt(service._id.length - 1) : serviceIndex;

    // Plomberie / Plumbing images
    if (categoryName.includes('plomberie') || serviceTitle.includes('plomberie') || serviceTitle.includes('plombier') || serviceTitle.includes('fuite') || serviceTitle.includes('sanitaire')) {
      const plumbingImages = [
        'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&auto=format&q=80',
      ];
      return plumbingImages[seed % plumbingImages.length];
    }

    // Électricité / Electrical images
    if (categoryName.includes('électricité') || categoryName.includes('electricite') || serviceTitle.includes('électricité') || serviceTitle.includes('electricite') || serviceTitle.includes('électrique') || serviceTitle.includes('electrique')) {
      const electricalImages = [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1621905252472-38af259744f8?w=400&h=300&fit=crop&auto=format&q=80',
      ];
      return electricalImages[seed % electricalImages.length];
    }

    // Serrurerie / Locksmith images
    if (categoryName.includes('serrurerie') || serviceTitle.includes('serrurerie') || serviceTitle.includes('serrure') || serviceTitle.includes('déblocage') || serviceTitle.includes('deblocage') || serviceTitle.includes('porte')) {
      const locksmithImages = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop&auto=format&q=80',
      ];
      return locksmithImages[seed % locksmithImages.length];
    }

    // Default professional technician image
    const defaultImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f6df673?w=400&h=300&fit=crop&auto=format&q=80',
    ];
    return defaultImages[serviceIndex % defaultImages.length];
  };

  return (
    <div className="bg-white min-h-screen py-section">
      <PageContainer>
        <SEO
          title="Nos Services — BRIBECO"
          description="Découvrez nos services de dépannage : plomberie, électricité, serrurerie et plus encore."
          path="/services"
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 mb-12"
        >
          <SectionTitle
            title="Nos Services"
            description="Réservez en ligne un expert certifié pour intervenir rapidement à votre domicile."
            align="left"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Sélectionnez un service</h3>
          <p className="text-xl text-gray-700 mb-8">Choisissez le service qui correspond à vos besoins</p>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                />
              </div>
            </motion.div>
            
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-64"
            >
              <div className="relative">
                <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
        </div>
            </motion.div>
        </div>
          
          {/* Results Count */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-600 mb-4"
            >
              {filteredServices.length === 0 ? (
                <span>Aucun service trouvé</span>
              ) : (
                <span>
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
                  {(searchQuery || selectedCategory) && ` (sur ${services.length})`}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {loading && <Loader message="Chargement des services..." />}

        {error && <ErrorBlock message={error} onRetry={handleRetry} />}

        {!loading && !error && services.length === 0 && (
          <EmptyState
            title="Aucun service disponible"
            description="Revenez bientôt, de nouveaux services seront ajoutés."
            action={
              <Button as={Link} to="/" variant="primary">
                Retour à l'accueil
              </Button>
            }
          />
        )}

        {!loading && !error && services.length > 0 && filteredServices.length === 0 && (searchQuery || selectedCategory) && (
          <EmptyState
            title="Aucun service trouvé"
            description="Essayez de modifier vos critères de recherche ou de filtre."
            action={
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                variant="primary"
              >
                Réinitialiser les filtres
              </Button>
            }
          />
        )}

        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredServices.map((service, index) => {
              const colors = cardColors[index % cardColors.length];
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                <Card 
                    className={`flex flex-col ${colors.bg} border-2 ${colors.border} hover:shadow-wecasa-hover transition-all duration-300 group rounded-2xl overflow-hidden`}
                >
                    {/* Service Image (Wecasa-style) */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getServiceImage(service, index)}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to a default image if the image fails to load
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category Badge */}
                      <div className="mb-4">
                    <div className="text-sm uppercase text-secondary font-bold tracking-wide px-3 py-1.5 bg-secondary-pastel rounded-full inline-block">
                          {service.category?.name || 'Service'}
                    </div>
                  </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 flex-grow mb-6 leading-relaxed text-base">
                        {service.description}
                      </p>
                  
                  {/* Price */}
                  {service.price_range && (
                    <div className={`mb-6 p-4 ${colors.iconBg} rounded-xl border-2 ${colors.border}`}>
                      <p className="text-3xl font-bold text-primary">{service.price_range}</p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button as={Link} to={`/services/${service._id}`} variant="primary-pastel" className="w-full group/btn">
                    <span className="group-hover/btn:translate-x-1 transition-transform inline-block">Voir le service</span>
                    <ArrowRightIcon className="ml-2 w-5 h-5 inline-block group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                    </div>
                </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Services;
