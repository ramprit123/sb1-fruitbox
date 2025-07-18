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
  Image,
} from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, Redirect, router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow: googleOAuth } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: facebookOAuth } = useOAuth({
    strategy: 'oauth_facebook',
  });

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already signed in, redirect to tabs
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'Sign up failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'Verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await googleOAuth();
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      Alert.alert('Error', 'Google sign up failed. Please try again.');
    }
  };

  const onFacebookPress = async () => {
    try {
      const { createdSessionId, setActive } = await facebookOAuth();
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Facebook OAuth error:', err);
      Alert.alert('Error', 'Facebook sign up failed. Please try again.');
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
            {!pendingVerification ? (
              <>
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
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>
                    Join us for fresh groceries
                  </Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInUp.delay(400).springify()}
                  style={styles.formContainer}
                >
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Mail
                        size={20}
                        color="#6b7280"
                        style={styles.inputIcon}
                      />
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
                      <Lock
                        size={20}
                        color="#6b7280"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create password"
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
                    style={[
                      styles.signUpButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={onSignUpPress}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={['#22c55e', '#16a34a']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.signUpButtonText}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Text>
                      {!loading && <ArrowRight size={20} color="#ffffff" />}
                    </LinearGradient>
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
                    style={styles.socialButton}
                    onPress={onGooglePress}
                  >
                    <Image
                      source={require('../../assets/images/icons8-google.png')}
                      style={styles.socialIcon}
                    />
                    <Text style={styles.socialButtonLabel}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={onFacebookPress}
                  >
                    <Image
                      source={require('../../assets/images/icons8-facebook.png')}
                      style={styles.socialIcon}
                    />
                    <Text style={styles.socialButtonLabel}>Facebook</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <Animated.View
                entering={FadeInUp.springify()}
                style={styles.verificationContainer}
              >
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.logo}
                    >
                      <Shield size={32} color="#ffffff" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.title}>Verify Email</Text>
                  <Text style={styles.subtitle}>
                    Enter the verification code sent to{'\n'}
                    {emailAddress}
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[styles.input, styles.codeInput]}
                        value={code}
                        onChangeText={setCode}
                        placeholder="Enter verification code"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        autoComplete="one-time-code"
                        textAlign="center"
                        maxLength={6}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.verifyButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={onVerifyPress}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.verifyButtonText}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                      </Text>
                      {!loading && <Shield size={20} color="#ffffff" />}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            <Animated.View
              entering={FadeInDown.delay(1000).springify()}
              style={styles.linkContainer}
            >
              <Link href="/sign-in">
                <Text style={styles.linkText}>
                  Already have an account?{' '}
                  <Text style={styles.linkAccent}>Sign in</Text>
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
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  verificationContainer: {
    flex: 1,
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
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center',
      includeFontPadding: false,
    }),
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    color: '#111827',
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center',
      includeFontPadding: false,
    }),
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#3b82f6',
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
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  verifyButtonText: {
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
  socialIcon: {
    width: 20,
    height: 20,
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
});
