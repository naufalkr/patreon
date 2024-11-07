<template>
  <v-container fluid class="d-flex justify-center align-center" style="background-color: #1c1c1c; min-height: 100vh; color: white;">
    <v-row class="ma-0 pa-5" justify="center" align="start">
      
      <!-- Payment Details Section -->
      <v-col cols="12" md="7" class="pa-4">
        <v-card class="pa-6" flat style="background-color: white;">
          <h2 class="font-weight-bold mb-3">Payment details</h2>
          <p class="mb-6">Pay the set price or you can choose to pay more.</p>
          
          <!-- Payment Amount -->
          <div class="mb-4">
            <h3 class="font-weight-bold mb-1">Payment amount</h3>
            <v-row align="center">
              <v-col cols="12" md="12">
                <v-text-field type="number" label="$" v-model="amount" outlined></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Payment Method -->
          <div class="mb-4">
            <h3 class="font-weight-bold">Payment method</h3>
            <v-btn-toggle v-model="paymentMethod" class="mt-2">
              <v-btn value="card" outlined color="grey" class="py-4" style="color: white;">Card</v-btn>
              <v-btn value="paypal" outlined color="grey" class="py-4" style="color: white;">PayPal</v-btn>
            </v-btn-toggle>
          </div>

          <!-- Card Details Form (Shown if Card is selected) -->
          <v-form v-if="paymentMethod === 'card'">
            <v-text-field label="Name on card" outlined></v-text-field>
            <v-text-field label="Card number" outlined append-icon="mdi-credit-card"></v-text-field>
            
            <v-row>
              <v-col cols="6">
                <v-text-field label="MM / YY" outlined></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="CVV" outlined></v-text-field>
              </v-col>
            </v-row>

            <v-text-field label="Billing postcode" outlined></v-text-field>
            
            <v-select label="Country" :items="['Indonesia']" outlined></v-select>
          </v-form>

          <!-- Subscription Information -->
          <p class="mt-6" v-if="paymentMethod === 'card'">
            You’ll pay <strong>${{ totalAmount.toFixed(2) }}</strong> monthly on the 7th.
            <br>
            By clicking Subscribe now, you agree to Patreon’s Terms of Use and Privacy Policy. This Patreon subscription automatically renews monthly, and you’ll be notified in advance if the monthly amount increases. Cancel at any time in your membership settings.
          </p>

          <!-- Subscription Button with Conditional Text -->
          <v-btn block :color="paymentMethod === 'card' ? 'red' : 'blue'" class="mt-4 py-4 font-weight-bold">
            {{ paymentMethod === 'card' ? 'Subscribe now' : 'Continue with PayPal' }}
          </v-btn>
          
          <v-divider class="my-5"></v-divider>

        </v-card>
      </v-col>

      <!-- Order Summary Section -->
      <v-col cols="12" md="3" class="pa-4">
        <v-card class="pa-6" flat style="background-color: white;">
          <h3 class="font-weight-bold mb-5">Order summary</h3>
          
          <v-row align="center" class="mb-4">
            <v-avatar size="50">
              <img src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/6030293/0227f44b29e14465927d53079b4b0f5a/eyJoIjozNjAsInciOjM2MH0%3D/4.jpg?token-time=1731888000&token-hash=K2NriJNbtiP4wYV_xkLBLNaHcMjW5v2QVnk39c9SjLU%3D" alt="Profile">
            </v-avatar>
            <div class="ml-4">
              <h4 class="font-weight-bold mb-0">Joe Budden</h4>
              <p class="text-subtitle-2">Friend of The Show</p>
            </div>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- <v-text-field label="Discount code" append-icon="mdi-chevron-down" outlined></v-text-field> -->

          <v-divider class="my-4"></v-divider>

          <div class="d-flex justify-space-between">
            <span>Monthly payment</span>
            <span>${{ monthlyPayment.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span>VAT</span>
            <span>${{ vat.toFixed(2) }}</span>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex justify-space-between font-weight-bold text-h6">
            <span>Total due today</span>
            <span>${{ totalAmount.toFixed(2) }}</span>
          </div>
        </v-card>
      </v-col>
      
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      amount: 25.00,
      paymentMethod: 'card',
      vatRate: 0.11, // 11% VAT
    };
  },
  computed: {
    vat() {
      return this.amount * this.vatRate;
    },
    totalAmount() {
      return this.amount + this.vat;
    },
    monthlyPayment() {
      return this.amount;
    }
  }
};
</script>

<style scoped>
.full-screen {
  background-color: #1c1c1c;
}
</style>
