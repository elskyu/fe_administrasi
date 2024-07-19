import { createStore } from 'vuex';

export default createStore({
  state: {
    auth: {
      token: localStorage.getItem('token') || null
    }
  },
  mutations: {
    setToken(state, token) {
      state.auth.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.auth.token = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  },
  modules: {
  }
});
