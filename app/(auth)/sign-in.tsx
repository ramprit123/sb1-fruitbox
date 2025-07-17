import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Link, Redirect, router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: googleOAuth } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: facebookOAuth } = useOAuth({
    strategy: 'oauth_facebook',
  });

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');

  // If user is already signed in, redirect to tabs
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Basic validation
    if (!emailAddress.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)');
      } else {
        // Handle different sign-in statuses
        console.error(
          'Sign-in attempt:',
          JSON.stringify(signInAttempt, null, 2)
        );
        Alert.alert(
          'Error',
          'Sign in failed. Please check your credentials and try again.'
        );
      }
    } catch (err: any) {
      console.error('Sign-in error:', JSON.stringify(err, null, 2));

      // Handle specific error types
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        if (errorMessage.includes('verification')) {
          Alert.alert(
            'Email Not Verified',
            'Please verify your email address before signing in. Check your inbox for a verification email.',
            [{ text: 'OK', style: 'default' }]
          );
        } else if (errorMessage.includes('Incorrect')) {
          Alert.alert(
            'Error',
            'Incorrect email or password. Please try again.'
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      } else {
        Alert.alert('Error', 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordPress = () => {
    Alert.alert(
      'Reset Password',
      'Please contact support or visit our website to reset your password.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const onGooglePress = async () => {
    try {
      setOauthLoading('google');
      const { createdSessionId, setActive } = await googleOAuth();
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      // Handle the specific "Another web browser is already open" error
      if (err.message?.includes('Another web browser is already open')) {
        Alert.alert(
          'Browser Already Open',
          'Please close any open browser windows and try again.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', 'Google sign in failed. Please try again.');
      }
    } finally {
      setOauthLoading('');
    }
  };

  const onFacebookPress = async () => {
    try {
      setOauthLoading('facebook');
      const { createdSessionId, setActive } = await facebookOAuth();
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Facebook OAuth error:', err);
      // Handle the specific "Another web browser is already open" error
      if (err.message?.includes('Another web browser is already open')) {
        Alert.alert(
          'Browser Already Open',
          'Please close any open browser windows and try again.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', 'Facebook sign in failed. Please try again.');
      }
    } finally {
      setOauthLoading('');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0fdf4', '#ffffff', '#f9fafb']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={styles.header}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#22c55e', '#16a34a']}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>🍎</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue shopping</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              style={styles.formContainer}
            >
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="Email address"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.signInButton, loading && styles.buttonDisabled]}
                onPress={onSignInPress}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#22c55e', '#16a34a']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.signInButtonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                  {!loading && <ArrowRight size={20} color="#ffffff" />}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={onForgotPasswordPress}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              style={styles.dividerContainer}
            >
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(800).springify()}
              style={styles.socialContainer}
            >
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  oauthLoading === 'google' && styles.buttonDisabled,
                ]}
                onPress={onGooglePress}
                disabled={oauthLoading !== ''}
              >
                <Text style={styles.socialButtonText}>🔍</Text>
                <Text style={styles.socialButtonLabel}>
                  {oauthLoading === 'google' ? 'Loading...' : 'Google'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  oauthLoading === 'facebook' && styles.buttonDisabled,
                ]}
                onPress={onFacebookPress}
                disabled={oauthLoading !== ''}
              >
                <Text style={styles.socialButtonText}>👥</Text>
                <Text style={styles.socialButtonLabel}>
                  {oauthLoading === 'facebook' ? 'Loading...' : 'Facebook'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(1000).springify()}
              style={styles.linkContainer}
            >
              <Link href="/sign-up">
                <Text style={styles.linkText}>
                  Don't have an account?{' '}
                  <Text style={styles.linkAccent}>Sign up</Text>
                </Text>
              </Link>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  signInButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    fontSize: 14,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  socialButtonText: {
    fontSize: 20,
    marginRight: 8,
  },
  socialButtonLabel: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  linkContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  linkText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  linkAccent: {
    color: '#22c55e',
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#6b7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
