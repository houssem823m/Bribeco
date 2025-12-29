import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <PageContainer className="min-h-[60vh] flex items-center">
      <SEO title="Page introuvable — BRIBECO" description="La page demandée n'existe pas ou a été déplacée." />
      <Card className="w-full text-center">
        <SectionTitle title="404 — Page introuvable" description="La page que vous recherchez n'existe pas." />
        <div className="flex flex-wrap gap-3 justify-center">
          <Button as={Link} to="/" variant="primary" className="justify-center">
            Retour à l'accueil
          </Button>
          <Button as={Link} to="/contact" variant="ghost">
            Nous contacter
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default NotFound;

