<template>
  <div id="home" class="pa-4" :style="{ backgroundColor: '#131313' }">
    <v-container fluid>
      <v-alert prominent type="error" v-if="errored">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Error!</div>
            <div>
              Something went wrong, but don’t fret — let’s give it another shot.
            </div>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="loadPosts">Try Again</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <main v-else class="main-content">
        <h3 class="headline font-weight-medium">Recommended Posts</h3>
        <v-row>
          <v-col
            cols="12"
            v-for="(post, i) in posts"
            :key="i"
            class="mx-auto"
          >
            <v-skeleton-loader type="card" :loading="loading">
              <div class="post-card">
                <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
                <h4>{{ post.title }}</h4>
                <p>{{ post.content }}</p>
                <p class="grey--text">{{ post.userId }} - {{ dateFormatter(post.date) }}</p>
              </div>
            </v-skeleton-loader>
          </v-col>
          <v-col class="text-center" v-if="posts.length === 0 && !loading">
            <p>No posts yet</p>
          </v-col>
          <v-col cols="12">
            <infinite-loading @infinite="loadPosts">
              <div slot="spinner">
                <v-progress-circular indeterminate color="red"></v-progress-circular>
              </div>
              <div slot="no-results"></div>
              <span slot="no-more"></span>
              <div slot="error" slot-scope="{ trigger }">
                <v-alert prominent type="error">
                  <v-row align="center">
                    <v-col class="grow">
                      <div class="title">Error!</div>
                      <div>
                        Something went wrong, but don’t fret — let’s give it another shot.
                      </div>
                    </v-col>
                    <v-col class="shrink">
                      <v-btn @click="trigger">Take action</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </div>
            </infinite-loading>
          </v-col>
        </v-row>
      </main>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'

export default {
  name: 'Home',
  data: () => ({
    loading: false,
    errored: false,
    posts: [],
  }),
  methods: {
    loadPosts($state) {
      this.loading = true;
      try {
        const dummyPosts = [
          { title: "Post Title 1", content: "This is the content of post 1.", userId: "User1", date: new Date(), image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+1" },
          { title: "Post Title 2", content: "This is the content of post 2.", userId: "User2", date: new Date(), image: null },
          { title: "Post Title 3", content: "This is the content of post 3.", userId: "User3", date: new Date(), image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+3" },
          { title: "Post Title 4", content: "This is the content of post 4.", userId: "User4", date: new Date(), image: null },
          { title: "Post Title 5", content: "This is the content of post 5.", userId: "User5", date: new Date(), image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+5" }
        ];

        if (dummyPosts.length) {
          this.posts.push(...dummyPosts);
          $state.loaded();
        } else {
          $state.complete();
        }
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    dateFormatter(date) {
      return moment(date).fromNow();
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<style lang="scss">
.main-content {
  padding-left: 400px;
  padding-right: 400px;
}

.post-card {
  background-color: #252525;
  color: #f4efe1;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
}

.v-alert .title, .v-alert div, .headline, .post-card h4, .post-card p {
  color: #f4efe1;
}

h3.headline {
  color: #f4efe1;
  margin-top: 16px;
}
</style>
