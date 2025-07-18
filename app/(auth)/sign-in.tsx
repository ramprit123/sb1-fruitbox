import { useAuth, useOAuth, useSignIn, useClerk } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Redirect, router } from 'expo-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function SignInScreen() {
  const { isSignedIn, userId, sessionId } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signOut } = useClerk();
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
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  if (isSignedIn && !showSessionDialog) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#f0fdf4', '#ffffff', '#f9fafb']}
          style={styles.gradient}
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
              <Text style={styles.subtitle}>You're already signed in</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={styles.sessionContainer}
            >
              <View style={styles.sessionCard}>
                <Text style={styles.sessionTitle}>Active Session Detected</Text>
                <Text style={styles.sessionText}>
                  You're already signed in. Choose an option:
                </Text>
                <View style={styles.sessionButtons}>
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.replace('/(tabs)')}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={() => {
                      setShowSessionDialog(true);
                      handleSignOut();
                    }}
                  >
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
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

        // Check if there's already an active session
        if (
          errorMessage.includes('session') ||
          errorMessage.includes('already signed in')
        ) {
          Alert.alert(
            'Session Already Exists',
            'You are already signed in with another account. What would you like to do?',
            [
              {
                text: 'Continue with current session',
                onPress: () => router.replace('/(tabs)'),
                style: 'default',
              },
              {
                text: 'Sign out and continue',
                onPress: () => handleSignOutAndContinue(),
                style: 'destructive',
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        } else if (errorMessage.includes('verification')) {
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

  const handleSignOutAndContinue = async () => {
    try {
      await signOut();
      // Clear form and try signing in again
      setTimeout(() => {
        onSignInPress();
      }, 500);
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleSessionDialog = () => {
    Alert.alert(
      'Session Management',
      'You have an active session. Choose an option:',
      [
        {
          text: 'Continue with current session',
          onPress: () => router.replace('/(tabs)'),
          style: 'default',
        },
        {
          text: 'Sign out',
          onPress: () => handleSignOut(),
          style: 'destructive',
        },
        {
          text: 'Sign in with different account',
          onPress: () => {
            setShowSessionDialog(true);
            handleSignOut();
          },
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowSessionDialog(false);
      Alert.alert('Success', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const onForgotPasswordPress = () => {
    router.push('/(auth)/forgot-password');
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
      } else if (
        err.message?.includes('session') ||
        err.message?.includes('already signed in')
      ) {
        Alert.alert(
          'Session Already Exists',
          'You are already signed in. Would you like to sign out first?',
          [
            {
              text: 'Continue with current session',
              onPress: () => router.replace('/(tabs)'),
              style: 'default',
            },
            {
              text: 'Sign out and continue',
              onPress: () => handleSignOutAndRetryOAuth('google'),
              style: 'destructive',
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
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
      } else if (
        err.message?.includes('session') ||
        err.message?.includes('already signed in')
      ) {
        Alert.alert(
          'Session Already Exists',
          'You are already signed in. Would you like to sign out first?',
          [
            {
              text: 'Continue with current session',
              onPress: () => router.replace('/(tabs)'),
              style: 'default',
            },
            {
              text: 'Sign out and continue',
              onPress: () => handleSignOutAndRetryOAuth('facebook'),
              style: 'destructive',
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Facebook sign in failed. Please try again.');
      }
    } finally {
      setOauthLoading('');
    }
  };

  const handleSignOutAndRetryOAuth = async (
    provider: 'google' | 'facebook'
  ) => {
    try {
      await signOut();
      setTimeout(() => {
        if (provider === 'google') {
          onGooglePress();
        } else {
          onFacebookPress();
        }
      }, 500);
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
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
                <Image
                  source={require('../../assets/images/icons8-google.png')}
                  style={styles.socialIcon}
                />
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
                <Image
                  source={require('../../assets/images/icons8-facebook.png')}
                  style={styles.socialIcon}
                />
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
    paddingHorizontal: wp('6%'),
  },
  header: {
    alignItems: 'center',
    paddingTop: hp('8%'),
    paddingBottom: hp('5%'),
  },
  logoContainer: {
    marginBottom: hp('3%'),
  },
  logo: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: wp('8%'),
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: hp('4%'),
  },
  inputContainer: {
    marginBottom: hp('2.5%'),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  inputIcon: {
    marginRight: wp('3%'),
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#111827',
    paddingVertical: hp('2%'),
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center',
      includeFontPadding: false,
    }),
  },
  eyeIcon: {
    padding: wp('1%'),
  },
  signInButton: {
    borderRadius: wp('4%'),
    marginTop: hp('1%'),
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
    paddingVertical: hp('2.2%'),
    borderRadius: wp('4%'),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginRight: wp('2%'),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('4%'),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    fontSize: wp('3.5%'),
    paddingHorizontal: wp('4%'),
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('4%'),
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    marginHorizontal: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  socialButtonText: {
    fontSize: wp('5%'),
    marginRight: wp('2%'),
  },
  socialIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('2%'),
  },
  socialButtonLabel: {
    color: '#374151',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  linkContainer: {
    alignItems: 'center',
    paddingBottom: hp('5%'),
  },
  linkText: {
    color: '#6b7280',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  linkAccent: {
    color: '#22c55e',
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  forgotPasswordText: {
    color: '#6b7280',
    fontSize: wp('3.5%'),
    textDecorationLine: 'underline',
  },
  sessionContainer: {
    marginBottom: hp('3%'),
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sessionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  sessionText: {
    fontSize: wp('3.5%'),
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  sessionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  signOutButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
});
