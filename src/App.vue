<template>
  <div id="app" class="h-screen">
    <div class="flex justify-between bg-indigo-900 text-white p-5 mb-5">
      <div>
        <router-link class="mr-4" to="/">Home</router-link>
        <router-link class="mr-4" v-if="isLoggedIn" to="/submit">Submit</router-link>
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
    <div class="flex mx-auto px-5">
    <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    async logout () {
      await axios.post("/api/auth/logout/")
      this.$store.dispatch("logout")
    }
  }
}
</script>
