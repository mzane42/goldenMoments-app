import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' }
      }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}