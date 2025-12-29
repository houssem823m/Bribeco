import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { absoluteUrl, buildAlternateLocales } from '../utils/seo';
import { createPartnerRequest } from '../api/partnerRequests';
import { getCategories } from '../api/services';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';

const BecomePartner = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    service_type: '',
    experience_years: '',
    message: '',
    cv_file: null,
  });
  const [fileError, setFileError] = useState('');

  const canonical = absoluteUrl('/become-partner');
  const alternateLocales = buildAlternateLocales(canonical);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getCategories();
        if (result.success) {
          setCategories(result.data || []);
        } else {
          setError(result.message || 'Impossible de charger les catégories');
        }
      } catch (err) {
        setError('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Le fichier est trop volumineux. Taille maximale : 5MB');
        e.target.value = '';
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Format de fichier non supporté. Formats acceptés : PDF, DOC, DOCX');
        e.target.value = '';
        return;
      }

      setFormData((prev) => ({ ...prev, cv_file: file }));
      setFileError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.service_type) {
      setError('Veuillez sélectionner un type de service');
      setSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('service_type', formData.service_type);
      if (formData.experience_years) {
        submitData.append('experience_years', parseInt(formData.experience_years));
      }
      if (formData.message) {
        submitData.append('message', formData.message);
      }
      if (formData.cv_file) {
        submitData.append('cv_file', formData.cv_file);
      }

      const result = await createPartnerRequest(submitData);

      if (result.success) {
        showToast('Votre demande de partenariat a été envoyée avec succès !', 'success');
        navigate('/profile');
      } else {
        setError(result.message || 'Erreur lors de l\'envoi de la demande');
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de la demande');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="bg-gradient-to-br from-green-50 via-primary-pastel to-beige-light min-h-screen py-section">
        <SEO
          title="Devenir Partenaire — BRIBECO"
          description="Rejoignez BRIBECO en tant que partenaire et proposez vos services de dépannage."
          path="/become-partner"
          canonical={canonical}
          alternateLocales={alternateLocales}
        />
        <PageContainer className="max-w-3xl">
          <SectionTitle
            title="Devenir Partenaire"
            description="Rejoignez notre réseau de professionnels qualifiés et développez votre activité."
            align="left"
          />

          {loading && <Loader message="Chargement du formulaire..." />}

          {error && !loading && (
            <ErrorBlock
              message={error}
              onRetry={() => {
                setError(null);
                window.location.reload();
              }}
            />
          )}

          {!loading && !error && (
            <Card className="shadow-wecasa">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations utilisateur */}
                <div className="bg-primary-pastel rounded-wecasa-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Vos informations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Nom</label>
                      <p className="text-gray-700 text-lg">{user?.last_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Prénom</label>
                      <p className="text-gray-700 text-lg">{user?.first_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                      <p className="text-gray-700 text-lg">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                      <p className="text-gray-700 text-lg">{user?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  {!user?.phone && (
                    <p className="text-sm text-gray-600 mt-4">
                      💡 Vous pouvez ajouter votre numéro de téléphone dans votre{' '}
                      <a href="/profile" className="text-primary hover:underline font-semibold">
                        profil
                      </a>
                    </p>
                  )}
                </div>

                {/* Type de service */}
                <div>
                  <label htmlFor="service_type" className="block text-sm font-semibold text-gray-900 mb-2">
                    Type de service <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  >
                    <option value="">Sélectionnez un type de service</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {categories.length === 0 && (
                      <>
                        <option value="Plomberie">Plomberie</option>
                        <option value="Électricité">Électricité</option>
                        <option value="Serrurerie">Serrurerie</option>
                        <option value="Chauffage">Chauffage</option>
                        <option value="Climatisation">Climatisation</option>
                        <option value="Menuiserie">Menuiserie</option>
                        <option value="Peinture">Peinture</option>
                      </>
                    )}
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Années d'expérience */}
                <div>
                  <label htmlFor="experience_years" className="block text-sm font-semibold text-gray-900 mb-2">
                    Années d'expérience
                  </label>
                  <input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ex: 5"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
                  />
                </div>

                {/* Upload CV */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    CV (PDF, DOC, DOCX) - Optionnel
                  </label>
                  <input
                    type="file"
                    name="cv_file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full text-sm text-gray-700
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-pill file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-light file:cursor-pointer
                      file:shadow-wecasa"
                  />
                  {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
                  {formData.cv_file && !fileError && (
                    <p className="text-sm text-green-600 mt-2">✓ Fichier sélectionné : {formData.cv_file.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Taille maximale : 5MB</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    maxLength={1000}
                    placeholder="Parlez-nous de votre expérience, de vos compétences, de votre motivation à rejoindre BRIBECO..."
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-wecasa focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.message.length}/1000 caractères
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-wecasa p-5">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 justify-center text-lg py-4"
                    isLoading={submitting}
                    disabled={submitting || !formData.service_type}
                  >
                    Envoyer la demande
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 justify-center text-lg py-4"
                    onClick={() => navigate('/profile')}
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                </div>

                {/* Info */}
                <div className="bg-primary-pastel border-2 border-primary rounded-wecasa-lg p-6 mt-8">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    <strong>💡 Information :</strong> Votre demande sera examinée par notre équipe. 
                    Vous recevrez une notification par email une fois que votre demande aura été traitée. 
                    Le délai de traitement est généralement de 2 à 5 jours ouvrés.
                  </p>
        </div>
              </form>
            </Card>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
};

export default BecomePartner;
