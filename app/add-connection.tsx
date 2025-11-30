import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, useColorScheme, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSSH } from '@/hooks/useSSH';
import { theme } from '@/constants/theme';

const COLORS = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#FF9800'];

export default function AddConnectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = theme.colors[colorScheme];
  const { addConnection } = useSSH();

  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('');
  const [authType, setAuthType] = useState<'password' | 'key'>('password');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSave = () => {
    if (!name || !host || !username) {
      return;
    }

    addConnection({
      name,
      host,
      port: parseInt(port) || 22,
      username,
      authType,
      password: authType === 'password' ? password : undefined,
      privateKey: authType === 'key' ? privateKey : undefined,
      color: selectedColor,
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>New Connection</Text>
        <TouchableOpacity onPress={handleSave}>
          <MaterialIcons name="check" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.text }]}>Connection Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="My Server"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Host</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={host}
          onChangeText={setHost}
          placeholder="192.168.1.100 or example.com"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text }]}>Port</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={port}
          onChangeText={setPort}
          placeholder="22"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: colors.text }]}>Username</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={username}
          onChangeText={setUsername}
          placeholder="root"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
        />

        <View style={styles.authTypeContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Authentication</Text>
          <View style={styles.authSwitch}>
            <Text style={[styles.authLabel, { color: colors.textSecondary }]}>
              {authType === 'password' ? 'Password' : 'SSH Key'}
            </Text>
            <Switch
              value={authType === 'key'}
              onValueChange={(value) => setAuthType(value ? 'key' : 'password')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {authType === 'password' ? (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </>
        ) : (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Private Key</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={privateKey}
              onChangeText={setPrivateKey}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
            />
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>Color</Text>
        <View style={styles.colorPicker}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <MaterialIcons name="check" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  input: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    fontSize: theme.fontSizes.md,
  },
  textArea: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.mono,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  authTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  authSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  authLabel: {
    fontSize: theme.fontSizes.sm,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});
