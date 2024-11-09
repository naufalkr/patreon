<template>
  <v-dialog v-model="showModal" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ post.title }}</span>
      </v-card-title>
      <v-card-text>
        <div v-if="post.image">
          <img :src="post.image" alt="Post Image" class="post-image"/>
        </div>
        <p>{{ post.content }}</p>
        <p class="grey--text">{{ post.userId }} - {{ dateFormatter(post.date) }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    dateFormatter(date) {
      return this.$moment(date).fromNow();
    }
  }
};
</script>

<style scoped>
.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
