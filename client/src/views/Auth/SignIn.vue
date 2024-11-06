<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto">
        <v-card outlined>
          <div class="px-8 pt-6 pb-12">
            <v-card-title class="text-center">Patreon</v-card-title>
            <v-card-subtitle class="mb-5">Sign in</v-card-subtitle>
            <v-card-text>
              <form @submit.prevent="signIn">
                <v-text-field v-model="username" label="Username" outlined></v-text-field>
                <p class="ma-0 text-right">
                  <v-btn text small class="pl-0 text-capitalize" color="primary">
                    Forget Password?
                  </v-btn>
                </p>
                <v-text-field v-model="password" type="password" label="Password" outlined></v-text-field>
                <div class="mt-6 d-flex justify-space-between">
                  <v-btn text small class="pl-0 text-capitalize" color="primary">
                    Create account
                  </v-btn>
                  <v-btn class="primary" depressed @click="signIn">
                    Sign in
                  </v-btn>
                </div>
              </form>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignIn',
  data: () => ({
    username: '',
    password: '',
  }),
  methods: {
    async signIn() {
      try {
        // Make POST request to backend for sign-in
        const response = await axios.post('http://localhost:8080/api/auth/signin', {
          username: this.username,
          password: this.password,
        });

        // Handle the received token and other data
        const { accessToken } = response.data;
        if (accessToken) {
          localStorage.setItem('token', accessToken); // Store token in localStorage for future requests
          this.$router.push({ name: 'Home' }); // Redirect to the home page or dashboard
        } else {
          alert('Failed to sign in.');
        }
      } catch (error) {
        alert(error.response?.data?.message || 'An error occurred during sign-in.');
      }
    },
  },
};
</script>
