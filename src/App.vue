<template>
  <div id="app">
    <!-- Conditionally render the Sidebar -->
    <Sidebar v-if="!isLoginRoute"></Sidebar>
    
    <!-- Main content area -->
    <div :class="{'content-area-with-sidebar': !isLoginRoute}">
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
  },
  setup() {
    const route = useRoute();
    const isLoginRoute = computed(() => route.name === 'login');

    return { isLoginRoute };
  },
};
</script>

<style>
/* Global styles can go here */
.content-area-with-sidebar {
  margin-left: 215px; /* Adjust to match the sidebar width */
  padding: 0px;
  width: calc(100% - 215px); /* Adjust to match the sidebar width */
}
</style>
