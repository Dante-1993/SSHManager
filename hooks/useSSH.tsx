import { useContext } from 'react';
import { SSHContext } from '@/contexts/SSHContext';

export function useSSH() {
  const context = useContext(SSHContext);
  if (!context) {
    throw new Error('useSSH must be used within SSHProvider');
  }
  return context;
}
