<script setup>
import { ref, onMounted, defineExpose, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal.css';
import api from '../../../api';
import { format } from 'date-fns';

const events = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const jadwalList = ref([]);
const tanggalList = ref([]);
const viewModal = ref(false);
const viewModal2 = ref(false);
const activeView = ref('month');
const clickedDate = ref(null);

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
    const response = await api.get('/api/jp');
    jadwalList.value = response.data.data;
    events.value = jadwalList.value.map(jadwal => ({
      start: new Date(jadwal.tanggal),
      end: new Date(jadwal.tanggal),
      title: jadwal.agenda,
      content: `Cabang: ${getNamaCabang(jadwal.cabang)}, Departement: ${getNamaDepartement(jadwal.status)}`,
    }));
    console.log("Events:", events.value);
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const addEventForDate = async (date) => {
  if (activeView.value !== 'month') return;

  const tanggal = format(new Date(date), 'yyyy-MM-dd');
  clickedDate.value = tanggal;
  console.log("tanggal klik : ", tanggal);
  try {
    const response = await api.get(`/api/tglp/${tanggal}`);
    tanggalList.value = response.data.data;
    console.log("tanggal1", response);
    viewModal2.value = true;
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cp');
    console.log(response);
    cabangList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const fetchDataDepartement = async () => {
  try {
    const response = await api.get('/api/dp');
    console.log(response);
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

onMounted(() => {
  fetchDataJadwal();
  fetchDataCabang();
  fetchDataDepartement();
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
        <h2 style="text-align: center;">Lihat Jadwal</h2>
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
            <tr v-for="(jadwal, index) in jadwalList" :key="jadwal.id_jadwal">
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
