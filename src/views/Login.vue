<template>
  <div class="flex mx-auto justify-center">
    <div>
      <h1 class="font-bold text-lg mb-3">Login</h1>
      <p
        v-show="invalidLogin"
        class="mb-3 bg-red-500 text-white p-2 text-center"
      >
        Sorry, invalid!
      </p>
      <form @submit.prevent="authenticate">
        <p class="mb-3">
          <input
            type="text"
            name="username"
            v-model="username"
            class="appearance-none p-1 border"
          />
        </p>
        <p class="mb-3">
          <input
            type="password"
            name="password"
            v-model="password"
            class="appearance-none p-1 border"
          />
        </p>

        <p>
          <button type="submit" class="border bg-blue-500 text-white py-2 px-4">
            Login
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      invalidLogin: false
    };
  },
  methods: {
    async authenticate() {
      this.invalidLogin = false;
      const data = new URLSearchParams();
      data.append("login", this.username);
      data.append("password", this.password);
      try {
        const response = await axios({
          data,
          url: "/api/auth/login/",
          method: "POST"
        });
        if (response.status === 200) {
          //  full page reload : could also do a "fetch" if we wanted
          window.location.href = "/";
        } else if (response.status === 400) {
          this.invalidLogin = true;
        }
      } catch (e) {
        console.log("error", e);
        this.invalidLogin = true;
      }
    }
  }
};
</script>
