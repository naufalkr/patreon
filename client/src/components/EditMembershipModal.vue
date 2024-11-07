<template>
  <v-container>
    <!-- Display Membership Options -->
    <v-row align="stretch">
      <v-col v-for="(membership, index) in membershipOptions" :key="index" cols="12" sm="6" md="4">
        <v-sheet
          outlined
          style="background-color: #333; color: #f4efe1; border-color: #f4efe1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;"
        >
          <v-card-title class="text-h5">{{ membership.title }}</v-card-title>
          <v-card-subtitle class="mb-2" style="font-size: 0.8em; font-weight: bold; color: #FFD700;">
            {{ membership.price }}
          </v-card-subtitle>

          <v-card-text>
            <v-chip
              v-if="membership.isPopular"
              color="red"
              dark
              label
              class="mb-2"
            >Most popular</v-chip>

            <ul>
              <li v-for="(benefit, idx) in membership.benefits" :key="idx" style="color: #f4efe1;">
                {{ benefit }}
              </li>
            </ul>
          </v-card-text>

          <v-card-actions>
            <v-btn style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);" @click="editMembership(membership)">Edit</v-btn>
            <v-btn style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: red; color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);" @click="deleteMembership(index)">Delete</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Add New Membership Button -->
    <v-btn style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: green; color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);" @click="openCreateModal">Add New Membership</v-btn>

    <!-- Edit/Create Membership Modal -->
    <v-dialog v-model="dialog" persistent transition="fab-transition" max-width="600">
      <v-card>
        <div class="d-flex justify-space-between mb-5" id="modal-header">
          <v-card-title class="py-3">{{ formData.title ? 'Edit Membership' : 'Create Membership' }}</v-card-title>
          <div class="mt-3 mr-2">
            <v-btn icon text @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <v-card-text>
          <ValidationObserver ref="form" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <!-- Membership Title -->
              <ValidationProvider rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="formData.title"
                  label="Title"
                  :error-messages="errors"
                  required
                  outlined
                ></v-text-field>
              </ValidationProvider>

              <!-- Membership Price -->
              <ValidationProvider rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="formData.price"
                  label="Price"
                  :error-messages="errors"
                  required
                  outlined
                ></v-text-field>
              </ValidationProvider>

              <!-- Membership Benefits -->
              <ValidationProvider rules="required" v-slot="{ errors }">
                <v-textarea
                  v-model="formData.benefits"
                  label="Benefits (separate with commas)"
                  :error-messages="errors"
                  required
                  outlined
                  rows="4"
                ></v-textarea>
              </ValidationProvider>

              <!-- Is Popular Checkbox -->
              <ValidationProvider v-slot="{ errors }">
                <v-checkbox
                  v-model="formData.isPopular"
                  label="Is Popular"
                  :error-messages="errors"
                  outlined
                ></v-checkbox>
              </ValidationProvider>

              <!-- Submit Button -->
              <v-btn
                :loading="submitLoading"
                type="submit"
                class="primary"
                depressed
                :disabled="invalid"
                style="background-color: #252525; color: #ffffff;"
              >Submit</v-btn>
            </form>
          </ValidationObserver>
        </v-card-text>

        <v-card-actions></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "MembershipManager",
  data() {
    return {
      dialog: false, // control dialog visibility
      submitLoading: false,
      membershipOptions: [
        {
          title: "Basic",
          price: "FREE",
          benefits: [
            "Access to patron-only chat community on Discord",
            "Ad-Free video episodes of the JBP",
            "At least 1 JBP bonus video per month"
          ],
          isPopular: false,
        },
        {
          title: "Family",
          price: "$10/month",
          benefits: [
            "Includes Discord benefits",
            "At least 2 JBP bonus videos per month",
            "1 personal vlog per month 🆕",
            "Merch discounts"
          ],
          isPopular: true,
        },
        {
          title: "Friend of the Show",
          price: "$25/month",
          benefits: [
            "Includes Discord benefits",
            "At least 4 JBP bonus videos per month",
            "RSS audio feed of Patreon-exclusive episodes 🎧",
            "Patron-only episodes of the JBN show 'Journey'"
          ],
          isPopular: false,
        },
        {
          title: "Part of the Show",
          price: "$50/month",
          benefits: [
            "An invitation to submit topics and questions for the JBP",
            "Possible on-air call back from JBP 📞",
            "Your name in the credits (if idea is chosen)",
            "►PLUS everything in the Homies, Family and Friend of the Show tiers!!!"
          ],
          isPopular: false,
        }
      ],
      formData: {
        title: "",
        price: "",
        benefits: "",
        isPopular: false,
      }
    };
  },
  methods: {
    // Open the modal for creating a new membership
    openCreateModal() {
      this.formData = {
        title: "",
        price: "",
        benefits: "",
        isPopular: false,
      };
      this.dialog = true;
    },
    // Edit existing membership
    editMembership(membership) {
      this.formData = { ...membership };
      this.dialog = true;
    },
    // Handle form submission (create or update membership)
    submit() {
      this.submitLoading = true;
      const benefitsArray = this.formData.benefits.split(',').map(benefit => benefit.trim());
      const membershipData = { ...this.formData, benefits: benefitsArray };

      if (this.formData.title) {
        // Update or create new membership here (API call or state update)
        console.log("Membership data submitted:", membershipData);
      }

      this.submitLoading = false;
      this.dialog = false; // Close the dialog
    },
    // Close the modal
    closeModal() {
      this.dialog = false;
    },
    // Delete a membership option
    deleteMembership(index) {
      this.membershipOptions.splice(index, 1);
    }
  }
};
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
