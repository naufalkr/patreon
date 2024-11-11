<template>
  <v-container>
    <!-- Display About Info -->
    <v-row>
      <v-col cols="12">
        <v-card style="background-color: #252525; color: #f4efe1">
          <v-card-title class="text-h5">{{ aboutInfo.title }}</v-card-title>
          <v-card-text style="background-color: #252525; color: #f4efe1">
          {{ aboutInfo.description }}
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
                <v-text-field
                  v-model="aboutInfo.description"
                  label="Description"
                  :error-messages="errors"
                  required
                  outlined
                ></v-text-field>
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
import axios from "axios";
export default {
  name: "AboutModalManager",
  data() {
    return {
      aboutDialog: false,  // control modal visibility for About Info
      aboutSubmitLoading: false,
      aboutInfo: {
        title: "Wel to Our Channel",
        description: "We are a group of passionate creators who love to share our knowledge with the world."
      }
    };
  },
  created() {
    this.fetchBio();
    // Fetch About Info from API or state
    // this.aboutInfo = fetchAboutInfo();
  },
  methods: {
        async fetchBio() {
      try {
        const response = await axios.get("http://localhost:8080/api/creator/profile",{
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        this.aboutInfo.title = response.data.bio;
        this.aboutInfo.description = response.data.description;
      } catch (error) {
        console.error(error);
      }
    },
    // Open the About Modal for editing
    openAboutModal() {
      this.aboutDialog = true;
    },
    // Close the About Modal
    closeAboutModal() {
      this.aboutDialog = false;
    },
    // Submit the edited About info
    async submitAboutInfo() {
      this.aboutSubmitLoading = true;
      try {
        await axios.put("http://localhost:8080/api/creator/profile", {
          bio: this.aboutInfo.title,
          description: this.aboutInfo.description
        }, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
      } catch (error) {
        console.error(error);
      }

      // Save the updated about info here (API call or state update)
      this.aboutSubmitLoading = false;
      this.closeAboutModal(); // Close the modal
    }
  }
};
</script>

