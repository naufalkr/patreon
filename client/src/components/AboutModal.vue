<template>
  <v-container>
    <!-- Display About Info -->
    <v-row>
      <v-col cols="12">
        <v-card style="background-color: #252525; color: #f4efe1">
          <v-card-title class="text-h5">{{ aboutInfo.title }}</v-card-title>
          <v-card-text style="background-color: #252525; color: #f4efe1">
            <ul>
              <li v-for="(desc, idx) in aboutInfo.description" :key="idx">{{ desc }}</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-btn style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);" @click="openAboutModal">Edit About Info</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- About Modal -->
    <v-dialog v-model="aboutDialog" persistent transition="fab-transition" max-width="600">
      <v-card>
        <div class="d-flex justify-space-between mb-5" id="modal-header">
          <v-card-title class="py-3">Edit About Info</v-card-title>
          <div class="mt-3 mr-2">
            <v-btn icon text @click="closeAboutModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <v-card-text>
          <ValidationObserver ref="aboutForm" v-slot="{ invalid }">
            <form @submit.prevent="submitAboutInfo">
              <!-- About Title -->
              <ValidationProvider rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="aboutInfo.title"
                  label="Title"
                  :error-messages="errors"
                  required
                  outlined
                ></v-text-field>
              </ValidationProvider>

              <!-- About Description -->
              <ValidationProvider rules="required" v-slot="{ errors }">
                <v-textarea
                  v-model="aboutInfo.description"
                  label="Description (separate with commas)"
                  :error-messages="errors"
                  required
                  outlined
                  rows="4"
                ></v-textarea>
              </ValidationProvider>

              <!-- Submit Button -->
              <v-btn
                :loading="aboutSubmitLoading"
                type="submit"
                class="primary"
                depressed
                :disabled="invalid"
                style="background-color: #252525; color: #ffffff;"
              >Submit</v-btn>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "AboutModalManager",
  data() {
    return {
      aboutDialog: false,  // control modal visibility for About Info
      aboutSubmitLoading: false,
      aboutInfo: {
        title: "Welcome to Our Channel",
        description: [
          "This channel is dedicated to providing quality content that educates and entertains.",
          "We aim to foster a community where ideas and creativity flourish.",
          "Our mission is to empower individuals through knowledge and engagement, inspiring a passion for lifelong learning.",
          "Thank you for being a part of our journey!",
          "If you have any questions or suggestions, feel free to reach out through our contact page."
        ]
      }
    };
  },
  methods: {
    // Open the About Modal for editing
    openAboutModal() {
      this.aboutDialog = true;
    },
    // Close the About Modal
    closeAboutModal() {
      this.aboutDialog = false;
    },
    // Submit the edited About info
    submitAboutInfo() {
      this.aboutSubmitLoading = true;
      const updatedDescription = this.aboutInfo.description.split(',').map(desc => desc.trim());

      // Save the updated about info here (API call or state update)
      console.log("Updated About Info:", {
        title: this.aboutInfo.title,
        description: updatedDescription
      });

      this.aboutSubmitLoading = false;
      this.closeAboutModal(); // Close the modal
    }
  }
};
</script>

