
import React from 'react';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { useAuth } from './hooks/useAuth';
import { Loader } from './components/Loader';

export default function App(): React.ReactElement {
  const { activeCompany, login, signup, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
        <Loader />
      </div>
    );
  }
  
  if (activeCompany) {
    return <Dashboard company={activeCompany} onLogout={logout} />;
  }

  return <LandingPage onLogin={login} onSignup={signup} />;
}
