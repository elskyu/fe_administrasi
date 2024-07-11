<!-- App.vue -->
<template>
  <div id="app">
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
  },
};
</script>

<style>
/* Global styles can go here */
</style>
