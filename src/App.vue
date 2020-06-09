<template>
  <div id="app" class="h-screen">
    <div class="flex justify-between bg-indigo-900 text-white p-5 mb-5">
      <div>
        <router-link class="mr-4" to="/">Home</router-link>
        <router-link class="mr-4" v-if="isLoggedIn" to="/submit"
          >Submit</router-link
        >
        <router-link to="/about">About</router-link>
      </div>
      <div v-if="isLoggedIn">
        <a href="#" @click.prevent="logout">Logout</a>
      </div>
      <div v-else>
        <router-link class="mr-4" to="/login">Login</router-link>
        <router-link to="/signup">Signup</router-link>
      </div>
    </div>
    <div v-if="messages" class="justify-center w-1/3 mx-auto my-3">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="block bg-blue-500 text-center text-white p-2 px-5 mb-3"
      >
        {{ message.message }}
      </div>
    </div>
    <div class="container mx-auto px-5">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    messages() {
      return this.$store.state.messages;
    }
  },
  mounted() {
    // we probably want to do this in a component, or
    // have vuex deal with this internally
    setTimeout(() => {
      this.$store.dispatch("clearMessages");
    }, 3000);
  },
  methods: {
    async logout() {
      await axios.post("/api/auth/logout/");
      // full page reload to clear cookies, state etc.
      window.location.href = "/";
    }
  }
};
</script>
