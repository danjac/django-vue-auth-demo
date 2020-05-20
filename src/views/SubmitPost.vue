<template>
  <div>
    <h1 class="font-bold text-lg mb-3 pb-1 border-b">Submit</h1>
    <p
      v-show="invalidSubmit"
      class="mb-3 bg-red-500 text-white p-2 text-center"
    >
      Sorry, invalid!
    </p>

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
      invalidSubmit: false
    };
  },
  methods: {
    async submit() {
      try {
        await axios.post("/api/posts/", this.post);
        this.$store.dispatch("addMessage", {
          message: "Your post has been submitted!",
          level: "success"
        });
        this.$router.push("/");
      } catch (e) {
        console.log(e)
        this.invalidSubmit = true;
      }
    }
  }
};
</script>
