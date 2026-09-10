import React, { useState } from 'react';
import { DoctorLoginScreen } from './DoctorLoginScreen';
import { DoctorDashboard } from './DoctorDashboard';

interface DoctorAppProps {
  onExit: () => void;
}

export const DoctorApp: React.FC<DoctorAppProps> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <DoctorLoginScreen 
        onLoginSuccess={() => setIsAuthenticated(true)} 
        onExit={onExit} 
      />
    );
  }

  return <DoctorDashboard onLogout={() => setIsAuthenticated(false)} />;
};
