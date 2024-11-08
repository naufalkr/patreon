<template>
  <nav id="navbaronly">
    <!-- NAVBAR -->    
    <v-app-bar style="background-color: #131313;" flat app clipped-left>
      <!-- Logo - no left margin to align to the left edge -->
      <v-toolbar-title class="logo-toolbar-title" style="margin-left: -15px;">
        <router-link to="/home" style="text-decoration: none">
          <v-img
            src="@/assets/Patroen.png" 
            alt="Patreon Logo"
            height="40"
            contain
          />
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Create Video Menu -->
      <v-menu offsetY>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom class="custom-tooltip">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon class="mr-7" v-on="{ ...tooltip, ...menu }">
                <v-avatar size="30" class="border-2 mb-0">
                  <v-img :src="'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ1xRwffQuyxddE7qdIwG7IMgHAvE25da4g-6igGIp8Erag6uL_'"
                        class="rounded-lg">
                  </v-img>
                </v-avatar>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item router to="/profile">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-play-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item router to="/studio">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-play-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Creator dashboard</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
  </nav>
</template>




<script>
import { mapGetters } from 'vuex'
import SubscriptionService from '@/services/SubscriptionService'
import HistoryService from '@/services/HistoryService'

export default {
  data: () => ({
    drawer: true,
    items: [
      {
        header: null,
        pages: [
          { title: 'Home', link: '/Home', icon: 'mdi-home' },
          { title: 'Explore', link: '/explore', icon: 'mdi-magnify' },
          {
            title: 'Subscriptions',
            link: '/subscriptions',
            icon: 'mdi-youtube-subscription'
          }
        ]
      },
      {
        header: null,
        pages: [
          // {
          //   title: 'Library',
          //   link: '#l',
          //   icon: 'mdi-play-box-multiple'
          // },
          // {
          //   title: 'History',
          //   link: '/history',
          //   icon: 'mdi-history'
          // },
          // {
          //   title: 'Your videos',
          //   link: '#yv',
          //   icon: 'mdi-play-box-outline'
          // },

          // {
          //   title: 'Watch later',
          //   link: '#wl',
          //   icon: 'mdi-clock'
          // },

          {
            title: 'Liked posts',
            link: '/liked-videos',
            icon: 'mdi-thumb-up'
          }
        ]
      },
      {
        header: 'Subscriptions',
        pages: [
          // {
          //   title: 'Traversy Media',
          //   link: '#tm',
          //   icon: 'mdi-badge-account'
          // },
          // {
          //   title: 'The New Boston',
          //   link: '#tn',
          //   icon: 'mdi-badge-account'
          // },
          // {
          //   title: 'Net Ninija',
          //   link: '#nn',
          //   icon: 'mdi-badge-account'
          // },
          // {
          //   title: 'Chris Hawks',
          //   link: '#ch',
          //   icon: 'mdi-badge-account'
          // }
        ]
      },
      {
        header: 'Memberships',
        pages: [
          {
            title: 'Joe Budden',
            link: 'channels/#joebudden',
            image: 'https://c10.patreonusercontent.com/4/patreon-media/p/campaign/6030293/0227f44b29e14465927d53079b4b0f5a/eyJoIjozNjAsInciOjM2MH0%3D/4.jpg?token-time=1731888000&token-hash=K2NriJNbtiP4wYV_xkLBLNaHcMjW5v2QVnk39c9SjLU%3D'
          },
          {
            title: 'The New Boston',
            link: 'channels/#thenewboston',
            image: 'https://yt3.googleusercontent.com/ytc/AIdro_luVhNF6yTdaq1SHoMmVoBAYcvUZkOBsXfEnuwcGf-G4y8=s160-c-k-c0x00ffffff-no-rj'
          },
          {
            title: 'Net Ninja',
            link: 'channels/#netninja',
            image: 'https://i.pinimg.com/564x/66/83/3d/66833db3c1610f83ca05515453167e81.jpg'
          },
          {
            title: 'Chris Hawks',
            link: 'channels/#chrishawks',
            image: 'https://i.pinimg.com/564x/09/80/65/098065c7e785ec16c230d796d5a68a86.jpg'
          }          
        ]
      },
      {
        header: 'More information',
        pages: [
          {
            title: 'Setting',
            link: '#sg',
            icon: 'mdi-cog'
          },
          {
            title: 'Report history',
            link: '#rh',
            icon: 'mdi-flag'
          },
          {
            title: 'Help',
            link: '#hp',
            icon: 'mdi-help-circle'
          },
          {
            title: 'Send feedback',
            link: '#f',
            icon: 'mdi-message-alert'
          }
        ]
      }
    ],
    links: [
      { text: 'About', link: '#' },
      { text: 'Press', link: '#' },
      { text: 'Copyrignt', link: '#' },
      { text: 'Contact us', link: '#' },
      { text: 'Creators', link: '#' },
      { text: 'Advertise', link: '#' },
      { text: 'Developers', link: '#' },
      { text: 'Terms', link: '#' },
      { text: 'Privacy', link: '#' },
      { text: 'Policy & Safety', link: '#' },
      { text: 'Test new features', link: '#' }
    ],
    channelLength: 0,
    searchText: ''
    // user: null
  }),
  computed: {
    ...mapGetters(['currentUser', 'getUrl', 'isAuthenticated'])
  },
  methods: {
    async search() {
      if (!this.searchText) return
      // console.log(this.searchText == this.$route.query['search-query'])
      if (this.searchText == this.$route.query['search-query']) return
      // this.searchText = this.$route.query['search-query']
      const data = {
        type: 'search',
        searchText: this.searchText
      }

      if (this.isAuthenticated)
        await HistoryService.createHistory(data).catch((err) =>
          console.log(err)
        )

      this.$router.push({
        name: 'Search',
        query: { 'search-query': this.searchText }
      })
    },
    async getSubscribedChannels() {
      const channels = await SubscriptionService.getSubscribedChannels(
        this.currentUser._id
      ).catch((err) => console.log(err))
      this.items[2].pages = channels.data.data
      this.channelLength = 3
    },
    moreChannels() {
      if (this.channelLength === 3)
        this.channelLength = this.items[2].pages.length
      else this.channelLength = 3
    },
    signOut() {
      this.$store.dispatch('signOut')
      // this.$router.push('/')
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.searchText = ''
  //   next()
  // },
  // beforeRouteUpdate(to, from, next) {
  //   if (!to.query['search-query'] === '') return
  //   this.searchText = to.query['search-query']
  //   next()
  // },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!to.query['search-query'] === '') return
      vm.searchText = to.query['search-query']
      // vm.getSearchResults(to.query['search-query'])
    })
  },
  mounted() {
    // if (this.$route.query['search-query'])
    //   this.searchText = this.$route.query['search-query']

    if (this.currentUser) this.getSubscribedChannels()
    // this.user = this.$store.getters.currentUser
    // console.log(this.user)
    this.drawer = this.$vuetify.breakpoint.mdAndDown ? false : true
    // console.log(this.$route.name)
    this.drawer = this.$route.name === 'Watch' ? false : this.drawer
  },
  created() {
    this.drawer = this.$route.name === 'Watch' ? false : this.drawer

    if (!this.isAuthenticated) {
      this.items[2].header = false
      this.items[0].pages.pop()
    }
  }
}
</script>

