import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key';
  password?: string;
  privateKey?: string;
  color: string;
  lastConnected?: string;
}

export interface SSHSession {
  id: string;
  connectionId: string;
  name: string;
  type: 'terminal' | 'sftp';
  isActive: boolean;
  output?: string[];
  currentPath?: string;
}

interface SSHContextType {
  connections: SSHConnection[];
  sessions: SSHSession[];
  activeSessionId: string | null;
  addConnection: (connection: Omit<SSHConnection, 'id'>) => void;
  updateConnection: (id: string, connection: Partial<SSHConnection>) => void;
  deleteConnection: (id: string) => void;
  createSession: (connectionId: string, type: 'terminal' | 'sftp') => void;
  closeSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
  sendCommand: (sessionId: string, command: string) => void;
}

const STORAGE_KEY = '@ssh_connections';

export const SSHContext = createContext<SSHContextType | undefined>(undefined);

export function SSHProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<SSHConnection[]>([]);
  const [sessions, setSessions] = useState<SSHSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  useEffect(() => {
    saveConnections();
  }, [connections]);

  const loadConnections = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setConnections(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const saveConnections = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
    } catch (error) {
      console.error('Failed to save connections:', error);
    }
  };

  const addConnection = (connection: Omit<SSHConnection, 'id'>) => {
    const newConnection: SSHConnection = {
      ...connection,
      id: Date.now().toString(),
    };
    setConnections([...connections, newConnection]);
  };

  const updateConnection = (id: string, updates: Partial<SSHConnection>) => {
    setConnections(connections.map(conn => 
      conn.id === id ? { ...conn, ...updates } : conn
    ));
  };

  const deleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
    setSessions(sessions.filter(session => session.connectionId !== id));
  };

  const createSession = (connectionId: string, type: 'terminal' | 'sftp') => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    const sessionId = `${connectionId}_${Date.now()}`;
    const newSession: SSHSession = {
      id: sessionId,
      connectionId,
      name: connection.name,
      type,
      isActive: true,
      output: type === 'terminal' ? [`Connected to ${connection.host}`, `${connection.username}@${connection.host}:~$`] : [],
      currentPath: type === 'sftp' ? '/home/' + connection.username : undefined,
    };

    setSessions([...sessions, newSession]);
    setActiveSessionId(sessionId);
    updateConnection(connectionId, { lastConnected: new Date().toISOString() });
  };

  const closeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const setActiveSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const sendCommand = (sessionId: string, command: string) => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId && session.type === 'terminal') {
        const newOutput = [...(session.output || []), command];
        
        // Simulate command responses
        if (command.startsWith('ls')) {
          newOutput.push('Documents  Downloads  Music  Pictures  Videos');
        } else if (command.startsWith('pwd')) {
          newOutput.push('/home/user');
        } else if (command.startsWith('cd')) {
          newOutput.push('');
        } else if (command === 'clear') {
          return { ...session, output: [] };
        } else {
          newOutput.push(`bash: ${command.split(' ')[0]}: command not found`);
        }
        
        newOutput.push('user@host:~$');
        return { ...session, output: newOutput };
      }
      return session;
    }));
  };

  return (
    <SSHContext.Provider value={{
      connections,
      sessions,
      activeSessionId,
      addConnection,
      updateConnection,
      deleteConnection,
      createSession,
      closeSession,
      setActiveSession,
      sendCommand,
    }}>
      {children}
    </SSHContext.Provider>
  );
}
