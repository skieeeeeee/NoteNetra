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
        <Route path="/dashboard-demo" element={<DashboardDemo />} />
        <Route path="/features-page" element={<FeaturesPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;