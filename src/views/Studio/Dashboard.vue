<template>
  <div id="dashboard" class="pa-4">
    <v-container fluid>
      <div class="d-flex justify-space-between mb-5">
        <h2>creator dashboard</h2>
        <div class="right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                @click="dialog = true"
                class="mr-4 white"
                v-on="{ ...tooltip }"
                style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
              >
                Upload Content
              </v-btn>
            </template>
            <!-- <span>Upload content</span> -->
          </v-tooltip>

        </div>
      </div>      
    </v-container>
    <upload-video-modal
      :open-dialog="dialog"
      v-on:closeDialog="dialog = false"
    />
    <subscribers-modal
      :open-dialog="subscribersDialog"
      @closeDialog="subscribersDialog = false"
    />
  </div>
</template>

<script>
import UploadVideoModal from '@/components/UploadVideoModal'
import SubscribersModal from '@/components/SubscribersModal'

export default {
  data: () => ({
    loading: true,
    dialog: false,
    subscribersDialog: false
  }),
  components: {
    UploadVideoModal,
    SubscribersModal
  },
  mounted() {}
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
