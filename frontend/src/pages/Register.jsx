import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const canonical = absoluteUrl('/register');
  const alternateLocales = buildAlternateLocales(canonical);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (formData.password !== formData.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
    setServerError('');
    setIsSubmitting(true);
    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    };
    const result = await register(payload);
    if (result.success) {
      showToast('Compte créé avec succès !', 'success');
      navigate('/profile');
    } else {
      const message = result.message || "L'inscription a échoué";
      showToast(message, 'error');
      setServerError(message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-primary-pastel to-beige-light min-h-screen py-section">
      <PageContainer className="max-w-2xl">
        <SEO
          title="Inscription — BRIBECO"
          description="Créez votre compte BRIBECO pour gérer vos réservations et paiements."
          path="/register"
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-wecasa border-2 border-primary/20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SectionTitle title="Créer un compte" align="left" className="mb-8" />
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="first_name">
                    Prénom
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                    placeholder="Camille"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="last_name">
                    Nom
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="email">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="vous@example.com"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="phone">
                  Téléphone (optionnel)
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="+33 6 12 34 56 78"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="password">
                    Mot de passe
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                    placeholder="********"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="confirmPassword">
                    Confirmez le mot de passe
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                    placeholder="********"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" variant="primary" className="w-full justify-center text-lg py-4" isLoading={isSubmitting}>
                  Créer mon compte
                </Button>
              </motion.div>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 text-center"
                >
                  {serverError}
                </motion.p>
              )}
            </motion.form>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-sm text-gray-600 text-center mt-8"
            >
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-10 pt-8 border-t border-gray-200 text-center"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Besoin d'aide ?</h3>
              <p className="text-gray-600 mb-6">
                Contactez-nous pour toute question ou demande d'intervention
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button as={Link} to="/contact" variant="primary-pastel" className="w-full">
                  Nous contacter
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </PageContainer>
    </div>
  );
};

export default Register;
