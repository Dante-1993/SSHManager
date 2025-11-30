import { Stack } from 'expo-router';
import { SSHProvider } from '@/contexts/SSHContext';

export default function RootLayout() {
  return (
    <SSHProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add-connection" options={{ presentation: 'modal' }} />
      </Stack>
    </SSHProvider>
  );
}
