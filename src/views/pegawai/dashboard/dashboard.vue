<script setup>
import { ref, onMounted, watch } from 'vue';
import VueCal from 'vue-cal';
import axios from 'axios';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal_pegawai.css';
import '/src/style/loading.css';
import api from '../../../api';
import { format, parseISO } from 'date-fns';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const events = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const jadwalList = ref([]);
const tanggalList = ref([]);
const viewModal = ref(false);
const viewModal2 = ref(false);
const activeView = ref('month');
const clickedDate = ref(null);
const currentMonth = ref('');
const currentYear = ref('');
const currentMonthYear = ref(new Date());
const isLoading = ref(true);

const addFormData = ref({
  id_jadwal: '',
  agenda: '',
  status: '',
  tanggal: '',
  cabang: ''
});

const editFormData = ref({
  id_jadwal: '',
  agenda: '',
  status: '',
  tanggal: '',
  cabang: ''
});

const fetchDataJadwal = async () => {
  try {
    const response = await api.get(`/api/jp?tahun?=${currentYear.value}&bulan?=${currentMonth.value}`);
    jadwalList.value = response.data.data;
    events.value = jadwalList.value.map(jadwal => ({
      start: new Date(jadwal.tanggal),
      end: new Date(jadwal.tanggal),
      title: jadwal.agenda,
      content: `Cabang: ${getNamaCabang(jadwal.cabang)}, Departement: ${getNamaDepartement(jadwal.status)}`,
    }));
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const addEventForDate = async (date) => {
  if (activeView.value !== 'month') return;
  const tanggal = format(new Date(date), 'yyyy-MM-dd');
  clickedDate.value = tanggal;
  try {
    const response = await api.get(`/api/tglp/${tanggal}`);
    tanggalList.value = response.data.data;
    viewModal2.value = true;
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cp');
    cabangList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const fetchDataDepartement = async () => {
  try {
    const response = await api.get('/api/dp');
    departementList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const getNamaDepartement = (idDepartement) => {
  const departement = departementList.value.find(d => d.id_departement === idDepartement);
  return departement ? departement.nama_departement : '';
};

const viewAllEvents = async () => {
  await fetchDataJadwal();
  viewModal.value = true;
};

const formatTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const changeEvent = (event) => {
  console.log('Event changed', event);
};

const handleViewChange = (view) => {
  let startDate;

  if (view.startDate) {
    startDate = view.startDate;
  } else if (view.start) {
    startDate = view.start;
  } else {
    console.error("Invalid view object:", view);
    return;
  }

  const date = new Date(startDate);
  currentMonth.value = date.getMonth() + 1;
  currentYear.value = date.getFullYear();
};

watch([currentMonth, currentYear], async () => {
  currentMonthYear.value = new Date(currentYear.value, currentMonth.value - 1);
  await fetchDataJadwal();
});

onMounted(async () => {
  const initialView = {
    start: new Date()
  };
  handleViewChange(initialView);
  fetchDataCabang();
  fetchDataDepartement();
  await fetchDataJadwal();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Dashboard</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
          </div>
        </div>
      </div>

      <div class="card3" style="margin-left: 3px;">
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="viewAllEvents" class="btn btn-md btn-success" style="margin-left: 0px;">Lihat
              Jadwal</button>
          </div>

          <VueCal hide-view-selector :time="false" active-view="month" v-model:active-view="activeView" xsmall
            :disable-views="['years', 'week', 'day']" events-count-on-year-view :events="events"
            events-on-month-view="short" @view-change="handleViewChange" @event-click="viewEvent"
            @cell-click="addEventForDate" @event-change="changeEvent" locale="id" />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <Loading /> <!-- Menampilkan komponen loading -->
    </div>

    <!-- View Events Modal -->
    <div v-if="viewModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">
          Jadwal Bulan
          {{ currentMonthYear.toLocaleString('id-ID', { month: 'long', year: 'numeric' }) }}
        </h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>No</th>
              <th>Agenda</th>
              <th>Status</th>
              <th>Tanggal/Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="jadwalList.length === 0">
              <td colspan="11" class="text-center">
                <div class="alert alert-warning mb-0">
                  Belum ada jadwal pada bulan ini.
                </div>
              </td>
            </tr>
            <tr v-else v-for="(jadwal, index) in jadwalList" :key="jadwal.id_jadwal">
              <td>{{ index + 1 }}</td>
              <td>{{ jadwal.agenda }}</td>
              <td>{{ jadwal.status === null ? 'Seluruh Departement' : "Departement " + getNamaDepartement(jadwal.status)
                }}</td>
              <td>{{ new Date(jadwal.tanggal).toLocaleString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit'
              }) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="viewModal = false" class="btn btn-danger">Tutup</button>
      </div>
    </div>

    <!-- View Date Modal -->
    <div v-if="viewModal2" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">
          {{ new Date(clickedDate ?? new Date()).toLocaleString('id-ID', {
            weekday: 'long', day: 'numeric', month:
              'long', year: 'numeric'
          }) }}
        </h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>Waktu</th>
              <th>Agenda</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tanggalList.length === 0">
              <td colspan="11" class="text-center">
                <div class="alert alert-warning mb-0">
                  Belum ada jadwal pada tanggal ini.
                </div>
              </td>
            </tr>
            <tr v-else v-for="tanggall in tanggalList" :key="tanggall.tanggal">
              <td>{{ formatTime(tanggall.tanggal) }}</td>
              <td>{{ tanggall.agenda }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="viewModal2 = false" class="btn btn-danger">Tutup</button>
      </div>
    </div>
  </div>
</template>
