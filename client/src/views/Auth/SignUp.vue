<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="8" md="8" lg="7" class="ma-auto">
        <v-card outlined>
          <v-row class="justify-space-between px-4 pt-6 pb-12">
            <v-col cols="12" sm="12" md="6">
              <v-card-title class="text-center">Patreon</v-card-title>
              <v-card-subtitle class="mb-5">Create your Patreon account</v-card-subtitle>
              <v-card-text>
                <form @submit.prevent="signup">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    class="mb-3"
                    outlined
                    dense
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="channelName"
                    label="Channel Name"
                    outlined
                    dense
                    required
                  ></v-text-field>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="password"
                        type="password"
                        label="Password"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="confirmPassword"
                        type="password"
                        label="Confirm"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <div class="mt-6 d-flex justify-space-between">
                    <v-btn
                      text
                      small
                      class="pl-0 text-capitalize"
                      color="primary"
                      @click="goToLogin"
                    >
                      Sign in instead
                    </v-btn>
                    <v-btn class="primary" depressed type="submit">
                      Sign up
                    </v-btn>
                  </div>
                </form>
              </v-card-text>
            </v-col>
            <v-col cols="5" class="align-self-center hidden-sm-and-down">
              <v-responsive>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="max-width: 100%"
                  viewBox="0 0 1075.51587 646.89913"
                >
                  <title>Create Account</title>
                  <path
                    d="M136.59282,733.55706l63.43134-91.13824L136.56059,743.4707l-.037,10.3692q-6.78516-.05706-13.43322-.44141c-.02019-2.35442,5.37117-131.89917,5.142-134.24281.3129-.0888.48846-12.252.6126-12.78462L62.57779,506.77732,128.91613,596.945l.1978,2.66552,3.93549-100.64793L76.0857,395.895,133.5,481.27779c.02132-1.3695,2.71745-208.02265,2.744-209.29776.01628.67732,1.25371,164.45521,1.26281,165.14538l54.47905-65.92288-54.53131,80.08836-.27852,90.07922,50.556-87.10756C124.63867,581.2954,138.60155,536.8418,136.99011,604.702l73.43568-121.29149L136.92724,622.17566Z"
                    fill="#d0cde1"
                  />
                  <!-- Add other paths here -->
                </svg>
              </v-responsive>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "CreateAccount",
  data() {
    return {
      email: '',
      channelName: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async signup() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      try {
        const response = await axios.post("http://localhost:8080/api/auth/signup", {
          email: this.email,
          username: this.channelName,
          password: this.password
        });

        this.$router.push({name: 'SignIn'});
        
        if (response.status === 201) {
          this.$router.push({name: 'Signin'});
        }
      } catch (error) {
        alert(error.response.data.message || "Failed to sign up.");
      }
    }
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
