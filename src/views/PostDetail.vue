<template>
  <div>
    <div v-if="loading" class="mx-auto text-lg text-center items-center">
      Loading...
    </div>
    <div
      v-if="error"
      class="mx-auto text-lg items-center bg-red-500 p-6 text-white"
    >
      Sorry there was an error
    </div>
    <div v-if="post">
      <h3 class="text-lg font-semibold">
        <a
          v-if="post.url"
          :href="post.url"
          target="_blank"
          noreferrer=""
          nofollow=""
        >
          {{ post.title }}
        </a>
        <span v-else>{{ post.title }} </span>
      </h3>
      <div class="text-sm flex items-center">
        <span class="mr-3">
          {{ post.author }}
        </span>
        <router-link
          :to="{ name: 'PostUpdate', params: { id: post.id } }"
          v-if="isOwner"
          class="mr-3"
        >
          Edit
        </router-link>
        <a href="#" v-if="isOwner" @click.prevent="deletePost">
          Delete
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostDetail",
  data() {
    return {
      loading: false,
      error: false,
      post: null
    };
  },
  computed: {
    isOwner() {
      return this.post && this.$store.getters.isOwner(this.post);
    },
    endpoint() {
      return `/api/posts/${this.$route.params.id}/`;
    }
  },
  methods: {
    async deletePost() {
      // TBD: error handling...
      await axios.delete(this.endpoint);
      this.$store.dispatch("addMessage", {
        message: "Your post has been deleted",
        level: "info"
      });
      this.$router.push("/");
    }
  },
  async created() {
    this.loading = true;
    try {
      const response = await axios.get(this.endpoint);
      this.post = response.data;
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>
