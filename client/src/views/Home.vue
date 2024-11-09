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
                <p v-if="!post.showFullContent">{{ truncatedContent(post.content) }}</p>
                <p v-if="post.showFullContent">{{ post.content }}</p>

                <!-- Show Read More button if content exceeds 100 words -->
                <v-btn v-if="isContentLong(post.content) && !post.showFullContent" @click="toggleContent(post)" class="read-more-btn white--text">Read More</v-btn>

                <p class="grey--text">{{ post.userId }} - {{ dateFormatter(post.date) }}</p>
                
                <!-- Like, Comment, and Share Buttons with Counts -->
                <div class="post-actions">
                  <div class="left-actions">
                    <v-btn icon small @click="likePost(i)">
                      <v-icon color="#f4efe1">mdi-thumb-up-outline</v-icon>
                      <span>{{ post.likeCount }}</span>
                    </v-btn>
                    <v-btn icon small @click="commentPost(i)" style="margin-left: 20px">
                      <v-icon color="#f4efe1">mdi-comment-outline</v-icon>
                      <span>{{ post.commentCount }}</span>
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
                  <div v-for="(comment, index) in post.comments.slice(0, post.showingComments)" :key="index" class="comment">
                    <v-avatar size="40">
                      <img :src="comment.profileImage" alt="Profile">
                    </v-avatar>
                    <div style = "margin-left: 20px; padding-top: 8px">
                      <strong>{{ comment.username }}</strong>
                      <p>{{ comment.text }}</p>
                    </div>
                  </div>
                  <v-btn v-if="post.comments.length > post.showingComments" @click="loadMoreComments(post)" class="load-more-btn white--text">Load More Comments</v-btn>
                  <!-- Comment Input Section -->
                    <div v-if="post.showComments">
                      <v-textarea
                        v-model="post.newComment"
                        label="Add your comment..."
                        outlined
                        auto-grow
                        dense
                        style = "margin-left: 20px; padding-top: 20px;"
                        class="custom-textarea"
                      ></v-textarea>
                      <v-btn @click="submitComment(post)" class="submit-comment-btn white--text" :disabled="!post.newComment">Submit</v-btn>
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

