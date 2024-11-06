<template>
  <div id="explore" class="pa-4" :style="{ backgroundColor: '#131313' }">
    <v-container fluid>
      <v-alert prominent type="error" v-if="errored" color="#252525" text="#f4efe1">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Error!</div>
            <div>
              Something went wrong, but don’t fret — let’s give it another shot.
            </div>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="loadData" color="#f4efe1" text>Take action</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <main v-else class="main-content">
        <!-- Recently Visited -->
        <h3 class="headline font-weight-medium">Recently Visited</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(page, i) in recentlyVisited"
            :key="`recent-${i}`"
            class="mx-xs-auto"
          >
            <router-link to="#" class="post-card">
              <v-img
                :src="page.image"
                class="image"
                height="150"
                contain
              ></v-img>
              <h4>{{ page.title }}</h4>
              <p>{{ page.content }}</p>
            </router-link>
          </v-col>
        </v-row>

        <!-- Creators for You -->
        <h3 class="headline font-weight-medium mt-4">Creators for You</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(creator, i) in creatorsForYou"
            :key="`creator-${i}`"
            class="mx-xs-auto"
          >
            <router-link to="#" class="creator-card">
              <v-img
                :src="creator.image"
                class="image"
                height="100"
                contain
              ></v-img>
              <h4>{{ creator.name }}</h4>
              <p>{{ creator.description }}</p>
            </router-link>
          </v-col>
        </v-row>

        <!-- Popular This Week -->
        <h3 class="headline font-weight-medium mt-4">Popular This Week</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(popular, i) in popularThisWeek"
            :key="`popular-${i}`"
            class="mx-xs-auto"
          >
            <router-link to="#" class="post-card">
              <v-img
                :src="popular.image"
                class="image"
                height="150"
                contain
              ></v-img>
              <h4>{{ popular.title }}</h4>
              <p>{{ popular.content }}</p>
            </router-link>
          </v-col>
        </v-row>

        <!-- Explore Topics -->
        <h3 class="headline font-weight-medium mt-4">Explore Topics</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(topic, i) in exploreTopics"
            :key="`topic-${i}`"
            class="mx-xs-auto"
          >
            <router-link to="#" class="topic-card">
              <v-img
                :src="topic.image"
                class="image"
                height="100"
                contain
              ></v-img>
              <h4>{{ topic.name }}</h4>
            </router-link>
          </v-col>
        </v-row>

        <!-- New on Patreon -->
        <h3 class="headline font-weight-medium mt-4">New on Patreon</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-for="(newPost, i) in newOnPatreon"
            :key="`new-${i}`"
            class="mx-xs-auto"
          >
            <router-link to="#" class="post-card">
              <v-img
                :src="newPost.image"
                class="image"
                height="150"
                contain
              ></v-img>
              <h4>{{ newPost.title }}</h4>
              <p>{{ newPost.content }}</p>
            </router-link>
          </v-col>
        </v-row>
      </main>

    </v-container>
  </div>
</template>


<script>
import moment from 'moment'

export default {
  name: 'explore',
  data: () => ({
    errored: false,
    recentlyVisited: [],
    creatorsForYou: [],
    popularThisWeek: [],
    exploreTopics: [],
    newOnPatreon: []
  }),
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      // Dummy data for each section with image URLs
      const placeholderImage = 'https://via.placeholder.com/350x150';

      this.recentlyVisited = Array.from({ length: 4 }, (_, i) => ({
        title: `Recently Visited Post ${i + 1}`,
        content: `Content for recently visited post ${i + 1}.`,
        image: placeholderImage
      }));

      this.creatorsForYou = Array.from({ length: 8 }, (_, i) => ({
        name: `Creator ${i + 1}`,
        description: `Description of creator ${i + 1}.`,
        image: placeholderImage
      }));

      this.popularThisWeek = Array.from({ length: 12 }, (_, i) => ({
        title: `Popular Post ${i + 1}`,
        content: `Content for popular post ${i + 1}.`,
        image: placeholderImage
      }));

      this.exploreTopics = Array.from({ length: 8 }, (_, i) => ({
        name: `Topic ${i + 1}`,
        image: placeholderImage
      }));

      this.newOnPatreon = Array.from({ length: 8 }, (_, i) => ({
        title: `New Post ${i + 1}`,
        content: `Content for new post ${i + 1}.`,
        image: placeholderImage
      }));
    },
    dateFormatter(date) {
      return moment(date).fromNow();
    }
  }
}
</script>

<style lang="scss">
.main-content {
  padding-left: 150px; /* Adjust the left padding */
  padding-right: 150px; /* Adjust the right padding */
}

.post-card, .creator-card, .topic-card {
  background-color: #252525;
  color: #f4efe1;
  padding: 16px; /* Keep the internal padding for each card */
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.post-card, .creator-card, .topic-card {
  display: block; /* Makes the link behave like a block element */
  text-decoration: none; /* Removes the underline from the link */
  color: inherit; /* Keeps the text color from the parent */
}

.image {
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #252525;
}

.v-alert .title, .v-alert div, .headline, .post-card h4, .post-card p, .creator-card h4, .creator-card p, .topic-card h4 {
  color: #f4efe1;
}

h3.headline {
  color: #f4efe1; /* Ensure headlines are visible */
  margin-top: 16px; /* Margin above each headline */
}
</style>
