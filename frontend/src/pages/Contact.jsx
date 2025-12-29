import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const canonical = absoluteUrl('/contact');
  const alternateLocales = buildAlternateLocales(canonical);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-primary-pastel to-beige-light min-h-screen py-section">
      <PageContainer className="max-w-5xl">
        <SEO
          title="Contact — BRIBECO"
          description="Contactez l'équipe BRIBECO pour toute question ou demande d'intervention."
          path="/contact"
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe vous répond 7j/7 pour planifier votre intervention.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Besoin d'aide ?</h3>
          <p className="text-xl text-gray-700">
            Contactez-nous pour toute question ou demande d'intervention
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-wecasa border-2 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary-pastel to-blue-50 rounded-wecasa-lg p-6"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Coordonnées</h3>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-gray-700 text-lg">123 Rue de l'Exemple, 75000 Paris</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-gray-700 text-lg">+33 1 23 45 67 89</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <EnvelopeIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-gray-700 text-lg">contact@bribeco.com</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="text-sm font-semibold text-gray-900 block mb-2">Nom complet</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="Votre nom"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="text-sm font-semibold text-gray-900 block mb-2">Email</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="Votre email"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label className="text-sm font-semibold text-gray-900 block mb-2">Message</label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  rows="5"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></motion.textarea>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="primary" className="w-full justify-center text-lg py-4">
                  Envoyer
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </Card>
        </motion.div>
      </PageContainer>
    </div>
  );
};

export default Contact;
