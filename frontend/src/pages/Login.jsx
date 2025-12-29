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

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const canonical = absoluteUrl('/login');
  const alternateLocales = buildAlternateLocales(canonical);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setServerError('');
    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      showToast('Connexion réussie !', 'success');
      navigate('/profile');
    } else {
      showToast(result.message || 'Identifiants incorrects', 'error');
      setServerError(result.message || 'Identifiants incorrects.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary-pastel via-beige-light to-blue-50 min-h-screen py-section">
      <PageContainer className="max-w-lg">
        <SEO
          title="Connexion — BRIBECO"
          description="Connectez-vous à votre espace client BRIBECO pour suivre vos interventions."
          path="/login"
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
              <SectionTitle title="Connexion" align="left" className="mb-8" />
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="vous@example.com"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Mot de passe
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  placeholder="********"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" variant="primary" className="w-full justify-center text-lg py-4" isLoading={isSubmitting}>
                  Se connecter
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
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-gray-600 text-center mt-8"
            >
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Créez un compte
              </Link>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
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

export default Login;
