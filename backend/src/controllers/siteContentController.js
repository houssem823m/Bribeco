const SiteContent = require('../models/SiteContent');

// @desc    Get site content by page
// @route   GET /api/site-content/:page
// @access  Public
const getSiteContent = async (req, res) => {
  try {
    const { page } = req.params;
    
    let siteContent = await SiteContent.findOne({ page });
    
    // Si aucun contenu n'existe, retourner un contenu par défaut
    if (!siteContent) {
      siteContent = {
        page,
        content: getDefaultContent(page),
      };
    }
    
    res.status(200).json({
      success: true,
      data: siteContent,
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message,
    });
  }
};

// @desc    Update site content
// @route   PUT /api/admin/site-content/:page
// @access  Admin only
const updateSiteContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu est requis',
      });
    }
    
    let siteContent = await SiteContent.findOne({ page });
    
    if (siteContent) {
      // Mettre à jour le contenu existant
      siteContent.content = content;
      siteContent.lastUpdated = new Date();
      siteContent.lastUpdatedBy = req.user._id;
      await siteContent.save();
    } else {
      // Créer un nouveau contenu
      siteContent = await SiteContent.create({
        page,
        content,
        lastUpdatedBy: req.user._id,
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: siteContent,
    });
  } catch (error) {
    console.error('Error updating site content:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message,
    });
  }
};

// Fonction pour obtenir le contenu par défaut
const getDefaultContent = (page) => {
  if (page === 'home') {
    return {
      hero: {
        title: 'Dépannage rapide 7j/7',
        subtitle: 'Plomberie, Électricité, Serrurerie – Intervention rapide et professionnelle',
        ctaText: 'Réserver mon intervention',
        ctaLink: '/services',
        image: 'https://www.iris-st.org/metiers/electricien/',
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
            variant: 'blue',
            image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&auto=format&q=80',
            link: '/services',
          },
          {
            title: 'Électricité',
            subtitle: 'et dépannage',
            description: 'Professionnels certifiés pour vos installations électriques',
            variant: 'green',
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format&q=80',
            link: '/services',
          },
          {
            title: 'Serrurerie',
            subtitle: 'et sécurité',
            description: 'Déblocage, installation et réparation de serrures',
            variant: 'yellow',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format&q=80',
            link: '/services',
          },
        ],
      },
      professionals: {
        sectionTitle: 'Nos Professionnels',
        sectionSubtitle: 'Des experts à votre service',
        sectionDescription: 'Des artisans qualifiés et expérimentés pour tous vos besoins',
        items: [
          {
            image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&auto=format&q=80',
            title: 'Plombier Professionnel',
            description: 'Expert en plomberie pour toutes vos installations et réparations',
          },
          {
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format&q=80',
            title: 'Électricien Certifié',
            description: 'Installations électriques conformes aux normes en vigueur',
          },
          {
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format&q=80',
            title: 'Serrurier Expert',
            description: 'Déblocage, installation et réparation de serrures 24/7',
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
    };
  }
  
  return {};
};

module.exports = {
  getSiteContent,
  updateSiteContent,
};

