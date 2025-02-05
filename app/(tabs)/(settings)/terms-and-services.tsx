import { ScrollView, Text, View, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';

export default function TermsAndServices() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen options={{ title: 'Terms of Service' }} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.date}>Effective Date: February 05, 2025</Text>

          <Text style={styles.paragraph}>
            Welcome to Workout Mate! These Terms of Service ("Terms") govern your use of the Workout Mate mobile application ("App"), provided by Workout Mate ("we," "our," or "us"). By accessing or using the App, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the App.
          </Text>

          <Text style={styles.heading}>1. Use of the App</Text>
          <Text style={styles.paragraph}>
            Workout Mate is designed to assist users with workout tracking and fitness guidance. You agree to use the App only for lawful purposes and in accordance with these Terms.
          </Text>

          <Text style={styles.heading}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 13 years old to use Workout Mate. By using the App, you represent and warrant that you meet this age requirement.
          </Text>

          <Text style={styles.heading}>3. Account Registration</Text>
          <Text style={styles.paragraph}>
            To access certain features, you may be required to create an account. You agree to provide accurate and complete information and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials.
          </Text>

          <Text style={styles.heading}>4. User Conduct</Text>
          <Text style={styles.paragraph}>You agree not to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Use the App for any unlawful purpose.</Text>
            <Text style={styles.bulletItem}>• Engage in any activity that could harm, disable, or overburden the App.</Text>
            <Text style={styles.bulletItem}>• Attempt to gain unauthorized access to any part of the App.</Text>
          </View>

          <Text style={styles.heading}>5. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content, features, and functionality of Workout Mate, including text, graphics, logos, and software, are the exclusive property of Workout Mate or its licensors and are protected by intellectual property laws.
          </Text>

          <Text style={styles.heading}>6. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            The App is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the App will be uninterrupted, secure, or error-free.
          </Text>

          <Text style={styles.heading}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the App.
          </Text>

          <Text style={styles.heading}>8. Changes to the Terms</Text>
          <Text style={styles.paragraph}>
            We may modify these Terms at any time. Changes will be effective upon posting the updated Terms within the App. Your continued use of the App after changes constitutes acceptance of the new Terms.
          </Text>

          <Text style={styles.heading}>9. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your access to the App at our discretion, without notice, for conduct that violates these Terms or is otherwise harmful to other users or us.
          </Text>

          <Text style={styles.heading}>10. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of Albania, without regard to its conflict of law principles.
          </Text>

          <Text style={styles.heading}>11. Contact Us</Text>
          <Text style={styles.paragraph}>If you have any questions about these Terms, please contact us:</Text>
          <Text style={styles.bulletItem}>• By email: ijon04kushta@gmail.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#171717',
  },
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#fff',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#fff',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 16,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 8,
    paddingLeft: 8,
  },
});