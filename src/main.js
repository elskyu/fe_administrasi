import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import PrimeVue from 'primevue/config';


import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

//create App Vue
const app = createApp(App);

app.use(Toast, {
    position: POSITION.TOP_RIGHT
  });

app.use(router);
app.use(PrimeVue);
app.mount('#app');