<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto">
        <v-card outlined>
          <div class="px-8 pt-6 pb-12">
            <v-card-title class="text-center">Patreon</v-card-title>
            <v-card-subtitle class="mb-5">Sign in</v-card-subtitle>
            <v-card-text>
              <form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  outlined
                ></v-text-field>
                <p class="ma-0 text-right">
                  <v-btn
                    text
                    small
                    class="pl-0 text-capitalize"
                    color="primary"
                  >
                    Forget Password?
                  </v-btn>
                </p>
                <v-text-field
                  v-model="password"
                  type="password"
                  label="Password"
                  outlined
                ></v-text-field>
                <div class="mt-6 d-flex justify-space-between">
                  <v-btn
                    text
                    small
                    class="pl-0 text-capitalize"
                    color="primary"
                  >
                    Create account
                  </v-btn>
                  <v-btn class="primary" depressed>
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
export default {
  name: 'SignIn',
  data: () => ({
    email: '',
    password: '',
  }),
};
</script>

<style scoped>
/* Add any scoped CSS if needed */
</style>
