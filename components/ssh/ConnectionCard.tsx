import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SSHConnection } from '@/contexts/SSHContext';
import { theme } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface ConnectionCardProps {
  connection: SSHConnection;
  onConnect: (type: 'terminal' | 'sftp') => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ConnectionCard({ connection, onConnect, onEdit, onDelete }: ConnectionCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = theme.colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.colorBar, { backgroundColor: connection.color }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{connection.name}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <MaterialIcons name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.info}>
          <MaterialIcons name="computer" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {connection.username}@{connection.host}:{connection.port}
          </Text>
        </View>

        <View style={styles.info}>
          <MaterialIcons name="vpn-key" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {connection.authType === 'password' ? 'Password' : 'SSH Key'}
          </Text>
        </View>

        {connection.lastConnected && (
          <View style={styles.info}>
            <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {new Date(connection.lastConnected).toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.connectButton, { backgroundColor: colors.primary }]}
            onPress={() => onConnect('terminal')}
          >
            <MaterialIcons name="terminal" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>SSH</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.connectButton, { backgroundColor: colors.accent }]}
            onPress={() => onConnect('sftp')}
          >
            <MaterialIcons name="folder" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>SFTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  colorBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
  },
  buttons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
  },
});
