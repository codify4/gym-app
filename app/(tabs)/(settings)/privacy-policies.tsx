import { ScrollView, Text, View, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Privacy Policy' }} />
            
            <View style={styles.content}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.date}>Last updated: February 05, 2025</Text>

                <Text style={styles.paragraph}>
                    This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                </Text>

                <Text style={styles.paragraph}>
                    We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
                </Text>

                <Text style={styles.heading}>Interpretation and Definitions</Text>
                <Text style={styles.subheading}>Interpretation</Text>
                <Text style={styles.paragraph}>
                    The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                </Text>

                <Text style={styles.subheading}>Definitions</Text>
                <Text style={styles.paragraph}>For the purposes of this Privacy Policy:</Text>

                <View style={styles.bulletList}>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Account</Text> means a unique account created for You to access our Service or parts of our Service.</Text>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Application</Text> refers to Workout Mate, the software program provided by the Company.</Text>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Company</Text> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Workout Mate.</Text>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Country</Text> refers to: Albania</Text>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Device</Text> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</Text>
                    <Text style={styles.bulletItem}>• <Text style={styles.bold}>Personal Data</Text> is any information that relates to an identified or identifiable individual.</Text>
                </View>

                <Text style={styles.heading}>Contact Us</Text>
                <Text style={styles.paragraph}>If you have any questions about this Privacy Policy, You can contact us:</Text>
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
    color: '#fff',
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});