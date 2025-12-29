require('../src/config/env');
const Category = require('../src/models/Category');
const Service = require('../src/models/Service');
const { connectDB, disconnectDB } = require('../src/config/db');

// Sample categories data
const categoriesData = [
  {
    name: 'Plomberie',
    slug: 'plomberie',
    description: 'Services de plomberie professionnels pour tous vos besoins',
  },
  {
    name: 'Électricité',
    slug: 'electricite',
    description: 'Installations et réparations électriques par des professionnels qualifiés',
  },
  {
    name: 'Serrurerie',
    slug: 'serrurerie',
    description: 'Services de serrurerie et dépannage 24/7',
  },
];

// Sample services data (will be linked to categories after they're created)
const servicesData = [
  {
    title: 'Réparation de fuite',
    description: 'Réparation rapide de toutes les fuites d\'eau, robinets, tuyaux',
    price_range: '50€ - 150€',
    includes: [
      'Diagnostic complet',
      'Réparation de la fuite',
      'Nettoyage',
      'Garantie 3 mois',
    ],
    images: [
      'https://example.com/images/plomberie-fuite.jpg',
    ],
  },
  {
    title: 'Installation sanitaire',
    description: 'Installation de sanitaires (lavabo, douche, WC)',
    price_range: '200€ - 500€',
    includes: [
      'Installation professionnelle',
      'Fournitures de base',
      'Nettoyage final',
      'Garantie 1 an',
    ],
    images: [
      'https://example.com/images/plomberie-installation.jpg',
    ],
  },
  {
    title: 'Installation électrique',
    description: 'Installation et mise aux normes de votre installation électrique',
    price_range: '300€ - 800€',
    includes: [
      'Diagnostic sécurité',
      'Installation conforme',
      'Certificat de conformité',
      'Garantie 2 ans',
    ],
    images: [
      'https://example.com/images/electricite-installation.jpg',
    ],
  },
  {
    title: 'Dépannage électrique',
    description: 'Intervention rapide pour tous vos problèmes électriques',
    price_range: '80€ - 200€',
    includes: [
      'Diagnostic rapide',
      'Réparation immédiate',
      'Remplacement si nécessaire',
      'Garantie 6 mois',
    ],
    images: [
      'https://example.com/images/electricite-depannage.jpg',
    ],
  },
  {
    title: 'Changement de serrure',
    description: 'Remplacement de serrure standard ou sécurisée',
    price_range: '100€ - 300€',
    includes: [
      'Serrure de qualité',
      'Installation professionnelle',
      'Remise de clés',
      'Garantie 1 an',
    ],
    images: [
      'https://example.com/images/serrurerie-changement.jpg',
    ],
  },
  {
    title: 'Déblocage de porte',
    description: 'Ouverture de porte bloquée, clés perdues ou cassées',
    price_range: '60€ - 150€',
    includes: [
      'Intervention rapide',
      'Ouverture sans casse',
      'Remplacement si nécessaire',
      'Disponible 24/7',
    ],
    images: [
      'https://example.com/images/serrurerie-deblocage.jpg',
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Starting database seeding...\n');

    // Clear existing data
    await Category.deleteMany({});
    await Service.deleteMany({});
    console.log('✓ Cleared existing categories and services\n');

    // Insert categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`✓ Created ${categories.length} categories:`);
    categories.forEach((cat) => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    console.log('');

    // Map category slugs to IDs for services
    const categoryMap = {
      'plomberie': categories[0]._id,
      'electricite': categories[1]._id,
      'serrurerie': categories[2]._id,
    };

    // Assign categories to services
    const servicesWithCategories = servicesData.map((service, index) => {
      let categoryId;
      if (index < 2) {
        // First 2 services: Plomberie
        categoryId = categoryMap['plomberie'];
      } else if (index < 4) {
        // Next 2 services: Électricité
        categoryId = categoryMap['electricite'];
      } else {
        // Last 2 services: Serrurerie
        categoryId = categoryMap['serrurerie'];
      }

      return {
        ...service,
        category: categoryId,
      };
    });

    // Insert services
    const services = await Service.insertMany(servicesWithCategories);
    console.log(`✓ Created ${services.length} services:`);
    services.forEach((service) => {
      const categoryName = categories.find(cat => cat._id.equals(service.category))?.name || 'Unknown';
      console.log(`  - ${service.title} (${categoryName})`);
    });
    console.log('');

    console.log('✅ Database seeding completed successfully!');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Services: ${services.length}`);
    
    // Close connection
    await disconnectDB();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

// Run seed
seedDatabase();

