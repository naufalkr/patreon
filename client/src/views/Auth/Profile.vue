<template>
<div id="profile">
  <v-container fill-height fluid style="background-color: #252525; color: #2e2e2e">
    <!-- Profile Information Section -->
    <v-row justify="center" class="mb-0">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
          <v-card-title class="text-h5 font-weight-bold pb-4">Profile Information</v-card-title>

          <!-- Profile Picture -->
          <v-card-text class="text-center">
            <v-avatar size="120" class="border-2 border-gold mb-4 mx-auto">
              <v-img :src="profilePictureFilePreview || profilePicture" class="rounded-lg"></v-img>
            </v-avatar>
            <v-file-input
              v-model="profilePictureFile"
              label="Change Profile Picture"
              outlined
              color="primary"
              accept="image/*"
              hide-details
              @change="previewProfilePicture"
              class="mb-4"
            ></v-file-input>
          </v-card-text>

          <!-- Name -->
          <v-card-text>
            <v-text-field
              v-model="profileData.name"
              label="Full Name"
              outlined
              color="primary"
              class="mb-4"
              dense
            ></v-text-field>
          </v-card-text>

          <!-- Username -->
          <v-card-text>
            <v-text-field
              v-model="profileData.username"
              label="Username"
              outlined
              color="primary"
              class="mb-4"
              dense
            ></v-text-field>
          </v-card-text>

          <!-- Submit Button for Profile Update -->
          <v-card-actions class="justify-end">
            <v-btn
              color="#252525"
              @click="saveProfile"
              :loading="submitLoading"
              :disabled="submitLoading"
              rounded
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Update Password Section -->
    <v-row justify="center" class="mb-0">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
          <v-card-title class="text-h5 font-weight-bold pb-4">Update Password</v-card-title>

          <!-- Current Password -->
          <v-card-text>
            <v-text-field
              v-model="profileData.currentPassword"
              label="Current Password"
              type="password"
              outlined
              color="primary"
              class="mb-4"
              dense
            ></v-text-field>
          </v-card-text>

          <!-- New Password -->
          <v-card-text>
            <v-text-field
              v-model="profileData.newPassword"
              label="New Password"
              type="password"
              outlined
              color="primary"
              class="mb-4"
              dense
            ></v-text-field>
          </v-card-text>

          <!-- Confirm New Password -->
          <v-card-text>
            <v-text-field
              v-model="profileData.confirmNewPassword"
              label="Confirm New Password"
              type="password"
              outlined
              color="primary"
              class="mb-4"
              dense
            ></v-text-field>
          </v-card-text>

          <!-- Submit Button for Password Update -->
          <v-card-actions class="justify-end">
            <v-btn
              color="#252525"
              @click="updatePassword"
              :loading="submitLoading"
              :disabled="submitLoading"
              rounded
            >
              Update Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Account Section -->
    <v-row justify="center" class="mb-5">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
          <v-card-title class="text-h5 font-weight-bold pb-4">Delete Account</v-card-title>

          <v-card-text class="text-center">
            <p class="text-h6">Are you sure you want to delete your account? This action cannot be undone.</p>
          </v-card-text>

          <!-- Delete Button -->
          <v-card-actions class="justify-end">
            <v-btn
              color="red"
              @click="deleteAccount"
              rounded
            >
              Delete Account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
export default {
  data() {
    return {
      profileData: {
        name: "John Doe",
        username: "johndoe123",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      profilePicture: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ1xRwffQuyxddE7qdIwG7IMgHAvE25da4g-6igGIp8Erag6uL_", // Placeholder for profile picture
      profilePictureFile: null,
      submitLoading: false,
      // Variables to hold image previews
      profilePictureFilePreview: null,
    };
  },
  methods: {
    saveProfile() {
      this.submitLoading = true;
      // Add logic to handle profile saving (e.g., API call)
      console.log("Profile data saved:", this.profileData);
      this.submitLoading = false;
    },
    updatePassword() {
      this.submitLoading = true;
      // Add logic to handle password update (e.g., API call)
      if (this.profileData.newPassword === this.profileData.confirmNewPassword) {
        console.log("Password updated successfully!");
      } else {
        alert("Passwords do not match!");
      }
      this.submitLoading = false;
    },
    deleteAccount() {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        // Add logic to handle account deletion (e.g., API call)
        console.log("Account deleted.");
      }
    },
    previewProfilePicture() {
      const file = this.profilePictureFile;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.profilePictureFilePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style scoped>
/* General Styles */
.v-card {
  border-radius: 16px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.v-avatar {
  border-radius: 50%;
}

.v-text-field,
.v-file-input {
  background-color: #fafafa;
  color: #333333;
}

.v-btn {
  background-color: #4caf50;
  color: #ffffff;
  border-radius: 12px;
}

.v-btn:hover {
  background-color: #45a049;
}
/* 
.v-row {
    background-color: #252525
} */

.v-card-title {
  font-weight: bold;
  color: #333333;
}

.v-card-actions {
  background-color: #fafafa;
}

/* Styling for the Delete Button */
.v-btn.red {
  background-color: #e53935;
}

.v-btn.red:hover {
  background-color: #c62828;
}

/* File input styling */
.v-file-input input[type="file"]:hover {
  cursor: pointer;
  background-color: #FFC107;
}

.v-avatar .v-img {
  border: 4px solid #FFC107;
}
</style>
