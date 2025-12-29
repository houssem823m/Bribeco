import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import { useEffect, useState } from 'react';
import { getSiteContent } from '../api/admin';

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState({
    title: 'Dépannage rapide 7j/7',
    subtitle: 'Plomberie, Électricité, Serrurerie – Intervention rapide et professionnelle',
    ctaText: 'Réserver mon intervention',
    ctaLink: '/services',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
  });

  useEffect(() => {
    loadHeroContent();
    
    // Recharger le contenu quand la fenêtre reprend le focus (après modification dans l'admin)
    const handleFocus = () => {
      loadHeroContent();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Recharger périodiquement (toutes les 5 secondes) pour détecter les changements
    const interval = setInterval(() => {
      loadHeroContent();
    }, 5000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const loadHeroContent = async () => {
    try {
      const result = await getSiteContent('home');
      console.log('=== Hero Content Load ===');
      console.log('Full API Result:', JSON.stringify(result, null, 2));
      if (result.success && result.data?.content?.hero) {
        const newContent = result.data.content.hero;
        console.log('Hero content from API:', newContent);
        console.log('Image URL from API:', newContent.image);
        console.log('Current state image:', heroContent.image);
        // Toujours mettre à jour avec le nouveau contenu
        setHeroContent(newContent);
      } else {
        console.warn('No hero content found. Result:', result);
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        {heroContent.image && (
          <img
            key={`hero-bg-img-${heroContent.image || 'default'}`}
            src={heroContent.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face'}
            alt="Background"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              console.error('Background image failed to load. URL was:', heroContent.image);
              e.target.style.display = 'none';
            }}
          />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Background decoration */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-normal drop-shadow-md">
              {heroContent.subtitle}
            </p>
            
            {/* CTA Button - BRIBECO gradient (blue to green) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to={heroContent.ctaLink || '/services'}>
                <button 
                  className="bg-gradient-to-r from-primary via-primary-light to-secondary text-white font-bold text-lg px-8 py-4 rounded-full shadow-wecasa-hover hover:shadow-wecasa-lg hover:scale-105 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #007BFF 0%, #4DA3FF 50%, #28A745 100%)',
                  }}
                >
                  {heroContent.ctaText}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

