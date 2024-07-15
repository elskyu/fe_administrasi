<template>
    <div>
      <vue-cal
        :events="events"
        :on-event-create="createEvent"
        :on-event-click="editEvent"
        :on-event-change="changeEvent"
        default-view="week"
      />
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal'; 
  import '../style/kalender_jadwal.css';
  
  export default {
    name: 'KalenderJadwal',
    components: { VueCal },
    data() {
      return {
        events: []
      };
    },
    methods: {
      createEvent(event) {
        // Tambahkan logika untuk membuat event baru
        this.events.push(event);
      },
      editEvent(event) {
        // Tambahkan logika untuk mengedit event yang ada
        console.log('Edit event', event);
      },
      changeEvent(event) {
        // Tambahkan logika untuk mengubah event yang ada
        console.log('Event changed', event);
      }
    }
  };
  </script>