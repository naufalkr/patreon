<template>  
  <div id="dashboard">
    <v-container fluid class="main-container">
      <div class="d-flex justify-space-between mb-5">
        <h2 style="margin-left: 10px">Creator Dashboard</h2>        
      </div>      
    </v-container>    
    <!-- <subscribers-modal
      :open-dialog="subscribersDialog"
      @closeDialog="subscribersDialog = false"
    /> -->


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
                        {{ channel.memberships }} memberships
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-skeleton-loader>
            </v-col>

          <v-col cols="12" sm="5" md="3" lg="3" v-if="!loading">
            <v-btn
              class="white mt-6"
              tile              
              large
              depressed
              @click="$router.push({ name: 'EditProfile' })"
              style="margin-bottom: -80px; margin-left: 80px; border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
            >
              Edit Profile
            </v-btn>
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
                <v-card-title style="color: #f4efe1; display: flex; justify-content: space-between; align-items: center;">
                  <!-- Uploads -->
                  <!-- <div class="right"> -->
                  <upload-video-modal
                    :open-dialog="dialog"
                    v-on:closeDialog="dialog = false"
                  />
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          @click="dialog = true"
                          class="mr-4 white"
                          v-on="{ ...tooltip }"
                          style="border: 1px solid #252525; border-radius: 4px; padding: 10px; background-color: white; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
                        >
                          Create Content
                        </v-btn>
                      </template>
                    </v-tooltip>
                  <!-- </div> -->
                </v-card-title>
                <v-row>
                  <v-col
                    cols="12"
                    v-for="(post, i) in loading ? 10 : posts"
                    :key="i"
                    class="mx-auto"
                  >
                    <v-skeleton-loader type="card" :loading="loading">
                      <div class="post-card">
                        <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
                        <h4 style="color: #f4efe1;">{{ post.title }}</h4>
                        <p style="color: #f4efe1;">{{ post.content }}</p>
                        <p class="grey--text" style="color: #f4efe1;">{{ post.userId }} {{ dateFormatter(post.date) }}</p>
                      </div>
                    </v-skeleton-loader>
                  </v-col>
                  <v-col class="text-center" v-if="posts.length === 0 && !loading">
                    <p style="color: #f4efe1;">No posts yet</p>
                  </v-col>
                  <v-col cols="12">
                    <infinite-loading @infinite="getPosts">
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
                <v-card-title style="color: #f4efe1; display: flex; justify-content: space-between; align-items: center;">
                  <!-- Uploads -->
                  <!-- <div class="right"> -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <edit-membership-modal
                          :open-dialog="MembershipDialog"
                          v-on:closeDialog="MembershipDialog = false"
                        />
                        <v-btn
                          @click="MembershipDialog = true"
                          v-on="{ ...tooltip }"
                          style="padding: 10px; background-color: #131313; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
                        >
                          <!-- Edit Membership -->
                        </v-btn>
                      </template>
                    </v-tooltip>
                  <!-- </div> -->
                </v-card-title>                                
              </v-card>
            </v-tab-item>



            <!-- ABOUT -->
            <v-tab-item>
              <v-card class="transparent" flat>
                <!-- <v-card-title style="color: #f4efe1;">About</v-card-title> -->
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <about-modal
                          :open-dialog="AboutDialog"
                          v-on:closeDialog="AboutDialog = false"
                        />
                        <v-btn
                          @click="AboutDialog = true"
                          v-on="{ ...tooltip }"
                          style="padding: 10px; background-color: #131313; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
                        >
                          <!-- Edit Membership -->
                        </v-btn>
                      </template>
                    </v-tooltip>
                <!-- <v-card-text style="color: #f4efe1;">
                  <h3 style="color: #f4efe1;">{{ aboutInfo.title }}</h3>
                  <p v-for="(text, idx) in aboutInfo.description" :key="idx" style="color: #f4efe1;">
                    {{ text }}
                  </p>
                </v-card-text> -->
              </v-card>
            </v-tab-item>
          </v-tabs-items>

        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import UploadVideoModal from '@/components/UploadVideoModal'
import EditMembershipModal from '@/components/EditMembershipModal'
import AboutModal from '@/components/AboutModal'


// import SubscribersModal from '@/components/SubscribersModal'

export default {
  data: () => ({
    // loading: true,
    dialog: false,
    MembershipDialog: false,
    AboutDialog: false,

    // subscribersDialog: false,

    tab: null,
    loading: false,
    errored: false,
    // subscribed: true,
    // subscribeLoading: false,
    showSubBtn: true,
    url: process.env.VUE_APP_URL,
    items: ['Home', 'Membership', 'About'],
    posts: [
      {
        title: "Post Title 1",
        content: "This is the content of post 1.",
        // userId: "User1",
        date: new Date(),
        image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+1"
      },
      {
        title: "Post Title 2",
        content: "This is the content of post 2.",
        // userId: "User2",
        date: new Date(),
        image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+2"
      },
      {
        title: "Post Title 3",
        content: "This is the content of post 3.",
        // userId: "User3",
        date: new Date(),
        image: "https://via.placeholder.com/350x150/3c3c3c/ffffff?text=Post+Image+3"
      },
    ],
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
      // subscribed: true
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
      // subscribed: false
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
      // subscribed: false
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
      // subscribed: false
    }
  ],
    aboutInfo: {
      title: "Welcome to Our Channel",
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
    UploadVideoModal,
    EditMembershipModal,
    AboutModal

    // SubscribersModal
  },
  methods: {
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
    async getPosts() {
      this.loading = true
      // Add post fetching logic here
      this.loading = false
    },
    dateFormatter(date) {
      return date.toLocaleDateString()
    }
  },
  mounted() {
    this.getPosts()
  }
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

.main-container {
  // min-height: 100vh;
  // min-width: 100vw;
  // padding-top: 20px;
  color: #f4efe1;
  margin-bottom: -15px;
  background-color: #252525;
}


.post-card {
  background-color: #252525;
  color: #f4efe1;
  padding: 16px; /* Keep the internal padding for each card */
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3); /* Slightly darker shadow for depth */
  margin-bottom: 16px; /* Add spacing between posts */
  position: relative; /* Position relative for seamless effect */
  overflow: hidden; /* Hide overflow to ensure seamless edges */
  overflow-x: hidden;
}

.post-image {
  width: 100%; /* Make the image full width */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px 8px 0 0; /* Rounded corners at the top */
}

.v-alert .title,
.v-alert div,
.headline,
.post-card h4,
.post-card p {
  color: #f4efe1;
}

.v-application--wrap {
  padding: 0 !important; /* Removes any global Vuetify padding */
  margin: 0 !important;
}

h3.headline {
  color: #f4efe1; /* Ensure headlines are visible */
  margin-top: 16px; /* Margin above each headline */
}

h2.headline {
  color: #f4efe1; /* Ensure headlines are visible */
  margin-top: 20px; /* Margin above each headline */
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

  .card {
  background: #f9f9f9 !important;
}
}
}
</style>

