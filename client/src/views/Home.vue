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
            :key="post.id"
            class="mx-auto"
          >
            <v-skeleton-loader type="card" :loading="loading">
              <div class="post-card">
                <div v-if="post.media_file" class="media-container">
                  <img 
                    v-if="isImage(post.media_file)" 
                    :src="`${baseUrl}/uploads/${post.media_file}`" 
                    alt="Post Image" 
                    class="post-image" 
                  />
                  <video
                    v-else-if="isVideo(post.media_file)"
                    class="post-video"
                    :ref="`video-${post.id}`"
                    controls
                    preload="metadata"
                  >
                    <source :src="`${baseUrl}/uploads/${post.media_file}`" :type="getVideoType(post.media_file)">
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h4>{{ post.title }}</h4>
                <p v-if="!post.showFullContent">{{ truncatedContent(post.description) }}</p>
                <p v-if="post.showFullContent">{{ post.description }}</p>

                <v-btn v-if="isContentLong(post.description) && !post.showFullContent" 
                       @click="toggleContent(post)" 
                       class="read-more-btn white--text">
                  Read More
                </v-btn>

                <!-- Publisher info and timestamp -->
                <div class="publisher-info">
                  <v-avatar size="24" class="mr-2">
                    <img :src="defaultAvatar" :alt="post.user.username">
                  </v-avatar>
                  <span class="username">{{ post.user.username }}</span>
                  <v-icon small class="mx-2" color="grey">mdi-circle-small</v-icon>
                  <span class="timestamp">{{ dateFormatter(post.created_at) }}</span>
                </div>

                <!-- Tags section -->
                <div v-if="post.tags && post.tags.length" class="tags-container">
                  <v-chip
                    v-for="tag in post.tags"
                    :key="tag"
                    small
                    class="mr-2 tag-chip"
                    color="#3c3c3c"
                    text-color="#f4efe1"
                  >
                    #{{ tag }}
                  </v-chip>
                </div>

                <div class="post-actions">
                  <div class="left-actions">
                    <v-btn icon small @click="likePost(post)" :color="post.hasLiked ? 'red' : '#f4efe1'">
                      <v-icon>{{ post.hasLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
                      <span>{{ post.like_count }}</span>
                    </v-btn>
                    <v-btn icon small @click="toggleComments(post)" style="margin-left: 20px">
                      <v-icon color="#f4efe1">mdi-comment-outline</v-icon>
                      <span>{{ post.comment_count }}</span>
                    </v-btn>
                  </div>
                  <div class="right-actions">
                    <v-btn icon small @click="sharePost(i)">
                      <v-icon color="#f4efe1">mdi-share-variant</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Comments section -->
                <div v-if="post.showComments">
                  <div v-for="comment in post.comments" 
                       :key="comment.id" 
                       class="comment">
                    <v-avatar size="40">
                      <img :src="defaultAvatar" alt="Profile">
                    </v-avatar>
                    <div style="margin-left: 20px; padding-top: 8px">
                      <strong>{{ comment.user ? comment.user.username : 'Unknown User' }}</strong>
                      <p>{{ comment.text }}</p>
                    </div>
                  </div>
                  
                  <!-- Comment Input Section -->
                  <div v-if="post.showComments">
                    <v-textarea
                      v-model="post.newComment"
                      label="Add your comment..."
                      outlined
                      auto-grow
                      dense
                      style="margin-left: 20px; padding-top: 20px;"
                      class="custom-textarea"
                    ></v-textarea>
                    <v-btn 
                      @click="submitComment(post)" 
                      class="submit-comment-btn white--text" 
                      :disabled="!post.newComment"
                    >
                      Submit
                    </v-btn>
                  </div>
                </div>
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
import axios from 'axios';

export default {
  name: 'Home',
  data: () => ({
    loading: false,
    errored: false,
    posts: [],
    allPostsLoaded: false,
    page: 1,
    limit: 10,
    baseUrl: 'http://localhost:8080', // Update with your backend URL
    defaultAvatar: 'https://via.placeholder.com/40', // Default avatar image
  }),
  methods: {
    async loadPosts($state) {
      if (this.allPostsLoaded) {
        $state && $state.complete();
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`${this.baseUrl}/api/content`, {
          params: {
            page: this.page,
            limit: this.limit,
            userTier: 3, // Set based on user's subscription tier
            visibility: 'public' // Add this parameter
          },
          headers: { 'x-access-token': localStorage.getItem('token') }
        });

        const contents = response.data;
        
        if (contents.length) {
          // Transform content data and add required properties
          const transformedPosts = contents.map(content => ({
            ...content,
            showFullContent: false,
            showComments: false,
            comments: [],
            newComment: '',
            hasLiked: false
          }));

          // Check if user has liked each post
          if (localStorage.getItem('token')) {
            await Promise.all(transformedPosts.map(async (post) => {
              try {
                const response = await axios.get(
                  `${this.baseUrl}/api/content/${post.id}/hasLiked`,
                  { headers: { 'x-access-token': localStorage.getItem('token') } }
                );
                post.hasLiked = response.data.hasLiked;
              } catch (error) {
                console.error('Error checking like status:', error);
              }
            }));
          }

          this.posts.push(...transformedPosts);
          this.page += 1;
          $state && $state.loaded();
        } else {
          this.allPostsLoaded = true;
          $state && $state.complete();
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        this.errored = true;
        $state && $state.error();
      } finally {
        this.loading = false;
      }
    },

    async toggleComments(post) {
      post.showComments = !post.showComments;
      if (post.showComments && post.comments.length === 0) {
        try {
          // Update to include user data in comments
          const response = await axios.get(
            `${this.baseUrl}/api/content/${post.id}/comments`,
            {
              headers: { 'x-access-token': localStorage.getItem('token') }
            }
          );
          post.comments = response.data;
        } catch (error) {
          console.error('Error loading comments:', error);
        }
      }
    },

    async submitComment(post) {
      if (!post.newComment.trim()) return;

      try {
        const response = await axios.post(
          `${this.baseUrl}/api/content/${post.id}/comments`,
          { text: post.newComment },
          { headers: { 'x-access-token': localStorage.getItem('token') } }
        );

        // Add the new comment with user data from response
        const newComment = response.data.comment;
        post.comments.unshift(newComment);
        post.comment_count++;
        post.newComment = '';
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    },

    async likePost(post) {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login');
        return;
      }
  
      try {
        const response = await axios.post(
          `${this.baseUrl}/api/content/${post.id}/like`,
          {},
          { headers: { 'x-access-token': localStorage.getItem('token') } }
        );
        
        // Update the post's like status and count
        post.hasLiked = response.data.liked;
        post.like_count = response.data.likeCount;
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },

    isImage(filename) {
      return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    },

    isVideo(filename) {
      return /\.(mp4|webm|mov)$/i.test(filename);
    },

    getVideoType(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      const mimeTypes = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mov': 'video/quicktime'
      };
      return mimeTypes[ext] || 'video/mp4';
    },

    // Existing utility methods
    dateFormatter(date) {
      if (!date) return '';
      const now = moment();
      const postDate = moment(date);
      const diff = now.diff(postDate, 'days');

      if (diff < 1) {
        return postDate.fromNow(); // "a few seconds ago", "2 hours ago", etc.
      } else if (diff < 7) {
        return postDate.calendar(); // "Last Monday at 2:30 AM", etc.
      } else {
        return postDate.format('MMMM D, YYYY'); // "July 5, 2023"
      }
    },

    isContentLong(content) {
      return content && content.split(' ').length > 65;
    },

    truncatedContent(content) {
      if (!content) return '';
      const words = content.split(' ');
      return words.slice(0, 65).join(' ') + (words.length > 65 ? '...' : '');
    },

    toggleContent(post) {
      post.showFullContent = !post.showFullContent;
    },

    sharePost(index) {
      console.log(`Shared post at index ${index}`);
    }
  },

  mounted() {
    this.loadPosts();
  },

  components: {
    InfiniteLoading
  }
}
</script>


<style lang="scss">
.main-content {
  padding-left: 300px;
  padding-right: 300px;
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

.media-container {
  width: 100%;
  margin-bottom: 16px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.post-video {
  width: 100%;
  max-height: 500px;
  background-color: #000;
  border-radius: 8px 8px 0 0;
}

.post-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px 8px 0 0;
}

.v-alert .title, .v-alert div, .headline, .post-card h4, .post-card p {
  color: #f4efe1;
}

h3.headline {
  color: #f4efe1;
  margin-top: 16px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.left-actions,
.right-actions {
  display: flex;
  align-items: center;
}

.left-actions v-btn,
.right-actions v-btn {
  margin-right: 8px;
}

.left-actions span {
  margin-left: 4px;
  color: #f4efe1;
}

.read-more-btn {
  background-color: #3c3c3c !important; /* memastikan background tetap transparan */
  // border: 1px solid #f4efe1;
  color: #f4efe1;
  // padding: 8px 16px;
  margin-top: -10px;
  border-color: #f4efe1;
  text-transform: none;
  min-width: auto; /* Menghilangkan lebar tombol yang besar */
  box-shadow: none; /* Menghilangkan shadow jika ada */
  border-radius: 100px
}

.read-more-btn:hover {
  background-color: #3c3c3c; /* Menghindari background putih saat hover */
  border-color: #f4efe1;
  color: #f4efe1;
}

.comment {
  display: flex;
  align-items: center;
  // margin-bottom: 2px;
  margin-top: 4px;
}

.comment v-avatar {
  margin-right: 8px;
}

.load-more-btn {
  background-color: #3c3c3c !important;
  color: #f4efe1;
  // border: 1px solid #f4efe1;
  padding: 8px 16px;
  margin-top: 12px;
  text-transform: none;
  margin-bottom: 5px;
}

.load-more-btn:hover {
  background-color: #3c3c3c;
  color: #131313;
  border-color: #f4efe1;
}

.custom-textarea {
  background-color: #252525 !important;
  color: #fff !important; /* Teks dalam input */
  border-color: #444444 !important; /* Border input gelap */  
}

.custom-textarea .v-input__control {
  background-color: #252525 !important; /* Set background di dalam control */
  color: #fff !important
}

.custom-textarea .v-input__slot {
  // background-color: #252525 !important; /* Set warna latar belakang slot */
  color: #fff !important; /* Teks dalam input */
}

.custom-textarea .v-label {
  color: #fff !important; /* Label menjadi putih */
}

.custom-textarea ::v-deep .v-input__control {
  background-color: #252525 !important;
}

.custom-textarea ::v-deep .v-input__slot {
  color: #fff !important; /* Mengubah warna teks */
}

.custom-textarea ::v-deep input {
  color: #fff !important; /* Mengubah warna teks dalam input */
}

.custom-textarea ::v-deep .v-label {
  color: #fff !important; /* Mengubah warna label */
}


.submit-comment-btn {
  background-color: #3c3c3c !important; /* Set background button */
  color: #fff !important; /* Set warna teks button */
  border: none;
  margin-top: -20px;
}

.submit-comment-btn:hover {
  background-color: #444444 !important; /* Set warna background button saat hover */
}

video::-webkit-media-controls-panel {
  background-color: rgba(0, 0, 0, 0.7);
}

video::-webkit-media-controls-play-button {
  background-color: rgba(244, 239, 225, 0.8);
  border-radius: 50%;
}

video::-webkit-media-controls-timeline {
  background-color: rgba(244, 239, 225, 0.2);
}

.publisher-info {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #f4efe1;
  opacity: 0.8;
  
  .username {
    font-weight: 500;
    color: #f4efe1;
  }
  
  .timestamp {
    color: #f4efe1;
    font-size: 0.9em;
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 16px 0;
}

.tag-chip {
  font-size: 0.85em;
  height: 24px !important;
  
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}

</style>
