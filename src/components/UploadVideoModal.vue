<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="fab-transition"
    max-width="1000"
  >
    <v-card>
      <div class="d-flex justify-space-between mb-5" id="modal-header">
        <v-card-title class="py-3">Upload Content</v-card-title>
        <div class="mt-3 mr-2">
          <v-btn icon text @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <v-card-text>
        <ValidationObserver ref="form" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <div class="text-center">
              <v-btn
                icon
                class="grey lighten-2 mb-4"
                style="height: 104px; width: 104px; background-color: #252525;"
                @click="selectFile"
              >
                <v-icon x-large style="color: #ffffff;">mdi-upload-outline</v-icon>
              </v-btn>
            </div>

            <ValidationProvider
              rules="required|size:5000"
              v-slot="{ errors }"
              name="file"
              ref="provider"
            >
              <v-file-input
                @change="uploadVideo"
                v-model="selectedFile"
                accept="video/mp4"
                placeholder="Pick a video"
                prepend-icon="mdi-attachment"
                ref="fileInput"
                style="color: #252525;"          
              ></v-file-input >
              <span v-if="errors.length" style="color: #252525;">
        {{ errors[0] }}
      </span> 
            </ValidationProvider>

            <v-progress-circular
              v-if="uploading"
              :rotate="360"
              :size="100"
              :width="15"
              :value="value"
              color="#252525"
            >
              {{ value }}
            </v-progress-circular>

            <div class="mt-6">
              <v-divider></v-divider>
              <h3 class="mt-4">Upload Image</h3>
              <ValidationProvider
                rules="required"
                name="Image"
              >
                <v-file-input
                  v-model="selectedImage"
                  accept="image/*"
                  placeholder="Pick an image"
                  prepend-icon="mdi-attachment"
                  class="mb-4"
                ></v-file-input>
              </ValidationProvider>

              <v-divider></v-divider>
            </div>

            <ValidationProvider
              v-slot="{ errors }"
              name="Title"
              rules="required|min:3"
            >
              <v-text-field
                v-model="formData.title"
                :error-messages="errors"
                label="Add a title"
                class="mb-3"
                filled
                dense
                counter="100"
                max-length="100"
              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Description"
              rules="required|min:3"
            >
              <v-textarea
                filled
                auto-grow
                :error-messages="errors"
                placeholder="What're you thinking about?"
                rows="5"
                counter="5000"
                max-length="5000"
                v-model="formData.description"
                row-height="20"
              ></v-textarea>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Visibility"
              rules="required"
            >
              <v-select
                :items="visibilityOptions"
                :error-messages="errors"
                filled
                label="Visibility"
                v-model="formData.visibility"
              ></v-select>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Category"
              rules="required"
            >
              <v-select
                :items="categoriesTitles"
                :error-messages="errors"
                filled
                label="Membership Tier"
                v-model="formData.category"
                :loading="categoryLoading"
              ></v-select>
            </ValidationProvider>

            <div class="mt-6 d-flex justify-space-between">
              <v-btn
                :loading="submitLoading"
                type="submit"
                class="primary"
                depressed
                :disabled="invalid"
                style="background-color: #252525; color: #ffffff;"
              >Upload</v-btn>
            </div>
          </form>
        </ValidationObserver>
      </v-card-text>

      <v-card-actions>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import myUpload from "vue-image-crop-upload";
import VideoService from "@/services/VideoService";
import CategoryService from "@/services/CategoryService";

export default {
  name: "UploadModal",
  props: ["openDialog"],
  data() {
    return {
      valid: false,
      uploaded: false,
      uploading: false,
      submitLoading: false,
      categoryLoading: false,
      value: 0,
      show: false,
      categoriesTitles: ["Basic", "Family", "Friend of The Show", "Part of the Show"],
      categories: [],
      visibilityOptions: ["Public", "Private"],
      selectedFile: null,
      selectedImage: null,
      uploadedText: "",
      formData: {
        id: "",
        title: "",
        description: "",
        category: "",
        visibility: "",
      },
      imgDataUrl: "",
      url: "",
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` },
    };
  },
  computed: {
    dialog() {
      return this.openDialog;
    },
  },
  methods: {
    async uploadVideo(e) {
      const { valid } = await this.$refs.provider.validate(e);
      if (!valid) return;

      this.uploading = true;
      const fd = new FormData();
      fd.append("video", this.selectedFile, this.selectedFile.name);

      let video = await VideoService.uploadVideo(fd, {
        onUploadProgress: (uploadEvent) => {
          this.value = Math.round((uploadEvent.loaded / uploadEvent.total) * 100);
        },
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.uploaded = true;
        this.uploading = false;
      });

      if (!video) return;
      video = video.data.data;

      this.formData.id = video._id;
      this.formData.title = video.title;
      this.formData.description = video.description;
      this.url = `${process.env.VUE_APP_URL}/api/v1/videos/${video._id}/thumbnails`;
    },
    async submit() {
      if (!this.selectedImage || this.uploadedText.trim() === "") return;
      this.submitLoading = true;

      // Find the selected category ID
      const selectedCategory = this.categories.find(
        (category) => category.title === this.formData.category
      );
      if (selectedCategory) {
        this.formData.category = selectedCategory._id;
      }

      const video = await VideoService.updateVideo(this.formData.id, {
        title: this.formData.title,
        description: this.formData.description,
        categoryId: this.formData.category,
        status: this.formData.visibility.toLowerCase(),
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.submitLoading = false;
        this.uploaded = false;
        this.resetForm();
      });

      if (!video) return;

      this.$router.push(`/studio/videos?${new Date()}`);
    },
    async getCategories() {
      this.categoryLoading = true;
      const categories = await CategoryService.getAll()
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.categoryLoading = false));

      this.categoriesTitles = categories.data.data.map((category) => category.title);
      this.categories = categories.data.data;
    },
    closeModal() {
      this.$emit("closeDialog");
    },
    selectFile() {
      this.$refs.fileInput.$refs.input.click();
    },
    resetForm() {
      this.formData = {
        id: "",
        title: "",
        description: "",
        category: "",
        visibility: "",
      };
      this.selectedFile = null;
      this.selectedImage = null;
      this.uploadedText = "";
      this.imgDataUrl = "";
      this.show = false;
    },
  },
  components: {
    // myUpload,
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
