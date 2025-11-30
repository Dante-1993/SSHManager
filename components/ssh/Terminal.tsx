import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { SSHSession } from '@/contexts/SSHContext';

interface TerminalProps {
  session: SSHSession;
  onSendCommand: (command: string) => void;
}

export function Terminal({ session, onSendCommand }: TerminalProps) {
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = theme.colors[colorScheme];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [session.output]);

  const handleSubmit = () => {
    if (input.trim()) {
      onSendCommand(input);
      setInput('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.terminal }]}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.output}
        contentContainerStyle={styles.outputContent}
      >
        {session.output?.map((line, index) => (
          <Text 
            key={index} 
            style={[
              styles.outputLine, 
              { color: line.endsWith('$') ? colors.primary : colors.terminalText }
            ]}
          >
            {line}
          </Text>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <Text style={[styles.prompt, { color: colors.primary }]}>$</Text>
        <TextInput
          style={[styles.input, { color: colors.terminalText }]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          placeholder="Enter command..."
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  output: {
    flex: 1,
  },
  outputContent: {
    padding: theme.spacing.md,
  },
  outputLine: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
  },
  prompt: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes.md,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes.md,
    padding: 0,
  },
});
