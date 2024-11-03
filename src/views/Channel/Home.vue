<template>
  <div id="channel-home">
    <!-- Parallax background image for the channel header -->
    <v-parallax
      height="230"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-parallax>

    <div class="nav-bgcolor">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
              <!-- Skeleton loader to show loading state for channel info -->
              <v-skeleton-loader
                type="list-item-avatar-two-line"
                :loading="loading"
                class="mr-1"
              >
                <v-card class="transparent" flat>
                  <v-list-item three-line>
                    <v-list-item-avatar size="80">
                      <!-- Channel avatar image or placeholder -->
                      <v-img
                        v-if="channel.photoUrl !== 'no-photo.jpg'"
                        :src="`${url}/uploads/avatars/${channel.photoUrl}`"
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
                      <v-list-item-subtitle>
                        {{ channel.subscribers }} subscribers
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-skeleton-loader>
            </v-col>

            <v-col cols="12" sm="5" md="3" lg="3" v-if="!loading">
              <!-- Subscription button for the channel -->
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
                >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
              >
              <!-- Alternative subscription button if user is not logged in -->
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
                >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Tabs for channel content -->
      <v-card flat class="transparent">
        <v-tabs
          v-model="tab"
          background-color="transparent"
          show-arrows
          centered
          center-active
        >
          <!-- Loop through tab items -->
          <v-tab v-for="(item, i) in items" :key="i">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-container fluid>
          <v-tabs-items v-model="tab" class="transparent">
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <v-slide-group class="pa-4" multiple show-arrows>
                  <!-- Video cards for uploaded content -->
                  <v-slide-item
                    v-for="(video, i) in loading ? 5 : videos"
                    :key="i"
                  >
                    <v-skeleton-loader
                      type="card-avatar"
                      :loading="loading"
                      width="250px"
                      class="mr-1"
                    >
                      <video-card
                        :card="{ maxWidth: 250, type: 'noAvatar' }"
                        :video="video"
                        :channel="video.userId"
                      ></video-card>
                    </v-skeleton-loader>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <v-row>
                  <!-- Video cards displayed in a grid -->
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    v-for="(video, i) in loading ? 10 : videos"
                    :key="i"
                    class="mx-xs-auto"
                  >
                    <v-skeleton-loader type="card-avatar" :loading="loading">
                      <video-card
                        :card="{ maxWidth: 350 }"
                        :video="video"
                        :channel="video.userId"
                      ></video-card>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </div>

    <!-- Sign-in modal component -->
    <signin-modal
      :openModal="signinDialog"
      :details="details"
      @closeModal="signinDialog = false"
    />
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

import VideoCard from '@/components/VideoCard'
import SigninModal from '@/components/SigninModal'

export default {
  data: () => ({
    tab: null,
    loading: false,
    errored: false,
    subscribed: false,
    subscribeLoading: false,
    showSubBtn: true,
    url: process.env.VUE_APP_URL,
    items: ['Home', 'Videos', 'Playlists', 'Community', 'Channels', 'About'],
    videos: [
      {
        _id: 'video1',
        title: 'Dummy Video 1',
        userId: 'channel1',
        photoUrl: 'https://i.pinimg.com/564x/48/d2/eb/48d2eb58ae52993b83d019bcd0122d7a.jpg',
        description: 'This is a description for dummy video 1.',
        views: 100,
        likes: 10,
      },
      {
        _id: 'video2',
        title: 'Dummy Video 2',
        userId: 'channel1',
        photoUrl: 'https://i.pinimg.com/564x/48/d2/eb/48d2eb58ae52993b83d019bcd0122d7a.jpg',
        description: 'This is a description for dummy video 2.',
        views: 200,
        likes: 20,
      },
      {
        _id: 'video3',
        title: 'Dummy Video 3',
        userId: 'channel1',
        photoUrl: 'https://i.pinimg.com/564x/48/d2/eb/48d2eb58ae52993b83d019bcd0122d7a.jpg',
        description: 'This is a description for dummy video 3.',
        views: 300,
        likes: 30,
      },
    ],
    channel: {
      _id: 'channel1',
      channelName: 'Dummy Channel',
      photoUrl: 'dummy-photo.jpg',
      subscribers: 150,
    },
    signinDialog: false,
    details: {}
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  components: {
    VideoCard,
    SigninModal
  },
  methods: {
    async subscribe() {
      if (!this.isAuthenticated) {
        this.signinDialog = true
        this.details = {
          title: 'Want to subscribe to this channel?',
          text: 'Sign in to subscribe to this channel.'
        }
        return
      }
      this.subscribeLoading = true
      // Simulate subscription action
      this.subscribed = !this.subscribed
      if (this.subscribed) {
        this.channel.subscribers++
      } else {
        this.channel.subscribers--
      }
      this.subscribeLoading = false
    }
  },
  mounted() {
    // No need to fetch data, use dummy data instead
  },
  beforeRouteUpdate(to, from, next) {
    // No need to fetch data, use dummy data instead
    next()
  }
}
</script>

<style>
.nav-bgcolor {
  background: #f9f9f9;
}

.card {
  background: #f9f9f9 !important;
}

.v-tab {
  margin-right: 4em;
}

#channel-home .v-list-item--link:before {
  background-color: transparent;
}
</style>
