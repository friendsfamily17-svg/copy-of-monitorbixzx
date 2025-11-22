
import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { UseCases } from '../components/UseCases';
import { Footer } from '../components/Footer';
import { Auth } from '../components/Auth';
import { DashboardPlanner } from '../components/DashboardPlanner';

interface LandingPageProps {
  onLogin: (credentials: { email: string, pass: string }) => Promise<{ success: boolean; message?: string }>;
  onSignup: (details: { companyName: string, email: string, pass: string, services: string[] }) => Promise<{ success: boolean; message?: string }>;
}

export default function LandingPage({ onLogin, onSignup }: LandingPageProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <UseCases />
        <DashboardPlanner />
        <Auth onLogin={onLogin} onSignup={onSignup} />
      </main>
      <Footer />
    </div>
  );
}
