import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import PricingPage from './pages/pricing-page';
import ContactPage from './pages/contact-page';
import DashboardDemo from './pages/dashboard-demo';
import FeaturesPage from './pages/features-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import ProtectedRoute from './components/ProtectedRoute';
import BankProtectedRoute from './components/BankProtectedRoute';
import BankLoginPage from './pages/bank-login-page';
import BankDashboardPage from './pages/bank-dashboard-page';
import AccessDeniedPage from './pages/access-denied-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/pricing-page" element={<PricingPage />} />
        <Route path="/contact-page" element={<ContactPage />} />
        <Route path="/dashboard-demo" element={
          <ProtectedRoute>
            <DashboardDemo />
          </ProtectedRoute>
        } />
        <Route path="/features-page" element={<FeaturesPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/bank-login" element={<BankLoginPage />} />
        <Route path="/bank-dashboard" element={
          <BankProtectedRoute>
            <BankDashboardPage />
          </BankProtectedRoute>
        } />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;