<style lang="scss">
.v-list-item__avatar {
  justify-content: center !important;
}

#showBtn {
  .v-btn__content {
    justify-content: flex-start;

    i {
      margin-right: 30px;
    }
  }
}

#navbar {
  .active-item {
    .v-list-item__icon {
      color: #f4efe1 !important; // Change to text color
    }
  }
  
  .v-navigation-drawer__border {
    width: 0 !important;
  }

  .vuebar-element {
    height: 250px;
    width: 100%;
    max-width: 500px;
    background: #252525; // Change to gray color
  }

  .vb > .vb-dragger {
    z-index: 5;
    width: 10px;
    right: 0;
  }

  .vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;
    transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;

    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }

  .v-navigation-drawer__content:hover .vb > .vb-dragger > .vb-dragger-styler {
    width: 10px;
    background-color: #f4efe1; // Change to text color
  }

  .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(244, 239, 225, 0.3); // Adjust for text color opacity
  }

  .vb > .vb-dragger:hover > .vb-dragger-styler {
    margin: 0px;
    width: 10px;
  }

  .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(244, 239, 225, 0.5); // Adjust for text color opacity
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(244, 239, 225, 0.5); // Adjust for text color opacity
  }
}
</style>

<style scoped>
.custom-search-field {
  background-color: #252525 !important;  /* Ensure the background color applies */
  color: white  !important;              /* Text color */
  border-radius: 20px;                    /* Rounded corners */
}

/* Styles for the input text */
.custom-search-field input {
  color: white !important;              /* Ensure the input text color is set */
}

/* Styles for the placeholder text */
.custom-search-field .v-input__control input::placeholder {
  color: white; /* Placeholder text color */
}

.logo-toolbar-title {
  margin-top: 16px;
  margin-bottom: 16px;
  margin-right: 80px;
}

.logo-toolbar-title {
  margin-top: 16px;
  margin-bottom: 16px;
  margin-right: 80px;
}

</style>