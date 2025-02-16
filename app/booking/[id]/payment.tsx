import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../../lib/utils';

type PaymentMethod = 'card' | 'apple-pay';

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple-pay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(`/booking/${id}/confirmation`);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = 278;
  const upgrades = 16;
  const taxes = (subtotal + upgrades) * 0.2;
  const total = subtotal + upgrades + taxes;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.title}>Paiement</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>
          
          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'apple-pay' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('apple-pay')}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
            <Text style={styles.paymentOptionText}>Apple Pay</Text>
            <View style={styles.paymentOptionCheck}>
              {paymentMethod === 'apple-pay' && (
                <Ionicons name="checkmark" size={20} color="#000" />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons name="card-outline" size={24} color="#000" />
            <Text style={styles.paymentOptionText}>Carte bancaire</Text>
            <View style={styles.paymentOptionCheck}>
              {paymentMethod === 'card' && (
                <Ionicons name="checkmark" size={20} color="#000" />
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé de la réservation</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Chambre Supérieure</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Upgrades</Text>
            <Text style={styles.summaryValue}>{formatCurrency(upgrades)}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Taxes</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxes)}</Text>
          </View>

          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>
          <Text style={styles.termsText}>
            En effectuant cette réservation, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions Générales</Text> et notre{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.payButtonText}>Traitement en cours...</Text>
          ) : (
            <Text style={styles.payButtonText}>
              Payer {formatCurrency(total)}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#000',
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  payButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});