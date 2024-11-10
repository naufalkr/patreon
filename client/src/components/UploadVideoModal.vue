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
          <form @submit.prevent="handleSubmit">
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
                @change="handleFileSelect"
                v-model="formData.media_file"
                accept="video/mp4,video/webm,video/mov,image/*"
                :placeholder="'Pick a media file (image or video)'"
                prepend-icon="mdi-attachment"
                ref="fileInput"
                style="color: #252525;"          
              ></v-file-input>
              <span v-if="errors.length" style="color: #252525;">
                {{ errors[0] }}
              </span> 
            </ValidationProvider>

            <v-progress-circular
              v-if="uploading"
              :rotate="360"
              :size="100"
              :width="15"
              :value="uploadProgress"
              color="#252525"
            >
              {{ uploadProgress }}
            </v-progress-circular>

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
              name="Tier"
              rules="required"
            >
              <v-select
                :items="tierLevels"
                :error-messages="errors"
                filled
                label="Content Tier"
                v-model="formData.tier"
                :hint="'Select the tier level required to access this content'"
                persistent-hint
              ></v-select>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Tags"
            >
              <v-combobox
                v-model="formData.tags"
                :items="[]"
                label="Add tags"
                multiple
                chips
                filled
                :error-messages="errors"
              ></v-combobox>
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
import ContentService from "@/services/ContentService";
import VideoService from "@/services/VideoService";

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
      visibilityOptions: ["Public", "Private"],
      selectedFile: null,
      selectedImage: null,
      uploadedText: "",
      tierLevels: [
        { text: 'Basic (Free)', value: 1 },
        { text: 'Premium', value: 2 },
        { text: 'VIP', value: 3 }
      ],
      formData: {
        id: "",
        title: "",
        description: "",
        visibility: "",
        tier: 1,
        tags: [],
        media_file: null
      },
      imgDataUrl: "",
      url: "",
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` },
      uploadProgress: 0,
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
    async handleSubmit() {
      try {
        if (!this.formData.media_file) {
          this.$notify({
            type: 'error',
            text: 'Please select a media file (image or video)'
          });
          return;
        }

        this.uploading = true;
        const formData = new FormData();
        
        // Append media file
        formData.append('media_file', this.formData.media_file);
        
        // Append other form data
        formData.append('title', this.formData.title);
        formData.append('description', this.formData.description);
        formData.append('visibility', this.formData.visibility.toLowerCase());
        formData.append('tier', this.formData.tier);
        formData.append('tags', JSON.stringify(this.formData.tags));

        const response = await ContentService.createContent(formData, {
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        });
        
        if (response.data) {
          this.$emit('content-created', response.data);
          this.closeModal();
          this.$notify({
            type: 'success',
            text: 'Content uploaded successfully!'
          });
        }
      } catch (error) {
        console.error('Error uploading content:', error);
        this.$notify({
          type: 'error',
          text: error.response?.data?.message || 'Error uploading content'
        });
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    async submit() {
      if (!this.selectedImage || this.uploadedText.trim() === "") return;
      this.submitLoading = true;

      const video = await VideoService.updateVideo(this.formData.id, {
        title: this.formData.title,
        description: this.formData.description,
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
    closeModal() {
      this.$emit("closeDialog");
    },
    selectFile() {
      this.$refs.fileInput.$refs.input.click();
    },
    handleFileSelect(file) {
      if (file) {
        this.formData.media_file = file;
      }
    },
    resetForm() {
      this.formData = {
        id: "",
        title: "",
        description: "",
        visibility: "",
        tier: 1,
        tags: [],
        media_file: null
      };
      this.uploadProgress = 0;
      this.uploading = false;
    },
  },
  components: {
    // myUpload,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
