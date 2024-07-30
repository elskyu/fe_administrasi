<script setup>
import { ref, onMounted, defineExpose, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal.css';
import api from '../../api';
import { format } from 'date-fns';

const events = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const jadwalList = ref([]);
const tanggalList = ref([]);
const currentEvents = ref([]);
const currentTanggal = ref(null);
const currentJadwalId = ref(null);
const showModal = ref(false);
const viewModal = ref(false);
const viewModal2 = ref(false);
const editModal = ref(false);
const activeView = ref('month');
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
    const response = await api.get('/api/jadwal');
    jadwalList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const addEventForDate = async (date) => {
  if (activeView.value !== 'month') return;

  const tanggal = format(new Date(date), 'yyyy-MM-dd');
  console.log("tanggal klik : ", tanggal);
  try {
    const response = await api.get(`/api/showtgl/${tanggal}`);
    tanggalList.value = response.data.data;
    console.log("tanggal1", response);
    viewModal2.value = true;
  } catch (error) {
    console.error('Error fetching jadwal list:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cabang');
    console.log(response);
    cabangList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const fetchDataDepartement = async () => {
  try {
    const response = await api.get('/api/departement');
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

const editJadwal = (j) => {
  currentJadwalId.value = j.id_jadwal;
  editFormData.value = {
    id_jadwal: j.id_jadwal,
    agenda: j.agenda,
    department: j.departement,
    tanggal: j.tanggal,
    cabang: j.cabang,
  };
  editModal.value = true;
};

const saveNewJadwal = async () => {
  try {
    await api.post('/api/jadwal', addFormData.value);
    addFormData.value = {
      id_jadwal: '',
      agenda: '',
      departement: '',
      tanggal: '',
      cabang: '',
    };
    showModal.value = false;
    fetchDataJadwal();
  } catch (error) {
    console.error('Error saving new jadwal:', error);
  }
};

const saveEditJadwal = async () => {
  try {
    await api.put(`/api/jadwal/${currentJadwalId.value}`, editFormData.value);
    editFormData.value = {
      id_jadwal: '',
      agenda: '',
      departement: '',
      tanggal: '',
      cabang: '',
    };
    editModal.value = false;
    fetchDataJadwal();
  } catch (error) {
    console.error('Error saving edit jadwal:', error);
  }
};

const viewAllEvents = async () => {
  await fetchDataJadwal();
  viewModal.value = true;
};

const deleteJadwal = async (id_jadwal) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/jadwal/${id_jadwal}`);
      jadwalList.value = jadwalList.value.filter(jadwalList => jadwalList.id_jadwal !== id_jadwal);
      fetchDataJadwal();
    } catch (error) {
      console.error('Error deleting jadwal:', error);
    }
  }
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
            <button @click="showModal = true" class="btn btn-primary">Create Event</button>
            <button @click="viewAllEvents" class="btn btn-secondary">View Events</button>
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

    <!-- Create Event Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">Create Event</h2>
        <form @submit.prevent="saveNewJadwal" class="form-container">
          <div class="form-group">
            <label for="id_jadwal" style="width: 195px;">ID</label>
            <input type="text" id="id_jadwal" v-model="addFormData.id_jadwal" />
          </div>
          <div class="form-group">
            <label for="agenda">Agenda</label>
            <input type="text" id="agenda" v-model="addFormData.agenda" required>
          </div>

          <div class="form-group-row">
            <div class="form-group">
              <label for="departement" style="width:450px;">Departement</label>
              <select type="text" id="departement" v-model="addFormData.status">
                <option v-for="d in departementList" :value="d.id_departement" :key="d.id_departement">{{ d.nama_departement }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="cabang" style="width: 450px;">Cabang</label>
              <select type="text" id="cabang" v-model="addFormData.cabang">
                <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="tanggal">Jadwal</label>
            <input type="datetime-local" id="tanggal" v-model="addFormData.tanggal">
          </div>

          <div class="form-group">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="showModal = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Events Modal -->
    <div v-if="viewModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">View Events</h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>ID</th>
              <th>Agenda</th>
              <th>Departement</th>
              <th>Cabang</th>
              <th>Jadwal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="jadwal in jadwalList" :key="jadwal.id_jadwal">
              <td>{{ jadwal.id_jadwal }}</td>
              <td>{{ jadwal.agenda }}</td>
              <td>{{ getNamaDepartement(jadwal.status) }}</td>
              <td>{{ getNamaCabang(jadwal.cabang) }}</td>
              <td>{{ jadwal.tanggal }}</td>
              <td>
                <button @click="editJadwal(jadwal)" class="btn btn-primary">Edit</button>
                <button @click="deleteJadwal(jadwal.id_jadwal)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="viewModal = false" class="btn btn-danger">Close</button>
      </div>
    </div>

    <div v-if="viewModal2" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">View Events</h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>Jadwal</th>
              <th>Agenda</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tanggall in tanggalList" :key="tanggall.tanggal">
              <td>{{ tanggall.tanggal }}</td>
              <td>{{ tanggall.agenda }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="viewModal2 = false" class="btn btn-danger">Close</button>
      </div>
    </div>

    <!-- Edit Event Modal -->
    <div v-if="editModal" class="modal">
      <div class="modal-content-kalendar">
        <h2>Edit Event</h2>
        <form @submit.prevent="saveEditJadwal" class="form-container">
          <div class="form-group">
            <label for="id_jadwal">ID</label>
            <input type="text" id="id_jadwal" v-model="editFormData.id_jadwal" />
          </div>
          <div class="form-group">
            <label for="agenda">Agenda</label>
            <input type="text" id="agenda" v-model="editFormData.agenda" required>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="departement" style="width:450px">Departement</label>
              <select type="text" id="departement" v-model="editFormData.status">
                <option v-for="d in departementList" :value="d.id_departement" :key="d.id_departement">{{ d.nama_departement }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="cabang" style="width:450px">Cabang</label>
              <select type="text" id="cabang" v-model="editFormData.cabang">
                <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="tanggal">Jadwal</label>
            <input type="datetime-local" id="tanggal" v-model="editFormData.tanggal">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="editModal = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
