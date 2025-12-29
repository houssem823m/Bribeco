import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import PageContainer from '../../components/PageContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';
import { getSiteContent, updateSiteContent } from '../../api/admin';
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const AdminSiteContent = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  // État pour le contenu du site avec structure complète
  const [content, setContent] = useState({
    hero: {
      title: 'Dépannage rapide 7j/7',
      subtitle: 'Plomberie, Électricité, Serrurerie – Intervention rapide et professionnelle',
      ctaText: 'Réserver mon intervention',
      ctaLink: '/services',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
    },
    services: {
      sectionTitle: 'Nos Services',
      sectionSubtitle: 'Solutions pour tous vos besoins',
      sectionDescription: 'Des professionnels qualifiés à votre service, 7j/7 et 24h/24',
      items: [
        {
          title: 'Plomberie',
          subtitle: 'et installation',
          description: 'Intervention rapide pour tous vos besoins en plomberie',
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&auto=format&q=80',
          link: '/services',
          variant: 'blue',
        },
        {
          title: 'Électricité',
          subtitle: 'et dépannage',
          description: 'Professionnels certifiés pour vos installations électriques',
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format&q=80',
          link: '/services',
          variant: 'green',
        },
        {
          title: 'Serrurerie',
          subtitle: 'et sécurité',
          description: 'Déblocage, installation et réparation de serrures',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format&q=80',
          link: '/services',
          variant: 'yellow',
        },
      ],
    },
    professionals: {
      sectionTitle: 'Nos Professionnels',
      sectionSubtitle: 'Des experts à votre service',
      sectionDescription: 'Des artisans qualifiés et expérimentés pour tous vos besoins',
      items: [
        {
          title: 'Plombier Professionnel',
          description: 'Expert en plomberie pour toutes vos installations et réparations',
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&auto=format&q=80',
        },
        {
          title: 'Électricien Certifié',
          description: 'Installations électriques conformes aux normes en vigueur',
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format&q=80',
        },
        {
          title: 'Serrurier Expert',
          description: 'Déblocage, installation et réparation de serrures 24/7',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format&q=80',
        },
      ],
    },
    howItWorks: {
      sectionTitle: 'Comment ça marche',
      sectionSubtitle: 'En 4 étapes simples',
      sectionDescription: 'Un processus fluide et transparent pour votre tranquillité d\'esprit',
      sectionImage: '',
      items: [
        {
          step: '01',
          title: 'Réservez en ligne',
          description: 'Choisissez votre service et remplissez le formulaire en quelques minutes',
          image: '',
          icon: 'PhoneIcon',
          color: 'from-blue-500 to-blue-600',
        },
        {
          step: '02',
          title: 'Confirmation rapide',
          description: 'Recevez une confirmation immédiate et un technicien vous contacte sous 1h',
          image: '',
          icon: 'CheckBadgeIcon',
          color: 'from-green-500 to-green-600',
        },
        {
          step: '03',
          title: 'Intervention professionnelle',
          description: 'Un expert certifié intervient à votre domicile avec tout le matériel nécessaire',
          image: '',
          icon: 'WrenchScrewdriverIcon',
          color: 'from-orange-500 to-orange-600',
        },
        {
          step: '04',
          title: 'Paiement sécurisé',
          description: 'Payez en ligne de manière sécurisée après validation de l\'intervention',
          image: '',
          icon: 'ShieldCheckIcon',
          color: 'from-purple-500 to-purple-600',
        },
      ],
    },
    whyChooseUs: {
      sectionTitle: 'Nos Avantages',
      sectionSubtitle: 'Pourquoi nous choisir ?',
      sectionDescription: 'Des professionnels certifiés à votre service, 7j/7 et 24h/24',
      sectionImage: '',
      items: [
        {
          title: 'Intervention rapide',
          description: 'Disponible 7j/7, 24h/24',
          image: '',
          icon: 'BoltIcon',
          color: 'text-yellow-500',
        },
        {
          title: 'Professionnels certifiés',
          description: 'Artisans qualifiés et vérifiés',
          image: '',
          icon: 'CheckBadgeIcon',
          color: 'text-green-500',
        },
        {
          title: 'Prix transparents',
          description: 'Devis gratuit, pas de surprise',
          image: '',
          icon: 'CurrencyDollarIcon',
          color: 'text-blue-500',
        },
        {
          title: 'Garantie incluse',
          description: 'Tous nos travaux sont garantis',
          image: '',
          icon: 'ShieldCheckIcon',
          color: 'text-purple-500',
        },
      ],
    },
    testimonials: {
      sectionTitle: 'Témoignages',
      sectionSubtitle: 'Avis clients',
      sectionDescription: 'Ce que nos clients disent de nos services',
      sectionImage: '',
      items: [
        {
          rating: '★★★★★',
          text: "Intervention très rapide et professionnelle. Le plombier était à l'heure et a résolu le problème efficacement. Service impeccable !",
          author: 'Marie D.',
          location: 'Paris 15e',
          avatar: '👩‍💼',
          image: '',
        },
        {
          rating: '★★★★★',
          text: "Excellent service d'électricité. Installation propre et conforme aux normes. L'électricien était très professionnel et a tout expliqué. Je recommande vivement !",
          author: 'Jean P.',
          location: 'Lyon',
          avatar: '👨‍🔧',
          image: '',
        },
        {
          rating: '★★★★★',
          text: 'Déblocage de porte en urgence la nuit. Service impeccable, intervention en moins d\'une heure. Le serrurier était très sympa et efficace. Merci BRIBECO !',
          author: 'Sophie L.',
          location: 'Marseille',
          avatar: '👩‍💻',
          image: '',
        },
      ],
    },
    trustBadges: {
      sectionImage: '',
      items: [
        { text: 'Certifié Qualibat', icon: '🏆', image: '' },
        { text: 'Assurance décennale', icon: '🛡️', image: '' },
        { text: 'Paiement sécurisé', icon: '💳', image: '' },
        { text: 'Satisfaction garantie', icon: '✅', image: '' },
      ],
    },
    contact: {
      title: 'Besoin d\'aide ?',
      subtitle: 'Contactez-nous pour toute question ou demande d\'intervention. Notre équipe est disponible 7j/7 pour vous accompagner.',
      backgroundImage: '',
      illustrationImage: '',
      ctaText: 'Nous contacter',
      ctaLink: '/contact',
      ctaText2: 'Voir nos services',
      ctaLink2: '/services',
    },
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const result = await getSiteContent('home');
    if (result.success && result.data?.content) {
      // Fusionner avec les valeurs par défaut pour s'assurer que tous les champs existent
      setContent(prevContent => ({
        ...prevContent,
        ...result.data.content,
        hero: {
          ...prevContent.hero,
          ...result.data.content.hero,
        },
        services: {
          ...prevContent.services,
          ...result.data.content.services,
        },
        professionals: {
          ...prevContent.professionals,
          ...result.data.content.professionals,
        },
        howItWorks: {
          ...prevContent.howItWorks,
          ...result.data.content.howItWorks,
        },
        whyChooseUs: {
          ...prevContent.whyChooseUs,
          ...result.data.content.whyChooseUs,
        },
        testimonials: {
          ...prevContent.testimonials,
          ...result.data.content.testimonials,
        },
        trustBadges: {
          ...prevContent.trustBadges,
          ...result.data.content.trustBadges,
        },
        contact: {
          ...prevContent.contact,
          ...result.data.content.contact,
        },
      }));
    }
    setLoading(false);
  };

  const getNestedValue = (obj, path) => {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current[key] === undefined) return '';
      current = current[key];
    }
    return current;
  };

  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Gérer les tableaux (ex: features.0.title)
      if (!isNaN(parseInt(key))) {
        const index = parseInt(key);
        if (!Array.isArray(current)) {
          return obj; // Erreur de structure
        }
        if (!current[index]) {
          current[index] = {};
        }
        current = current[index];
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleEdit = (path, currentValue) => {
    setEditingField(path);
    setEditValue(currentValue);
  };

  const handleSave = async (path) => {
    const newContent = setNestedValue(content, path, editValue);
    setContent(newContent);
    setEditingField(null);
    setSaving(true);
    
    const result = await updateSiteContent('home', newContent);
    if (result.success) {
      showToast('Contenu mis à jour avec succès', 'success');
    } else {
      showToast(result.message || 'Erreur lors de la sauvegarde', 'error');
      // Recharger le contenu en cas d'erreur
      loadContent();
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderEditableField = (label, path, value, multiline = false, type = 'text') => {
    const isEditing = editingField === path;
    const displayValue = value || '';
    const isEmpty = !value || value === '';
    
    return (
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
        {isEditing ? (
          <div className="flex gap-2">
            {multiline ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                rows="3"
              />
            ) : (
              <input
                type={type === 'image' ? 'url' : type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder={type === 'url' || type === 'image' ? 'https://...' : type === 'text' ? 'Entrez le texte...' : ''}
              />
            )}
            <button
              onClick={() => handleSave(path)}
              disabled={saving}
              className="px-4 py-3.5 bg-green-600/80 hover:bg-green-500 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50"
              aria-label="Enregistrer"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-3.5 bg-red-600/80 hover:bg-red-500 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
              aria-label="Annuler"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
            {type === 'url' ? (
              <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <span className="truncate">{displayValue}</span>
              </a>
            ) : type === 'image' ? (
              <div className="flex-1 flex items-center gap-4">
                {displayValue && displayValue !== '' ? (
                  <>
                    <img src={displayValue} alt="Preview" className="w-20 h-20 object-cover rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span className="text-gray-200 truncate">{displayValue}</span>
                  </>
                ) : (
                  <span className="text-gray-400 italic">Aucune image - Cliquez pour ajouter</span>
                )}
              </div>
            ) : (
              <p className={`text-gray-200 flex-1 ${isEmpty ? 'italic text-gray-400' : ''}`}>
                {displayValue || '(vide - Cliquez pour ajouter)'}
              </p>
            )}
            <button
              onClick={() => handleEdit(path, value || '')}
              className="ml-4 p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-xl transition-colors"
              aria-label="Modifier"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const sections = [
    { id: 'hero', label: 'Section Hero', icon: DocumentTextIcon },
    { id: 'services', label: 'Services', icon: PhotoIcon },
    { id: 'professionals', label: 'Professionnels', icon: PhotoIcon },
    { id: 'howItWorks', label: 'Comment ça marche', icon: DocumentTextIcon },
    { id: 'whyChooseUs', label: 'Avantages', icon: DocumentTextIcon },
    { id: 'testimonials', label: 'Témoignages', icon: DocumentTextIcon },
    { id: 'trustBadges', label: 'Badges de confiance', icon: DocumentTextIcon },
    { id: 'contact', label: 'Contact', icon: DocumentTextIcon },
  ];

  if (loading) {
    return (
      <PageContainer>
        <Loader message="Chargement du contenu..." />
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PageContainer>
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Contenu du Site
          </h1>
          <p className="text-lg text-gray-400">
            Modifiez le contenu affiché sur le site web
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-white">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-600/80 text-white font-semibold shadow-lg shadow-blue-500/25'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              {activeSection === 'hero' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Section Hero</h2>
                  {renderEditableField('Titre principal', 'hero.title', content.hero?.title)}
                  {renderEditableField('Sous-titre', 'hero.subtitle', content.hero?.subtitle, true)}
                  {renderEditableField('Texte du bouton CTA', 'hero.ctaText', content.hero?.ctaText)}
                  {renderEditableField('Lien du bouton CTA', 'hero.ctaLink', content.hero?.ctaLink, false, 'url')}
                  {renderEditableField('Image URL (technicien)', 'hero.image', content.hero?.image, false, 'image')}
                </div>
              )}

              {activeSection === 'services' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Services</h2>
                  {renderEditableField('Titre de section', 'services.sectionTitle', content.services?.sectionTitle)}
                  {renderEditableField('Sous-titre de section', 'services.sectionSubtitle', content.services?.sectionSubtitle)}
                  {renderEditableField('Description de section', 'services.sectionDescription', content.services?.sectionDescription, true)}
                  <div className="space-y-6 mt-6">
                    {(content.services?.items || []).map((service, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Service {index + 1}</h3>
                        {renderEditableField('Titre', `services.items.${index}.title`, service.title)}
                        {renderEditableField('Sous-titre', `services.items.${index}.subtitle`, service.subtitle)}
                        {renderEditableField('Description', `services.items.${index}.description`, service.description, true)}
                        {renderEditableField('Image URL', `services.items.${index}.image`, service.image, false, 'image')}
                        {renderEditableField('Lien', `services.items.${index}.link`, service.link, false, 'url')}
                        {renderEditableField('Variant (blue/green/yellow)', `services.items.${index}.variant`, service.variant)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'professionals' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Professionnels</h2>
                  {renderEditableField('Titre de section', 'professionals.sectionTitle', content.professionals?.sectionTitle)}
                  {renderEditableField('Sous-titre de section', 'professionals.sectionSubtitle', content.professionals?.sectionSubtitle)}
                  {renderEditableField('Description de section', 'professionals.sectionDescription', content.professionals?.sectionDescription, true)}
                  <div className="space-y-6 mt-6">
                    {content.professionals?.items?.map((professional, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Professionnel {index + 1}</h3>
                        {renderEditableField('Titre', `professionals.items.${index}.title`, professional.title)}
                        {renderEditableField('Description', `professionals.items.${index}.description`, professional.description, true)}
                        {renderEditableField('Image URL', `professionals.items.${index}.image`, professional.image, false, 'image')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'howItWorks' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Comment ça marche</h2>
                  {renderEditableField('Titre de section', 'howItWorks.sectionTitle', content.howItWorks?.sectionTitle)}
                  {renderEditableField('Sous-titre de section', 'howItWorks.sectionSubtitle', content.howItWorks?.sectionSubtitle)}
                  {renderEditableField('Description de section', 'howItWorks.sectionDescription', content.howItWorks?.sectionDescription, true)}
                  {renderEditableField('Image de fond de section', 'howItWorks.sectionImage', content.howItWorks?.sectionImage, false, 'image')}
                  <div className="space-y-6 mt-6">
                    {(content.howItWorks?.items || []).map((step, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Étape {index + 1}</h3>
                        {renderEditableField('Numéro', `howItWorks.items.${index}.step`, step.step)}
                        {renderEditableField('Titre', `howItWorks.items.${index}.title`, step.title)}
                        {renderEditableField('Description', `howItWorks.items.${index}.description`, step.description, true)}
                        {renderEditableField('Image URL', `howItWorks.items.${index}.image`, step.image, false, 'image')}
                        {renderEditableField('Icône (PhoneIcon, CheckBadgeIcon, etc.)', `howItWorks.items.${index}.icon`, step.icon)}
                        {renderEditableField('Couleur (from-blue-500 to-blue-600)', `howItWorks.items.${index}.color`, step.color)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'whyChooseUs' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Avantages</h2>
                  {renderEditableField('Titre de section', 'whyChooseUs.sectionTitle', content.whyChooseUs?.sectionTitle)}
                  {renderEditableField('Sous-titre de section', 'whyChooseUs.sectionSubtitle', content.whyChooseUs?.sectionSubtitle)}
                  {renderEditableField('Description de section', 'whyChooseUs.sectionDescription', content.whyChooseUs?.sectionDescription, true)}
                  {renderEditableField('Image de fond de section', 'whyChooseUs.sectionImage', content.whyChooseUs?.sectionImage, false, 'image')}
                  <div className="space-y-6 mt-6">
                    {(content.whyChooseUs?.items || []).map((feature, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Avantage {index + 1}</h3>
                        {renderEditableField('Titre', `whyChooseUs.items.${index}.title`, feature.title)}
                        {renderEditableField('Description', `whyChooseUs.items.${index}.description`, feature.description)}
                        {renderEditableField('Image URL', `whyChooseUs.items.${index}.image`, feature.image, false, 'image')}
                        {renderEditableField('Icône (BoltIcon, CheckBadgeIcon, etc.)', `whyChooseUs.items.${index}.icon`, feature.icon)}
                        {renderEditableField('Couleur (text-yellow-500, text-green-500, etc.)', `whyChooseUs.items.${index}.color`, feature.color)}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {activeSection === 'testimonials' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Témoignages</h2>
                  {renderEditableField('Titre de section', 'testimonials.sectionTitle', content.testimonials?.sectionTitle)}
                  {renderEditableField('Sous-titre de section', 'testimonials.sectionSubtitle', content.testimonials?.sectionSubtitle)}
                  {renderEditableField('Description de section', 'testimonials.sectionDescription', content.testimonials?.sectionDescription, true)}
                  {renderEditableField('Image de fond de section', 'testimonials.sectionImage', content.testimonials?.sectionImage, false, 'image')}
                  <div className="space-y-6 mt-6">
                    {content.testimonials?.items?.map((testimonial, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Témoignage {index + 1}</h3>
                        {renderEditableField('Note', `testimonials.items.${index}.rating`, testimonial.rating)}
                        {renderEditableField('Texte', `testimonials.items.${index}.text`, testimonial.text, true)}
                        {renderEditableField('Auteur', `testimonials.items.${index}.author`, testimonial.author)}
                        {renderEditableField('Localisation', `testimonials.items.${index}.location`, testimonial.location)}
                        {renderEditableField('Avatar (emoji ou URL image)', `testimonials.items.${index}.avatar`, testimonial.avatar)}
                        {renderEditableField('Image URL (photo)', `testimonials.items.${index}.image`, testimonial.image, false, 'image')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'trustBadges' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Badges de confiance</h2>
                  {renderEditableField('Image de fond de section', 'trustBadges.sectionImage', content.trustBadges?.sectionImage, false, 'image')}
                  <div className="space-y-6 mt-6">
                    {content.trustBadges?.items?.map((badge, index) => (
                      <div key={index} className="p-5 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <h3 className="font-semibold mb-4 text-white">Badge {index + 1}</h3>
                        {renderEditableField('Texte', `trustBadges.items.${index}.text`, badge.text)}
                        {renderEditableField('Icône (emoji)', `trustBadges.items.${index}.icon`, badge.icon)}
                        {renderEditableField('Image URL', `trustBadges.items.${index}.image`, badge.image, false, 'image')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Section Contact</h2>
                  {renderEditableField('Titre', 'contact.title', content.contact?.title)}
                  {renderEditableField('Sous-titre', 'contact.subtitle', content.contact?.subtitle, true)}
                  {renderEditableField('Image de fond', 'contact.backgroundImage', content.contact?.backgroundImage, false, 'image')}
                  {renderEditableField('Image illustration', 'contact.illustrationImage', content.contact?.illustrationImage, false, 'image')}
                  {renderEditableField('Texte du bouton 1', 'contact.ctaText', content.contact?.ctaText)}
                  {renderEditableField('Lien du bouton 1', 'contact.ctaLink', content.contact?.ctaLink, false, 'url')}
                  {renderEditableField('Texte du bouton 2', 'contact.ctaText2', content.contact?.ctaText2)}
                  {renderEditableField('Lien du bouton 2', 'contact.ctaLink2', content.contact?.ctaLink2, false, 'url')}
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default AdminSiteContent;
