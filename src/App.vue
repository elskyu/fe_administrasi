<template>
  <div id="app">
    <!-- Conditionally render the Sidebar -->
    <Sidebar v-if="userType === 'admin' && !isLoginRoute"></Sidebar>
    <sidebar2 v-else-if="userType === 'pegawai' && !isLoginRoute"></sidebar2>
    
    <!-- Main content area -->
    <div :class="{'content-area-with-sidebar': !isLoginRoute}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import sidebar2 from './components/sidebar2.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Sidebar,
    sidebar2
  },
  setup() {
    const route = useRoute();
    const userType = computed(() => {
      // Retrieve userType from localStorage or Vuex if needed
      return localStorage.getItem('userType');
    });
    const isLoginRoute = computed(() => route.name === 'login');
    return { userType, isLoginRoute };
  },
};
</script>

<style>
.content-area {
  padding: 20px;
  /* Add styles for main content area here */
}
</style>
