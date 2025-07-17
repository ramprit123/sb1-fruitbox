import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function IndexScreen() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
