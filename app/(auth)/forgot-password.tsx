import { useSignIn } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { ArrowLeft, ArrowRight, Mail, CheckCircle } from 'lucide-react-native';
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
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');

  const onSendResetEmail = async () => {
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

    setLoading(true);
    try {
      const firstFactor = await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress.trim(),
      });

      if (firstFactor) {
        setEmailSent(true);
        setStep('reset');
        Alert.alert(
          'Email Sent',
          'Please check your email for a reset code and enter it below along with your new password.'
        );
      }
    } catch (err: any) {
      console.error('Reset email error:', JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert(
          'Error',
          'Unable to send reset email. Please check your email address and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!isLoaded) return;

    // Validation
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the reset code from your email.');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete') {
        Alert.alert(
          'Success',
          'Password reset successfully! Please sign in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Password reset failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Reset password error:', JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        if (errorMessage.includes('Invalid')) {
          Alert.alert(
            'Error',
            'Invalid reset code. Please check and try again.'
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      } else {
        Alert.alert('Error', 'Password reset failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.logo}>
            <Text style={styles.logoText}>🔒</Text>
          </LinearGradient>
        </View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a reset code
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={styles.formContainer}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={wp('5%')} color="#6b7280" style={styles.inputIcon} />
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

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={onSendResetEmail}
          disabled={loading}
        >
          <LinearGradient
            colors={['#22c55e', '#16a34a']}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Text>
            {!loading && <ArrowRight size={wp('5%')} color="#ffffff" />}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

  const renderResetStep = () => (
    <>
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.logo}>
            <CheckCircle size={wp('8%')} color="#ffffff" />
          </LinearGradient>
        </View>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Enter the code from your email and create a new password
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={styles.formContainer}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={wp('5%')} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="Reset code"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              autoCapitalize="none"
              maxLength={6}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔑</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={onResetPassword}
          disabled={loading}
        >
          <LinearGradient
            colors={['#22c55e', '#16a34a']}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Text>
            {!loading && <CheckCircle size={wp('5%')} color="#ffffff" />}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setStep('email');
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
          }}
        >
          <Text style={styles.secondaryButtonText}>
            Didn't receive code? Send again
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

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
              entering={FadeInUp.delay(100).springify()}
              style={styles.backButton}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButtonTouchable}
              >
                <ArrowLeft size={wp('6%')} color="#6b7280" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </Animated.View>

            {step === 'email' ? renderEmailStep() : renderResetStep()}

            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={styles.linkContainer}
            >
              <Link href="/(auth)/sign-in">
                <Text style={styles.linkText}>
                  Remember your password?{' '}
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
    paddingHorizontal: wp('6%'),
  },
  backButton: {
    paddingTop: hp('6%'),
    marginBottom: hp('2%'),
  },
  backButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    color: '#6b7280',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    paddingTop: hp('4%'),
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
    paddingHorizontal: wp('4%'),
    lineHeight: wp('6%'),
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
    fontSize: wp('5%'),
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
  primaryButton: {
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
  primaryButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginRight: wp('2%'),
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: wp('3.5%'),
    textDecorationLine: 'underline',
  },
  linkContainer: {
    alignItems: 'center',
    paddingBottom: hp('5%'),
    marginTop: 'auto',
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
});
