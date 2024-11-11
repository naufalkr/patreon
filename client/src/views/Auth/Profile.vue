<template>
  <div id="profile">
    <v-container fill-height fluid style="background-color: #252525; color: #2e2e2e">
      <!-- Profile Information Section -->
      <v-row justify="center" class="mb-0" style="margin-top: 20px;">
        <v-col cols="12" md="8">
          <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
            <v-card-title class="text-h5 font-weight-bold pb-4">Profile information</v-card-title>

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
                class="mb-0"
              ></v-file-input>
            </v-card-text>

            <!-- Username and Email -->
            <v-card-text>
              <v-text-field
                v-model="profileData.username"
                label="Username"
                outlined
                color="primary"
                class="mb-0"
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-text-field
                v-model="profileData.email"
                label="Email"
                outlined
                color="primary"
                class="mb-0"
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
            <v-card-title class="text-h5 font-weight-bold pb-4">Update password</v-card-title>

            <v-card-text>
              <v-text-field
                v-model="profileData.currentPassword"
                label="Current Password"
                type="password"
                outlined
                color="primary"
                class="mb-0"
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-text-field
                v-model="profileData.newPassword"
                label="New Password"
                type="password"
                outlined
                color="primary"
                class="mb-0"
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-text-field
                v-model="profileData.confirmNewPassword"
                label="Confirm New Password"
                type="password"
                outlined
                color="primary"
                class="mb-0"
                dense
              ></v-text-field>
            </v-card-text>

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

      <!-- Become a Creator Section -->
      <v-row justify="center" class="mb-0">
        <v-col cols="12" md="8">
          <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
            <v-card-title class="text-h5 font-weight-bold pb-4">Become a Creator</v-card-title>
            <v-card-actions class="justify-end">
              <v-btn
                color="green"
                @click="confirmBecomeCreator"
                rounded
              >
                Become a Creator
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Logout -->

      <v-row justify="center" class="mb-0">
        <v-col cols="12" md="8">
          <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
            <v-card-title class="text-h5 font-weight-bold pb-4">Logout</v-card-title>
            <v-card-actions class="justify-end">
              <v-btn
                color="red"
                @click="logout"
                rounded
              >
                Logout
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Delete Account Section -->
      <v-row justify="center" class="mb-5">
        <v-col cols="12" md="8">
          <v-card class="rounded-xl" style="background-color: #ffffff; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
            <v-card-title class="text-h5 font-weight-bold pb-4">Delete account</v-card-title>

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
import axios from "axios";

export default {
  data() {
    return {
      profileData: {
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      profilePicture: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ1xRwffQuyxddE7qdIwG7IMgHAvE25da4g-6igGIp8Erag6uL_",
      profilePictureFile: null,
      submitLoading: false,
      profilePictureFilePreview: null,
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          headers:{
            "x-access-token": localStorage.getItem("token"),
          }
        });
        this.profileData.username = response.data.username;
        this.profileData.email = response.data.email;
        this.profilePicture = response.data.profile_image || this.profilePicture;
      } catch (error) {
        console.error(error);
      }
    },
    async saveProfile() {
      this.submitLoading = true;
      try {
        await axios.put("http://localhost:8080/api/user/profile", {
          username: this.profileData.username,
          email: this.profileData.email,
        }, {
          headers:{
            "x-access-token": localStorage.getItem("token"),
          }
        });
        alert("Profile updated successfully!");
      } catch (error) {
        console.error(error);
      } finally {
        this.submitLoading = false;
      }
    },
    async updatePassword() {
      this.submitLoading = true;
      if (this.profileData.newPassword === this.profileData.confirmNewPassword) {
        try {
          await axios.put("http://localhost:8080/api/user/password", {
            currentPassword: this.profileData.currentPassword,
            newPassword: this.profileData.newPassword,
          }, {
            headers:{
              "x-access-token": localStorage.getItem("token"),
            }
          });
          alert("Password updated successfully!");
        } catch (error) {
          console.error(error);
        } finally {
          this.submitLoading = false;
        }
      } else {
        alert("Passwords do not match!");
        this.submitLoading = false;
      }
    },
    async confirmBecomeCreator() {
      try {
        await axios.put("http://localhost:8080/api/user/become-creator", {}, {
          headers:{
            "x-access-token": localStorage.getItem("token"),
          }
        });
        alert("You are now a creator!");
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Welcome" });
    },
    async deleteAccount() {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
          await axios.delete("http://localhost:8080/api/user/", {}, {
            headers:{
              "x-access-token": localStorage.getItem("token"),
            }
          });
          alert("Account deleted successfully!");
          this.$router.push({ name: "Welcome" });
        } catch (error) {
          console.error(error);
        }
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
  margin-bottom: 16px;
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

.v-card-title {
  font-weight: bold;
  color: #333333;
}

.main-content{
    /* margin-top: 200px; */
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
