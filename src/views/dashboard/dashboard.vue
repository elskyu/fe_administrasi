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
const monthList = ref([]);
const yearList = ref([]);
const departementList = ref([]);
const jadwalList = ref([]);
const tanggalList = ref([]);
const currentJadwalId = ref(null);
const showModal = ref(false);
const viewModal = ref(false);
const viewModal2 = ref(false);
const editModal = ref(false);
const activeView = ref('month');
const clickedDate = ref(null);
const cabangFilter = ref('');
const searchQuery = ref('');
const monthFilter = ref ('');
const yearFilter = ref ('');
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

const filteredJadwal = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;
  const month = monthFilter.value;
  const year = yearFilter.value;

  let filtered = jadwalList.value;

  if (query) {
    filtered = filtered.filter(jadwal =>
      jadwal.tanggal.toLowerCase().includes(query) ||
      getNamaCabang(jadwal.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(jadwal => jadwal.cabang === cabang);
  }
  // Filter by month
  if (month) {
    filtered = filtered.filter(jadwal => new Date(jadwal.tanggal).getMonth() + 1 === parseInt(month));
  }

  // Filter by year
  if (year) {
    filtered = filtered.filter(jadwal => new Date(jadwal.tanggal).getFullYear() === parseInt(year));
  }

  return filtered;
});

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
        <h2 style="text-align: center">View Events</h2>
        <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari"
                      style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
                      </option>
                    </select>
                    <select id="monthFilter" v-model="monthFilter" class="form-cari" style="margin-right: 10px; width: 150px;">
                      <option v-for="m in monthList" :value="m.value" :key="m.value">{{ m.text }}</option>
                    </select>
                    <select id="yearFilter" v-model="yearFilter" class="form-cari" style="margin-right: 10px; width: 150px;">
                      <option v-for="y in yearList" :value="y" :key="y">{{ y }}</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari agenda"
                        style="width: 100%;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>
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
            <tr v-for="jadwal in filteredJadwal" :key="jadwal.id_jadwal">
              <td>{{ jadwal.id_jadwal }}</td>
              <td>{{ jadwal.agenda }}</td>
              <td>{{ jadwal.status === null ? 'Seluruh Departement' : "Departement " + getNamaDepartement(jadwal.status) }}</td>
              <td>{{ getNamaCabang(jadwal.cabang) }}</td>
              <td>{{ new Date(jadwal.tanggal).toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
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
        <h2 style="text-align: center">
          {{ new Date(clickedDate ?? new Date()).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>Jadwal</th>
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
            <tr v-for="tanggall in tanggalList" :key="tanggall.tanggal">
              <td>{{ formatTime(tanggall.tanggal) }}</td>
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
