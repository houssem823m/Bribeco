import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import PageContainer from '../components/PageContainer';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';
import { getSiteContent } from '../api/admin';
import { 
  BoltIcon, 
  CheckBadgeIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

// Icon mapping
const iconMap = {
  PhoneIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  ChartBarIcon,
};

const Home = () => {
  const canonical = absoluteUrl('/');
  const alternateLocales = buildAlternateLocales(canonical);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const result = await getSiteContent('home');
    if (result.success && result.data?.content) {
      setContent(result.data.content);
    }
    setLoading(false);
  };

  if (loading || !content) {
    return (
      <div className="bg-gray-200 min-h-screen">
        <Loader message="Chargement de la page..." />
      </div>
    );
  }

  // Service categories from content
  const serviceCategories = content.services?.items || [];
  
  // Process steps from content
  const processSteps = content.howItWorks?.items?.map(step => ({
    ...step,
    icon: iconMap[step.icon] || PhoneIcon,
  })) || [];

  return (
    <div className="bg-gray-200 overflow-hidden ">
      <SEO
        title="BRIBECO — Dépannage rapide 7j/7"
        description="Réservez votre intervention en quelques clics, payez en ligne et suivez l'avancement depuis votre espace client."
        path="/"
        canonical={canonical}
        alternateLocales={alternateLocales}
      />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Service Categories Section - Enhanced with title */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                              linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text text-sm font-bold uppercase tracking-wider">
                {content.services?.sectionTitle || 'Nos Services'}
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {content.services?.sectionSubtitle || 'Solutions pour tous vos besoins'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.services?.sectionDescription || 'Des professionnels qualifiés à votre service, 7j/7 et 24h/24'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {serviceCategories.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Link to={service.link || '/services'}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-wecasa hover:shadow-wecasa-hover transition-all duration-300">
                    {/* Image Background */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                          {service.title}
                        </h3>
                        {service.subtitle && (
                          <p className="text-xl md:text-2xl font-semibold text-white/90">
                            {service.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Service Content */}
                    <div className={`${service.variant === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-500' : service.variant === 'green' ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gradient-to-br from-yellow-300 to-yellow-400'} ${service.variant === 'yellow' ? 'text-gray-900' : 'text-white'} p-8 md:p-12 relative overflow-hidden`}>
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10 text-center w-full flex flex-col items-center">
                        <p className="text-lg mt-4 opacity-80 leading-relaxed text-center w-full max-w-2xl">
                          {service.description}
                        </p>
                        
                        {/* Arrow icon */}
                        <div className="relative z-10 mt-8 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                          <ArrowRightIcon className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Professionals Images Section */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full"
            >
              <span className="text-primary text-sm font-bold uppercase tracking-wider">
                {content.professionals?.sectionTitle || 'Nos Professionnels'}
              </span>
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {content.professionals?.sectionSubtitle || 'Des experts à votre service'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.professionals?.sectionDescription || 'Des artisans qualifiés et expérimentés pour tous vos besoins'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(content.professionals?.items || []).map((professional, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-wecasa hover:shadow-wecasa-hover transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={professional.image}
                      alt={professional.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{professional.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{professional.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* How It Works Section - Futuristic process */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,123,255,0.1),transparent_50%)]"></div>
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-500/10 rounded-full"
          />
        </div>

        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full"
            >
              <span className="text-primary text-sm font-bold uppercase tracking-wider">
                {content.howItWorks?.sectionTitle || 'Comment ça marche'}
              </span>
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {content.howItWorks?.sectionSubtitle || 'En 4 étapes simples'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.howItWorks?.sectionDescription || 'Un processus fluide et transparent pour votre tranquillité d\'esprit'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-wecasa hover:shadow-wecasa-hover transition-all duration-300 relative overflow-hidden">
                    {/* Gradient background on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <span className="text-6xl font-black text-gray-200">{step.step}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>

                    {/* Connecting line (not for last item) */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Why Choose Us Section - Enhanced with glassmorphism */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
          />
        </div>

        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full"
            >
              <span className="text-primary text-sm font-bold uppercase tracking-wider">
                {content.whyChooseUs?.sectionTitle || 'Nos Avantages'}
              </span>
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {content.whyChooseUs?.sectionSubtitle || 'Pourquoi nous choisir ?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.whyChooseUs?.sectionDescription || 'Des professionnels certifiés à votre service, 7j/7 et 24h/24'}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {(content.whyChooseUs?.items || []).map((feature, index) => {
              const Icon = iconMap[feature.icon] || BoltIcon;
              const colorMap = {
                'text-yellow-500': 'text-yellow-500',
                'text-green-500': 'text-green-500',
                'text-blue-500': 'text-blue-500',
                'text-purple-500': 'text-purple-500',
              };
              const bgMap = {
                'text-yellow-500': 'bg-gradient-to-br from-yellow-100 to-yellow-50',
                'text-green-500': 'bg-gradient-to-br from-green-100 to-green-50',
                'text-blue-500': 'bg-gradient-to-br from-blue-100 to-blue-50',
                'text-purple-500': 'bg-gradient-to-br from-purple-100 to-purple-50',
              };
              const borderMap = {
                'text-yellow-500': 'border-yellow-200',
                'text-green-500': 'border-green-200',
                'text-blue-500': 'border-blue-200',
                'text-purple-500': 'border-purple-200',
              };
              const glowMap = {
                'text-yellow-500': 'from-yellow-400/20',
                'text-green-500': 'from-green-400/20',
                'text-blue-500': 'from-blue-400/20',
                'text-purple-500': 'from-purple-400/20',
              };
              const featureData = {
                icon: Icon,
                title: feature.title,
                desc: feature.description,
                color: feature.color || 'text-blue-500',
                bg: bgMap[feature.color] || 'bg-gradient-to-br from-blue-100 to-blue-50',
                border: borderMap[feature.color] || 'border-blue-200',
                glow: glowMap[feature.color] || 'from-blue-400/20',
              };
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className={`${featureData.bg} backdrop-blur-sm rounded-3xl p-8 border-2 ${featureData.border} shadow-wecasa hover:shadow-wecasa-hover transition-all duration-300 relative overflow-hidden`}>
                    {/* Glow effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${featureData.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                    />
                    
                    <div className="relative z-10 text-center">
                      <motion.div
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-6"
                      >
                        <div className={`${featureData.bg} ${featureData.border} border-2 rounded-2xl p-4 shadow-lg`}>
                          <Icon className={`w-10 h-10 ${featureData.color}`} />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{featureData.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{featureData.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Testimonials Section - Enhanced with 3D effect */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-green-200/10 rounded-full blur-3xl"></div>
        </div>

        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full"
            >
              <span className="text-yellow-600 text-sm font-bold uppercase tracking-wider">
                {content.testimonials?.sectionTitle || 'Témoignages'}
              </span>
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {content.testimonials?.sectionSubtitle || 'Avis clients'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.testimonials?.sectionDescription || 'Ce que nos clients disent de nos services'}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(content.testimonials?.items || []).map((testimonial, index) => {
              const bgColors = [
                'bg-gradient-to-br from-blue-50 to-blue-100',
                'bg-gradient-to-br from-green-50 to-green-100',
                'bg-gradient-to-br from-yellow-50 to-yellow-100',
              ];
              const borderColors = [
                'border-blue-200',
                'border-green-200',
                'border-yellow-200',
              ];
              const testimonialData = {
                ...testimonial,
                bg: bgColors[index % bgColors.length],
                border: borderColors[index % borderColors.length],
              };
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -10,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                className={`${testimonialData.bg} ${testimonialData.border} border-2 rounded-3xl p-8 shadow-wecasa hover:shadow-wecasa-hover transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{testimonialData.avatar}</div>
                    <div className="text-yellow-400 text-xl font-bold">{testimonialData.rating}</div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic text-base">"{testimonialData.text}"</p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-bold text-gray-900">{testimonialData.author}</p>
                    <p className="text-sm text-gray-500">{testimonialData.location}</p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 md:py-20 bg-gray-200 border-b border-gray-300">
        <PageContainer className="py-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {(content.trustBadges?.items || []).map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="text-4xl">{badge.icon}</div>
                <p className="text-sm font-semibold text-gray-700">{badge.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </PageContainer>
      </section>

      {/* Contact CTA Section - Futuristic with glassmorphism */}
      <section className="py-20 md:py-32 bg-gray-200 relative overflow-hidden border-b border-gray-300">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
          />
        </div>

        <PageContainer className="py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center shadow-wecasa-lg max-w-4xl mx-auto border-2 border-white/50 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <PhoneIcon className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
                {content.contact?.title || 'Besoin d\'aide ?'}
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-2xl mx-auto leading-relaxed">
                {content.contact?.subtitle || 'Contactez-nous pour toute question ou demande d\'intervention. Notre équipe est disponible 7j/7 pour vous accompagner.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={content.contact?.ctaLink || '/contact'}>
                    <button 
                      className="bg-gradient-to-r from-primary via-primary-light to-secondary text-white font-bold text-lg px-10 py-4 rounded-full shadow-wecasa-hover hover:shadow-wecasa-lg transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #007BFF 0%, #4DA3FF 50%, #28A745 100%)',
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {content.contact?.ctaText || 'Nous contacter'}
                        <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </button>
                  </Link>
                </motion.div>
                
                {content.contact?.ctaText2 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={content.contact?.ctaLink2 || '/services'}>
                      <button className="bg-white border-2 border-primary text-primary font-bold text-lg px-10 py-4 rounded-full shadow-wecasa hover:shadow-wecasa-hover hover:bg-primary-pastel transition-all duration-300">
                        {content.contact.ctaText2}
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Home;
