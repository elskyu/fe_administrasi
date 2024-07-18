<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal.css';
import api from '@/api';

const events = ref([]);
const showModal = ref(false); // State untuk mengontrol visibilitas modal tambah acara
const viewModal = ref(false); // State untuk mengontrol visibilitas modal view acara
const editModal = ref({
  show: false,
  event: null
}); // State untuk mengontrol visibilitas modal edit acara
const newEvent = ref({
  title: '',
  start: '',
  end: ''
});

const fetchEvents = async () => {
  try {
    const response = await api.get('/endpoint'); // Ganti dengan endpoint API Anda yang sebenarnya
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(() => {
  fetchEvents();
});

const createEvent = () => {
  const event = {
    title: newEvent.value.title,
    start: new Date(newEvent.value.start),
    end: new Date(newEvent.value.end)
  };
  events.value.push(event);
  resetForm();
  showModal.value = false; // Tutup modal
};

const viewAllEvents = () => {
  viewModal.value = true;
};

const openEditModal = (event) => {
  editModal.value.show = true;
  editModal.value.event = { ...event };
};

const updateEvent = () => {
  const eventIndex = events.value.findIndex(e => e.id === editModal.value.event.id);
  if (eventIndex !== -1) {
    events.value[eventIndex] = { ...editModal.value.event };
  }
  editModal.value.show = false;
};

const deleteEvent = (event) => {
  const index = events.value.indexOf(event);
  if (index > -1) {
    events.value.splice(index, 1);
  }
  if (editModal.value.show) {
    editModal.value.show = false;
  }
};

const resetForm = () => {
  newEvent.value.title = '';
  newEvent.value.start = '';
  newEvent.value.end = '';
};

const changeEvent = (event) => {
  console.log('Event changed', event);
};

defineExpose({
  createEvent,
  viewAllEvents,
  openEditModal,
  changeEvent,
  updateEvent,
  deleteEvent
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>DASHBOARD</h2>
          </div>
        </div>
      </div>
      
      <div class="card3">
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="showModal = true" class="btn btn-primary">Create Event</button>
            <button @click="viewAllEvents" class="btn btn-secondary">View Events</button>
          </div>
          <VueCal
            :events="events"
            @event-click="viewEvent"
            @event-change="changeEvent"
            default-view="week"
            style="width: 100%; height: 520px;"
          />
        </div>
      </div>
    </div>

    <!-- Create Event Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>Create Event</h2>
        <form @submit.prevent="createEvent" class="form-container">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="newEvent.title" required>
          </div>
          
          <div class="form-group">
            <label for="start">Start:</label>
            <input type="datetime-local" id="start" v-model="newEvent.start" required>
          </div>
          
          <div class="form-group">
            <label for="end">End:</label>
            <input type="datetime-local" id="end" v-model="newEvent.end" required>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Events Modal -->
    <div v-if="viewModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="viewModal = false">&times;</span>
        <h2>All Events</h2>
        <div class="event-list">
          <div v-for="event in events" :key="event.id" class="event-item">
            <div>
              <label>Title:</label>
              <p>{{ event.title }}</p>
            </div>
            <div>
              <label>Start:</label>
              <p>{{ new Date(event.start).toLocaleString() }}</p>
            </div>
            <div>
              <label>End:</label>
              <p>{{ new Date(event.end).toLocaleString() }}</p>
            </div>
            <div class="event-actions">
              <button @click="openEditModal(event)" class="btn btn-warning">Edit</button>
              <button @click="deleteEvent(event)" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Event Modal -->
    <div v-if="editModal.show" class="modal">
      <div class="modal-content">
        <span class="close" @click="editModal.show = false">&times;</span>
        <h2>Edit Event</h2>
        <form @submit.prevent="updateEvent">
          <div class="form-group">
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title" v-model="editModal.event.title" required>
          </div>
          <div class="form-group">
            <label for="edit-start">Start:</label>
            <input type="datetime-local" id="edit-start" v-model="editModal.event.start" required>
          </div>
          <div class="form-group">
            <label for="edit-end">End:</label>
            <input type="datetime-local" id="edit-end" v-model="editModal.event.end" required>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>