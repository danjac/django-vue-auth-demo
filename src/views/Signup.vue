<template>
  <div>
    <h1 class="font-bold text-lg mb-3">Signup</h1>
    <p
      v-show="invalidSignup"
      class="mb-3 bg-red-500 text-white p-2 text-center"
    >
      Sorry, invalid!
    </p>
    <form @submit.prevent="authenticate" :disabled="loading">
      <label class="block font-semibold mb-1">Username</label>
      <p class="mb-3">
        <input
          type="text"
          name="username"
          v-model="username"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="text-red-500 font-semibold mb-3" v-if="errors.username">
        {{ errors.username }}
      </p>
      <p class="mb-3">
        <label class="block font-semibold mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          v-model="email"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="text-red-500 font-semibold mb-3" v-if="errors.email">
        {{ errors.email }}
      </p>
      <p class="mb-3">
        <label class="block font-semibold mb-1">Password</label>
        <input
          type="password"
          name="password"
          v-model="password"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="text-red-500 font-semibold mb-3" v-if="errors.password1">
        {{ errors.password1 }}
      </p>
      <p class="mb-3">
        <label class="block font-semibold mb-1">Password (again)</label>
        <input
          type="password"
          name="password2"
          v-model="password2"
          class="appearance-none p-1 border"
        />
      </p>
      <p class="text-red-500 font-semibold mb-3" v-if="errors.password2">
        {{ errors.password2 }}
      </p>
      <p>
        <button type="submit" class="border bg-blue-500 text-white py-2 px-4">
          Signup
        </button>
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signup",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
      loading: false,
      errors: {},
      invalidSignup: false
    };
  },
  methods: {
    async authenticate() {
      this.invalidSignup = false;
      this.loading = true;
      this.errors = {};

      const data = new URLSearchParams();
      data.append("username", this.username);
      data.append("email", this.email);
      data.append("password1", this.password);
      data.append("password2", this.password2);

      try {
        await axios({
          data,
          url: "/api/auth/signup/",
          method: "POST"
        });
        //  full page reload : could also do a "fetch" if we wanted
        window.location.href = "/";
      } catch (e) {
        // extract errors from signup
        if (e.response.data && e.response.data.form) {
          const { fields } = e.response.data.form;
          Object.keys(fields).forEach(field => {
            this.errors[field] = fields[field].errors
              ? fields[field].errors[0]
              : null;
          });
        }
        this.invalidSignup = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
