<template>
  <div id="channel-home">
    <v-parallax 
      height="230" 
      v-if="channel.backgroundPhotoUrl && channel.backgroundPhotoUrl !== 'no-photo.jpg'"                         
      :src="channel.backgroundPhotoUrl"
      alt="Channel Background"
      class="custom-parallax"
    ></v-parallax>

    <div class="nav-bgcolor main-content">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
              <v-skeleton-loader type="list-item-avatar-two-line" :loading="loading" class="mr-1">
                <v-card class="transparent" flat>
                  <v-list-item three-line>
                    <v-list-item-avatar size="100">
                      <v-img 
                        v-if="channel.photoUrl && channel.photoUrl !== 'no-photo.jpg'" 
                        :src="channel.photoUrl" 
                        alt="Channel Photo"
                      ></v-img>
                      <v-avatar v-else color="red" size="60">
                        <span class="white--text headline ">
                          {{ channel.channelName.split('')[0].toUpperCase() }}
                        </span>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content class="align-self-auto">
                      <v-list-item-title class="headline mb-1">
                        {{ channel.channelName }}
                      </v-list-item-title>
                      <v-list-item-subtitle style="color: #f4efe1;">
                        {{ channel.memberships }} members
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-skeleton-loader>
            </v-col>

            <v-col cols="12" sm="5" md="3" lg="3" v-if="!loading">
              <v-btn
                v-if="currentUser && channel._id !== currentUser._id"
                :class="[ 
                  { 'red white--text': !subscribed }, 
                  { 'grey grey--text lighten-3 text--darken-3': subscribed },
                  'mt-6'
                ]"
                tile
                large
                depressed
                :loading="subscribeLoading"
                @click="subscribe"
                >{{ !subscribed ? 'Join Membership' : 'Upgrade' }}</v-btn
              >
              <v-btn
                v-else-if="showSubBtn"
                :class="[ 
                  { 'red white--text': !subscribed }, 
                  { 'grey grey--text lighten-3 text--darken-3': subscribed },
                  'mt-6'
                ]"
                tile
                large
                depressed
                :loading="subscribeLoading"
                @click="subscribe"
                >{{ !subscribed ? 'Join Membership' : 'Upgrade' }}</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-card flat class="transparent">
        <v-tabs v-model="tab" background-color="transparent"  show-arrows centered center-active>
          <v-tab style="color: #f4efe1;" v-for="(item, i) in items" :key="i">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-container fluid>
          <v-tabs-items v-model="tab" class="transparent">
  
            <!-- HOME -->
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title style="color: #f4efe1;">Uploads</v-card-title>
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
                    <p style="color: #f4efe1;">No posts yet</p>
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
                              <div class="title" style="color: #f4efe1;">Error!</div>
                              <div style="color: #f4efe1;">
                                Something went wrong, but don’t fret — let’s give it another shot.
                              </div>
                            </v-col>
                            <v-col class="shrink">
                              <v-btn @click="trigger" style="color: #f4efe1;">Take action</v-btn>
                            </v-col>
                          </v-row>
                        </v-alert>
                      </div>
                    </infinite-loading>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            
            <!-- MEMBERSHIP -->
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title style="color: #f4efe1;">Membership Options</v-card-title>
                <v-card-text style="color: #f4efe1;">
                  <h3 style="color: #f4efe1;">Join Our Membership Program</h3>
                  <p style="color: #f4efe1;">
                    Become a member and unlock exclusive content, community features, and more! Choose the membership tier that suits you best:
                  </p>

                  <v-row align="stretch">
                    <!-- Membership Cards -->
                    <v-col
                      v-for="(option, index) in membershipOptions"
                      :key="index"
                      cols="12" sm="6" md="4"
                    >
                      <v-sheet
                        outlined
                        style="background-color: #333; color: #f4efe1; border-color: #f4efe1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;"
                      >
                        <v-card-title class="text-h5">{{ option.title }}</v-card-title>
                        <v-card-subtitle class="mb-2" style="font-size: 1.5em; font-weight: bold; color: #FFD700;">
                          {{ option.price }}
                        </v-card-subtitle>

                        <v-card-text>
                          <v-chip
                            v-if="option.isPopular"
                            color="red"
                            dark
                            label
                            class="mb-2"
                          >Most popular</v-chip>

                          <ul>
                            <li v-for="(benefit, idx) in option.benefits" :key="idx" style="color: #f4efe1;">
                              {{ benefit }}
                            </li>
                          </ul>
                        </v-card-text>
                        <v-card-actions class="justify-center">
                          <v-btn
                            v-if="!option.subscribed"
                            class="red white--text mb-2"
                            @click="subscribe(index)"
                          >
                            Upgrade
                          </v-btn>
                          <v-alert v-else type="success" outlined class="mb-2" style="color: #f4efe1;">
                            You are a member of {{ option.title }}!
                          </v-alert>
                        </v-card-actions>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>



            <!-- ABOUT -->
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title style="color: #f4efe1;">About</v-card-title>
                <v-card-text style="color: #f4efe1;">
                  <h3 style="color: #f4efe1;">{{ aboutInfo.title }}</h3>
                  <p v-for="(text, idx) in aboutInfo.description" :key="idx" style="color: #f4efe1;">
                    {{ text }}
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
export default {
  data: () => ({
    tab: null,
    loading: false,
    errored: false,
    subscribed: false,
    subscribeLoading: false,
    showSubBtn: true,
    posts: [],
    allPostsLoaded: false,
    url: process.env.VUE_APP_URL,
    items: ['Home', 'Membership', 'About'],
    channel: {
      _id: 'channel1',
      channelName: 'Joe Budden',
      photoUrl: 'https://c10.patreonusercontent.com/4/patreon-media/p/campaign/6030293/0227f44b29e14465927d53079b4b0f5a/eyJoIjozNjAsInciOjM2MH0%3D/4.jpg?token-time=1731888000&token-hash=K2NriJNbtiP4wYV_xkLBLNaHcMjW5v2QVnk39c9SjLU%3D',
      backgroundPhotoUrl: 'https://yt3.googleusercontent.com/LEHo9nugrNQxQUpp_uCWFDgGqSNd8FAtojS05fMMX86aKtLz4O-6Jn4yRIdY5bIDq3WqKdxXkA=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
      memberships: 150.283,
    },
    signinDialog: false,
    details: {},
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
      subscribed: true
    },
    {
      title: "Family",
      price: "$10/month",
      benefits: [
        "Includes Discord benefits",
        "At least 2 JBP bonus videos per month",
        "1 personal vlog per month 🆕",
        "Merch discounts",        
      ],
      isPopular: true,
      subscribed: false
    },
    {
      title: "Friend of the Show",
      price: "$25/month",
      benefits: [
        "Includes Discord benefits",
        "At least 4 JBP bonus videos per month",
        "RSS audio feed of Patreon-exclusive episodes 🎧",
        "Patron-only episodes of the JBN show 'Journey'",
      ],
      isPopular: false,
      subscribed: false
    },
    {
      title: "Part of the Show",
      price: "$50/month",
      benefits: [
        "An invitation to submit topics and questions for the JBP",
        "Possible on air call back from JBP 📞",
        "Your name in the credits (if idea is chosen)",
        "►PLUS everything in the Homies, Family and Friend of the Show tiers!!!"
      ],
      isPopular: false,
      subscribed: false
    }
  ],
    aboutInfo: {
      title: " to Our Channel",
      description: [
        "This channel is dedicated to providing quality content that educates and entertains.",
        "We aim to foster a community where ideas and creativity flourish.",
        "Our mission is to empower individuals through knowledge and engagement, inspiring a passion for lifelong learning.",
        "Thank you for being a part of our journey!",
        "If you have any questions or suggestions, feel free to reach out through our contact page."
      ]
    }
  }),
  computed: {
  },
  components: {
    InfiniteLoading
  },
  created() {
    this.fetchBio();
    // this.fetchBanner();
  },
  methods: {
    async fetchBio() {
      try {
        const response = await axios.get("http://localhost:8080/api/creator/profile",{
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        this.aboutInfo.title = response.data.bio;
        this.aboutInfo.description = response.data.bio;
      } catch (error) {
        console.error(error);
      }
    },
    async subscribe() {
      // if (!this.isAuthenticated) {
      //   this.signinDialog = true
      //   this.details = {
      //     title: 'Want to membership to this channel?',
      //     text: 'Sign in to membership to this channel.'
      //   }
      //   return
      // }

      this.subscribeLoading = true
      // Add subscription logic here
      // Example: await this.$store.dispatch('subscribeChannel', this.channel._id)

      this.subscribed = !this.subscribed
      this.subscribeLoading = false
    },
    // async loadPosts() {
    //   this.loading = true
    //   // Add post fetching logic here
    //   this.loading = false
    // },
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
  // mounted() {
  //   this.loadPosts()
  // }
}
</script>


<style lang="scss" scoped>
.main-content {
  background: #131313;
  // color: #f4efe1;
  padding-bottom:200px;
  padding-left: 400px; /* Adjust the left padding */
  padding-right: 400px; /* Adjust the right padding */
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

.v-alert .title,
.v-alert div,
.headline,
.post-card h4,
.post-card p {
  color: #f4efe1;
}

h3.headline {
  color: #f4efe1; /* Ensure headlines are visible */
  margin-top: 16px; /* Margin above each headline */
}

.custom-parallax {
  // background-size: cover; /* or 'contain', depending on the desired effect */
  // background-position: center; /* Center the image */
  // background-repeat: no-repeat; /* Prevent the image from repeating */
  .custom-parallax {
  background-size: contain; /* Ensure the full image is visible */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent the image from repeating */
  min-height: 230px; /* Ensure a minimum height */
  max-height: 400px; /* Optional: Set a maximum height */
  display: flex; /* Center content if any */
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
}
}
</style>
