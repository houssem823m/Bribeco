import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ReservationDetail = lazy(() => import('./pages/ReservationDetail'));
const BecomePartner = lazy(() => import('./pages/BecomePartner'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminPartnerRequests = lazy(() => import('./pages/admin/AdminPartnerRequests'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminPartnerDetail = lazy(() => import('./pages/admin/AdminPartnerDetail'));
const AdminPartnerMissions = lazy(() => import('./pages/admin/AdminPartnerMissions'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminServiceRequests = lazy(() => import('./pages/admin/AdminServiceRequests'));
const AdminSiteContent = lazy(() => import('./pages/admin/AdminSiteContent'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
            <Suspense
              fallback={
                <div className="py-20">
                  <Loader message="Chargement de la page..." />
                </div>
              }
            >
              <Routes>
              {/* Admin Routes with AdminLayout (no regular Layout wrapper) */}
              <Route
                path="/admin"
                element={
                  <ErrorBoundary>
                    <AdminLayout />
                  </ErrorBoundary>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="site-content" element={<AdminSiteContent />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="faqs" element={<AdminFaqs />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="partner-requests" element={<AdminPartnerRequests />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="partners/:id" element={<AdminPartnerDetail />} />
                <Route path="partners/:id/missions" element={<AdminPartnerMissions />} />
                <Route path="service-requests" element={<AdminServiceRequests />} />
                <Route path="payments" element={<AdminPayments />} />
              </Route>

              {/* Regular Routes with Layout wrapper */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/services"
                element={
                  <Layout>
                    <Services />
                  </Layout>
                }
              />
                <Route
                  path="/services/:id"
                  element={
                  <Layout>
                    <ErrorBoundary>
                      <ServiceDetail />
                    </ErrorBoundary>
                  </Layout>
                  }
                />
              <Route
                path="/login"
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />
              <Route
                path="/register"
                element={
                  <Layout>
                    <Register />
                  </Layout>
                }
              />
                <Route
                  path="/profile"
                  element={
                  <Layout>
                    <ErrorBoundary>
                      <Profile />
                    </ErrorBoundary>
                  </Layout>
                  }
                />
                <Route
                  path="/reservations/:id"
                  element={
                  <Layout>
                    <ErrorBoundary>
                      <ReservationDetail />
                    </ErrorBoundary>
                  </Layout>
                  }
                />
              <Route
                path="/become-partner"
                element={
                  <Layout>
                    <BecomePartner />
                  </Layout>
                }
              />
                <Route
                  path="/partner/dashboard"
                  element={
                  <Layout>
                    <ErrorBoundary>
                      <PartnerDashboard />
                    </ErrorBoundary>
                  </Layout>
                  }
                />
                <Route
                path="/contact"
                  element={
                  <Layout>
                    <Contact />
                  </Layout>
                  }
                />
                <Route
                path="/500"
                  element={
                  <Layout>
                    <ServerError />
                  </Layout>
                  }
                />
                <Route
                path="*"
                  element={
                  <Layout>
                    <NotFound />
                  </Layout>
                  }
                />
              </Routes>
            </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
