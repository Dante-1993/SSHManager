import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSSH } from '@/hooks/useSSH';
import { ConnectionCard } from '@/components/ssh/ConnectionCard';
import { Terminal } from '@/components/ssh/Terminal';
import { FileManager } from '@/components/ssh/FileManager';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = theme.colors[colorScheme];
  const { connections, sessions, activeSessionId, createSession, closeSession, setActiveSession, sendCommand, deleteConnection } = useSSH();

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleConnect = (connectionId: string, type: 'terminal' | 'sftp') => {
    createSession(connectionId, type);
  };

  const handleDeleteConnection = (id: string, name: string) => {
    Alert.alert(
      'Delete Connection',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteConnection(id) }
      ]
    );
  };

  if (sessions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>SSH Manager</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/add-connection')}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {connections.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="computer" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No connections yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add your first SSH connection to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={connections}
            renderItem={({ item }) => (
              <ConnectionCard
                connection={item}
                onConnect={(type) => handleConnect(item.id, type)}
                onEdit={() => {}}
                onDelete={() => handleDeleteConnection(item.id, item.name)}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingTop: theme.spacing.md }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        <FlatList
          horizontal
          data={sessions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                item.id === activeSessionId && { backgroundColor: colors.background }
              ]}
              onPress={() => setActiveSession(item.id)}
            >
              <MaterialIcons 
                name={item.type === 'terminal' ? 'terminal' : 'folder'} 
                size={16} 
                color={item.id === activeSessionId ? colors.primary : colors.textSecondary}
              />
              <Text 
                style={[
                  styles.tabText,
                  { color: item.id === activeSessionId ? colors.text : colors.textSecondary }
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => closeSession(item.id)}>
                <MaterialIcons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity 
          style={styles.newTabButton}
          onPress={() => router.push('/')}
        >
          <MaterialIcons name="home" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {activeSession && (
        activeSession.type === 'terminal' ? (
          <Terminal
            session={activeSession}
            onSendCommand={(cmd) => sendCommand(activeSession.id, cmd)}
          />
        ) : (
          <FileManager
            currentPath={activeSession.currentPath || '/'}
            onNavigate={() => {}}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    maxWidth: 150,
  },
  tabText: {
    fontSize: theme.fontSizes.sm,
    flex: 1,
  },
  newTabButton: {
    padding: theme.spacing.md,
  },
});
