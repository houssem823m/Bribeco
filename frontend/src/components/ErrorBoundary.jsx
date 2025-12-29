import { Component } from 'react';
import Button from './Button';
import Card from './Card';
import SectionTitle from './SectionTitle';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error boundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12">
          <Card>
            <SectionTitle title="Une erreur est survenue" description="Merci de réessayer ou de revenir à l'accueil." />
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={this.handleReset} variant="primary">Réessayer</Button>
              <Button as="a" href="/" variant="ghost">
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

