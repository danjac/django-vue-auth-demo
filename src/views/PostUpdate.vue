<template>
  <div>
    <h1 class="font-bold text-lg mb-3 pb-1 border-b">Submit</h1>
    <p
      v-show="invalidSubmit"
      class="mb-3 bg-red-500 text-white p-2 text-center"
    >
      Sorry, invalid!
    </p>

    <!-- TBD: extract into a PostForm component... -->
    <form @submit.prevent="submit">
      <p class="mb-3">
        <label class="block font-semibold mb-1">Title</label>
        <input
          type="text"
          name="title"
          v-model="post.title"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="mb-3">
        <label class="block font-semibold mb-1">URL</label>
        <input
          type="url"
          name="url"
          v-model="post.url"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="mb-3">
        <label class="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          v-model="post.description"
          class="appearance-none p-1 border"
        >
        </textarea>
      </p>

      <p>
        <button type="submit" class="border bg-blue-500 text-white py-2 px-4">
          Submit
        </button>
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      post: {
        title: "",
        description: "",
        url: ""
      },
      loading: false,
      invalidSubmit: false
    };
  },
  computed: {
    endpoint() {
      return `/api/posts/${this.$route.params.id}/`;
    }
  },
  async created() {
    this.loading = true;
    try {
      const response = await axios.get(this.endpoint);
      this.post = response.data;
    } catch (e) {
      // TBD: redirect to home page with some msg or something...
      console.log(e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async submit() {
      try {
        await axios.put(this.endpoint, this.post);
        this.$router.push({ name: 'PostDetail', params: { id: this.$route.params.id } });
      } catch (e) {
        this.invalidSubmit = true;
      }
    }
  }
};
</script>
