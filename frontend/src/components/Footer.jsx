import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="backdrop-blur-lg border-t border-gray-700/30 mt-auto pt-16 pb-8" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.98) 100%)',
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">BRIBECO</h3>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              Votre partenaire de confiance pour tous vos besoins de dépannage à domicile.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors text-sm">
                Instagram
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-4 text-white">Liens rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-primary-light transition-colors duration-200 inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-light transition-colors duration-200 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/become-partner" className="text-gray-300 hover:text-primary-light transition-colors duration-200 inline-block">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-primary-light transition-colors duration-200 inline-block">
                  Connexion
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-primary-light" />
                <a href="mailto:contact@bribeco.com" className="hover:text-primary-light transition-colors">
                  contact@bribeco.com
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-primary-light" />
                <a href="tel:+33123456789" className="hover:text-primary-light transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-3 text-primary-light" />
                <span>Paris, France</span>
              </li>
              <li className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-3 text-primary-light" />
                <span>Disponible 7j/7, 24h/24</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-700/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BRIBECO. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="#" className="text-gray-400 hover:text-primary-light transition-colors">
                Mentions légales
              </Link>
              <Link to="#" className="text-gray-400 hover:text-primary-light transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="#" className="text-gray-400 hover:text-primary-light transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
