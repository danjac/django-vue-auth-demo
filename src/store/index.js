import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  actions: {
    authenticate({ commit }, user) {
      commit("setCurrentUser", user);
    },
    logout({ commit }) {
      commit("setCurrentUser", null);
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
