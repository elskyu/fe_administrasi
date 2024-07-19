<template>
  <div id="app">
    <!-- Conditionally render the Sidebar -->
    <Sidebar v-if="showSidebar && userType === 'admin'"></Sidebar>
    <sidebar2 v-else-if="showSidebar && userType === 'pegawai'"></sidebar2>
    
    <!-- Main content area -->
    <div :class="{'content-area-with-sidebar': showSidebar}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import sidebar2 from './components/sidebar2.vue';
import { isTokenExpired } from './utils/auth';
import store from './store';

export default {
  name: 'App',
  components: {
    Sidebar,
    sidebar2
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userType = computed(() => {
      return localStorage.getItem('userType');
    });
    const isLoginRoute = computed(() => {
      return route.name === 'login' || route.name === 'error';
    });

    const showSidebar = computed(() => {
      return !isLoginRoute.value;
    });

    onMounted(() => {
      const interval = setInterval(() => {
        const token = store.state.auth.token;
        if (isTokenExpired(token)) {
          store.dispatch('auth/clearToken');
          router.push({ name: 'error' });
        }
      }, 25000);

      onUnmounted(() => {
        clearInterval(interval);
      });
    });

    return { userType, isLoginRoute, showSidebar };
  }
};
</script>

<style>
.content-area {
  padding: 20px;
}
</style>
