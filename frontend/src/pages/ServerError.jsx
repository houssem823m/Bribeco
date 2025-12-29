import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';

const ServerError = () => {
  return (
    <PageContainer className="min-h-[60vh] flex items-center">
      <SEO title="Erreur interne — BRIBECO" description="Un problème technique est survenu. Merci de réessayer plus tard." />
      <Card className="w-full text-center">
        <SectionTitle title="500 — Quelque chose s'est mal passé" description="Nous travaillons à résoudre ce problème. Veuillez réessayer dans quelques instants." />
        <div className="flex flex-wrap gap-3 justify-center">
          <Button as="a" href="/" variant="primary" className="justify-center">
            Retour à l'accueil
          </Button>
          <Button as="a" href="/contact" variant="ghost">
            Contactez-nous
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ServerError;

