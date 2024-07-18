// src/store/modules/auth.js
const state = {
    token: localStorage.getItem('token') || ''
  };
  
  const mutations = {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = '';
      localStorage.removeItem('token');
    }
  };
  
  const actions = {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    clearToken({ commit }) {
      commit('clearToken');
    }
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  };
  