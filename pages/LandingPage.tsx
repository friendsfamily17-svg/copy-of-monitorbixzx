
import React, { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { UseCases } from '../components/UseCases';
import { Footer } from '../components/Footer';
import { Auth } from '../components/Auth';
import { DashboardPlanner } from '../components/DashboardPlanner';
import { IndustryType } from '../types';

interface LandingPageProps {
  onLogin: (credentials: { email: string, pass: string }) => Promise<{ success: boolean; message?: string }>;
  onSignup: (details: { companyName: string, email: string, pass: string, services: string[], industry: IndustryType }) => Promise<{ success: boolean; message?: string }>;
}

export default function LandingPage({ onLogin, onSignup }: LandingPageProps): React.ReactElement {
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  const authRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const plannerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (target: string) => {
    console.log(`[Navigation] Moving to: ${target}`);
    if (target === 'login') {
      setAuthTab('login');
      authRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'signup') {
      setAuthTab('signup');
      authRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'use-cases') {
      useCasesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'planner') {
      plannerRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header onNavigate={handleNavigate} />
      <main>
        <div ref={heroRef}><Hero onGetStarted={() => handleNavigate('signup')} /></div>
        <div ref={featuresRef}><Features /></div>
        <div ref={useCasesRef}><UseCases /></div>
        <div ref={plannerRef}><DashboardPlanner /></div>
        <div ref={authRef}>
          <Auth 
            onLogin={onLogin} 
            onSignup={onSignup} 
            initialTab={authTab} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
