import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    messages: []
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    addMessages(state, messages) {
      state.messages = messages;
    },
    addMessage(state, message) {
      state.messages.push(message);
    }
  },
  actions: {
    authenticate({ commit }, user) {
      commit("setCurrentUser", user);
    },
    logout({ commit }) {
      commit("setCurrentUser", null);
    },
    addMessages({ commit }, messages) {
      commit("addMessages", messages);
    },
    addMessage({ commit }, message) {
      commit("addMessage", message);
    },
    clearMessages({ commit }) {
      commit("addMessages", []);
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.currentUser;
    },
    isOwner(state) {
      return post =>
        !!state.currentUser && post.author === state.currentUser.username;
    }
  },
  modules: {}
});
