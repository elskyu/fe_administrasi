<script setup>
import { ref, onMounted, watch } from 'vue';
import VueCal from 'vue-cal';
import axios from 'axios';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal.css';
import api from '../../../api';
import { format, parseISO } from 'date-fns';

const events = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const jadwalList = ref([]);
const tanggalList = ref([]);
const viewModal = ref(false);
const viewModal2 = ref(false);
const activeView = ref('month');
const clickedDate = ref(null);
const userName = ref('');
const currentMonth = ref('');
const currentYear = ref('');
const currentMonthYear = ref(new Date());


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

const fetchUserName = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/userpegawai', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = response.data;
      if (user && user.nama) {
        userName.value = user.nama;
      } else {
        console.error('Data pengguna tidak ditemukan dalam respons');
      }
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error);
    }
  } else {
    console.error('Token tidak ditemukan');
  }
};

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

onMounted(() => {
  const initialView = {
    start: new Date()
  };
  handleViewChange(initialView);
  fetchUserName();
  fetchDataJadwal();
  fetchDataCabang();
  fetchDataDepartement();
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
            <div class="form-group-row" style="display: flex; align-items: center; margin-right: 20px;">
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                style="align-items: center; margin-right: 5px;">
                <path
                  d="M10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM4.023 13.416C5.491 15.606 7.695 17 10.16 17C12.624 17 14.829 15.607 16.296 13.416C14.6317 11.8606 
                  12.4379 10.9968 10.16 11C7.88171 10.9966 5.68751 11.8604 4.023 13.416V13.416ZM10 9C10.7956 9 11.5587 8.68393 12.1213 8.12132C12.6839 7.55871 13 6.79565 13 6C13 5.20435 12.6839 4.44129 12.1213 
                  3.87868C11.5587 3.31607 10.7956 3 10 3C9.20435 3 8.44129 3.31607 7.87868 3.87868C7.31607 4.44129 7 5.20435 7 6C7 6.79565 7.31607 7.55871 7.87868 8.12132C8.44129 8.68393 9.20435 9 10 9V9Z"
                  fill="#44d569" />
              </svg>
              <h4>{{ userName }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="card3">
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="viewAllEvents" class="btn btn-secondary">Lihat Jadwal</button>
          </div>

          <VueCal
            hide-view-selector
            :time="false"
            active-view="month"
            v-model:active-view="activeView"
            xsmall
            :disable-views="['years', 'week', 'day']"
            events-count-on-year-view
            :events="events"
            @view-change="handleViewChange"
            @event-click="viewEvent"
            @cell-click="addEventForDate"
            @event-change="changeEvent"
            style="width: 100%; height: 520px;"
            locale="id"
          />
        </div>
      </div>
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
              <td>{{ jadwal.status === null ? 'Seluruh Departement' : "Departement " + getNamaDepartement(jadwal.status) }}</td>
              <td>{{ new Date(jadwal.tanggal).toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
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
          {{ new Date(clickedDate ?? new Date()).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
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