export default {
  name: 'Home',
  data: () => ({
    loading: false,
    errored: false,
    posts: [],
    allPostsLoaded: false,
  }),
  methods: {
    loadPosts($state) {
      if (this.allPostsLoaded) {
        $state.complete();
        return;
      }

      this.loading = true;
      try {
        const dummyPosts = [
        { 
          title: "Post Title 1", 
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.", 
          userId: "User1", 
          date: new Date(), 
          image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+1", 
          likeCount: 12, 
          commentCount: 5, 
          showFullContent: false,
          showComments: false,
          comments: [
            { username: "User1", profileImage: "https://via.placeholder.com/40", text: "This is a comment." },
            { username: "User2", profileImage: "https://via.placeholder.com/40", text: "This is another comment." },
            { username: "User3", profileImage: "https://via.placeholder.com/40", text: "Great post!" },
            { username: "User4", profileImage: "https://via.placeholder.com/40", text: "I totally agree." },
            { username: "User5", profileImage: "https://via.placeholder.com/40", text: "Interesting." }
          ],
          showingComments: 4
        },
        {
          title: "Post Title 2",
          content: "This is another example of a post. It doesn't have too much text, but it's still relevant. The content here is concise and to the point. More details could be added here later. This is another example of a post. It doesn't have too much text, but it's still relevant. The content here is concise and to the point. More details could be added here later. This is another example of a post. It doesn't have too much text, but it's still relevant. The content here is concise and to the point. More details could be added here later. This is another example of a post. It doesn't have too much text, but it's still relevant. The content here is concise and to the point. More details could be added here later.",
          userId: "User2",
          date: new Date(),
          image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+2",
          likeCount: 25,
          commentCount: 3,
          showFullContent: false,
          showComments: false,
          comments: [
            { username: "User1", profileImage: "https://via.placeholder.com/40", text: "Nice post!" },
            { username: "User2", profileImage: "https://via.placeholder.com/40", text: "Agree with this!" },
            { username: "User3", profileImage: "https://via.placeholder.com/40", text: "Short but sweet." }
          ],
          showingComments: 3
        },
        {
          title: "Post Title 3",
          content: "Here we discuss the importance of clean code and how following best practices can improve maintainability and scalability of your software projects. Always aim for clarity and simplicity in your codebase.",
          userId: "User3",
          date: new Date(),
          image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+3",
          likeCount: 32,
          commentCount: 8,
          showFullContent: false,
          showComments: false,
          comments: [
            { username: "User1", profileImage: "https://via.placeholder.com/40", text: "This is such an important topic!" },
            { username: "User2", profileImage: "https://via.placeholder.com/40", text: "Totally agree, clean code is key." },
            { username: "User4", profileImage: "https://via.placeholder.com/40", text: "I need to revisit my codebase now." },
            { username: "User5", profileImage: "https://via.placeholder.com/40", text: "Thanks for sharing this!" },
            { username: "User6", profileImage: "https://via.placeholder.com/40", text: "Definitely, keeping things simple is the way to go." }
          ],
          showingComments: 4
        },
        {
          title: "Post Title 4",
          content: "Exploring the latest trends in AI and how machine learning is shaping the future of technology. From self-driving cars to intelligent virtual assistants, the potential is limitless.",
          userId: "User4",
          date: new Date(),
          image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+4",
          likeCount: 45,
          commentCount: 6,
          showFullContent: false,
          showComments: false,
          comments: [
            { username: "User3", profileImage: "https://via.placeholder.com/40", text: "Exciting stuff happening in AI!" },
            { username: "User4", profileImage: "https://via.placeholder.com/40", text: "AI will change everything." },
            { username: "User5", profileImage: "https://via.placeholder.com/40", text: "Looking forward to the advancements!" },
            { username: "User6", profileImage: "https://via.placeholder.com/40", text: "AI is the future." },
            { username: "User7", profileImage: "https://via.placeholder.com/40", text: "Great to see this topic discussed." },
            { username: "User8", profileImage: "https://via.placeholder.com/40", text: "Agreed! AI has so much potential." }
          ],
          showingComments: 4
        },
        {
          title: "Post Title 5",
          content: "A quick guide to getting started with Vue.js. Learn the basics of creating a new Vue project, components, and how to manage state effectively.",
          userId: "User5",
          date: new Date(),
          image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+5",
          likeCount: 18,
          commentCount: 4,
          showFullContent: false,
          showComments: false,
          comments: [
            { username: "User2", profileImage: "https://via.placeholder.com/40", text: "Great tutorial for beginners!" },
            { username: "User3", profileImage: "https://via.placeholder.com/40", text: "I learned Vue recently, this post is very helpful." },
            { username: "User4", profileImage: "https://via.placeholder.com/40", text: "Vue.js is awesome." },
            { username: "User5", profileImage: "https://via.placeholder.com/40", text: "Glad you like it!" }
          ],
          showingComments: 4
        }
      ];

        if (dummyPosts.length) {
          this.posts.push(...dummyPosts);
          this.allPostsLoaded = true;
          $state.complete();
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
    },
    likePost(index) {
      console.log(`Liked post at index ${index}`);
    },
    commentPost(index) {
      const post = this.posts[index];
      post.showComments = !post.showComments; // Toggle comments visibility
    },
    sharePost(index) {
      console.log(`Shared post at index ${index}`);
    },
    isContentLong(content) {
      return content.split(' ').length > 65; // Adjusted to 65 words
    },
    truncatedContent(content) {
      const words = content.split(' ');
      return words.slice(0, 65).join(' ');
    },
    toggleContent(post) {
      post.showFullContent = !post.showFullContent; // Toggle visibility of full content
    },
    loadMoreComments(post) {
      post.showingComments += 4; // Load 4 more comments
    },
    submitComment(post) {
      if (post.newComment.trim() !== "") {
        // Add new comment to the post's comments array
        post.comments.push({
          username: "Current User",
          profileImage: "https://via.placeholder.com/40", // Replace with user's profile image
          text: post.newComment,
        });
        post.commentCount++; // Increase the comment count
        post.newComment = ""; // Clear the input after submitting
      }
    }
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


</style>
