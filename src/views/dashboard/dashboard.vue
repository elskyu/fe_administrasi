<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import '/src/style/kalender_jadwal.css';

const events = ref([]);

const fetchEvents = async () => {
  try {
    const response = await api.get('/endpoint'); // Ganti '/endpoint' dengan endpoint API yang sesuai
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(() => {
  fetchEvents();
});

const createEvent = (event) => {
  events.value.push(event);
};

const editEvent = (event) => {
  console.log('Edit event', event);
};

const changeEvent = (event) => {
  console.log('Event changed', event);
};

defineExpose({
  createEvent,
  editEvent,
  changeEvent
});

</script>

<template>
    <div class="background-container">
        <div class="content">
            <div class="container mt-5 mb-5">
                <div class="row">
                    <div class="card2" style="">
                        <h2>DASHBOARD</h2>
                    </div>
                </div>
                
            </div>
            <div class="card3">
                <div class="calendar-container">
                        <VueCal
                              :events="events"
                              @event-create="createEvent"
                              @event-click="editEvent"
                              @event-change="changeEvent"
                              default-view="week"
                              style="width: 100%; height: 600px;" 
                        />
                </div>
            </div>
        </div>
    </div>    
</template>