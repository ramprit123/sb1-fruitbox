import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface AuthState {
  loading: boolean;
  emailAddress: string;
  password: string;
  showPassword: boolean;
  code: string;
  pendingVerification: boolean;
}

export const useAuthState = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    loading: false,
    emailAddress: '',
    password: '',
    showPassword: false,
    code: '',
    pendingVerification: false,
  });

  const updateState = (updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const showError = (message: string) => {
    Alert.alert('Error', message);
  };

  const navigateToTabs = () => {
    router.replace('/(tabs)');
  };

  return {
    state,
    updateState,
    showError,
    navigateToTabs,
  };
};
