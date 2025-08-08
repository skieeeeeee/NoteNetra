import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FeatureHero from './components/FeatureHero';
import FeatureNavigation from './components/FeatureNavigation';
import TransactionTrackingSection from './components/TransactionTrackingSection';
import CreditEngineSection from './components/CreditEngineSection';
import InvoicingSection from './components/InvoicingSection';
import StorefrontSection from './components/StorefrontSection';
import TestimonialSection from './components/TestimonialSection';
import ComparisonSection from './components/ComparisonSection';
import CTASection from './components/CTASection';

const FeaturesPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Features - NoteNetra | Smart MSME Solutions';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Discover NoteNetra\'s comprehensive features: AI-powered transaction tracking, credit scoring, automated invoicing, and ONDC integration for MSMEs.');
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto content-spacing pt-6">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <FeatureHero />

        {/* Sticky Feature Navigation */}
        <FeatureNavigation />

        {/* Feature Sections */}
        <TransactionTrackingSection />
        <CreditEngineSection />
        <InvoicingSection />
        <StorefrontSection />

        {/* Social Proof */}
        <TestimonialSection />

        {/* Comparison Analysis */}
        <ComparisonSection />

        {/* Call to Action */}
        <CTASection />
      </main>
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto content-spacing">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold">NoteNetra</span>
              </div>
              <p className="text-background/80 text-sm mb-4">
                Empowering MSMEs with intelligent transaction tracking and credit visibility solutions.
              </p>
              <div className="text-xs text-background/60">
                © {new Date()?.getFullYear()} NoteNetra. All rights reserved.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li><a href="/landing-page" className="hover:text-primary transition-micro">Home</a></li>
                <li><a href="/features-page" className="hover:text-primary transition-micro">Features</a></li>
                <li><a href="/pricing-page" className="hover:text-primary transition-micro">Pricing</a></li>
                <li><a href="/dashboard-demo" className="hover:text-primary transition-micro">Demo</a></li>
                <li><a href="/contact-page" className="hover:text-primary transition-micro">Contact</a></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>Transaction Tracking</li>
                <li>Credit Engine</li>
                <li>Smart Invoicing</li>
                <li>ONDC Integration</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-background/80">
                <div>+91-9876543210</div>
                <div>support@notenetra.com</div>
                <div>Mumbai, Maharashtra</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;