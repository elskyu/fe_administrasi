<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/kalender_jadwal.css';
import '/src/style/table.css';
import '/src/style/loading.css';
import '/src/style/surat_masuk.css';
import api from '../../api';
import axios from 'axios';
import SearchIcon from '/src/style/SearchIcon.vue';
import { format } from 'date-fns';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const events = ref([]);
const cabangList = ref([]);
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
const departementFilter = ref('');
const currentMonth = ref('');
const currentYear = ref('');
const currentMonthYear = ref(new Date());
const keywordFilter = ref('');
const jadwalall = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
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

const changePage = async (page) => {
  console.log("s", page);
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await fetchDataInventaris(page); // Fetch data for the new page
  }
};

const fetchDataJadwal = async () => {
  try {
    const response = await api.get(`/api/jadwal?page=${currentPage.value}&tahun?=${currentYear.value}&bulan?=${currentMonth.value}&cabang?=${cabangFilter.value}&status?=${departementFilter.value}&keyword=${keywordFilter.value}`);
    jadwalList.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
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
    const response = await api.get(`/api/showtgl/${tanggal}`);
    tanggalList.value = response.data.data;
    console.log(tanggalList.value);
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
    status: j.status,
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
      status: '',
      tanggal: '',
      cabang: '',
    };
    showModal.value = false;
    fetchDataJadwal();
    generateNewJdwId();
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
      status: '',
      tanggal: '',
      cabang: '',
    };
    editModal.value = false;
    fetchDataJadwal();
    generateNewJdwId();
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
      generateNewJdwId();
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

const generateNewJdwId = async () => {
  try {
    const response = await api.get('/api/jadwalall');
    const jadwalall = response.data.data;

    if (jadwalall.length === 0) {
      addFormData.value.id_jadwal = "JDW001";
    } else {
      const existingIds = jadwalall.map(jdw => parseInt(jdw.id_jadwal.slice(3)));
      existingIds.sort((a, b) => a - b);

      let newId = null;
      for (let i = 0; i < existingIds.length; i++) {
        if (existingIds[i] !== i + 1) {
          newId = i + 1;
          break;
        }
      }
      if (newId === null) {
        newId = existingIds.length + 1;
      }

      addFormData.value.id_jadwal = `JDW${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Jadwal ID:', error);
  }
};

watch([currentMonth, currentYear, cabangFilter, departementFilter, keywordFilter, currentPage], async () => {
  currentMonthYear.value = new Date(currentYear.value, currentMonth.value - 1);
  await fetchDataJadwal();
});

onMounted(async () => {
  const initialView = {
    start: new Date()
  };
  handleViewChange(initialView);
  fetchDataJadwal();
  fetchDataCabang();
  fetchDataDepartement();
  await generateNewJdwId();
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

      <div class="card3">
        <div class="calendar-container">
          <div class="calendar-header" style="margin-top: 5px;">
            <button @click="showModal = true" class="btn btn-md btn-success" style="margin-left: 1px;">Tambah</button>
            <button @click="viewAllEvents" class="btn btn-warning" style="margin-right: 0px;">Lihat Jadwal</button>
          </div>
          <vue-cal hide-view-selector :time="false" active-view="month" v-model:active-view="activeView"
            :disable-views="['years', 'week', 'day']" events-count-on-year-view :events="events"
            @view-change="handleViewChange" @event-click="viewEvent" @cell-click="addEventForDate"
            @event-change="changeEvent" locale="id">
          </vue-cal>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <Loading /> <!-- Menampilkan komponen loading -->
    </div>

    <!-- Create Event Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">Tambah Data Jadwal</h2>
        <form @submit.prevent="saveNewJadwal" class="form-container">
          <div class="form-group">
            <label for="id_jadwal" style="width: 195px;">ID</label>
            <input type="text" id="id_jadwal" v-model="addFormData.id_jadwal" readonly />
          </div>
          <div class="form-group">
            <label for="agenda">Agenda</label>
            <input type="text" id="agenda" v-model="addFormData.agenda" required>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="departement" style="width:450px;">Status</label>
              <select type="text" id="departement" v-model="addFormData.status">
                <option value="">Semua Departement</option>
                <option v-for="d in departementList" :value="d.id_departement" :key="d.id_departement">{{
                  d.nama_departement }}</option>
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
            <button type="submit" class="btn btn-success" style="margin-left: 1px;">Simpan</button>
            <button type="button" @click="showModal = false" class="btn btn-danger">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Events Modal -->
    <div v-if="viewModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">
          Jadwal Bulan
          {{ currentMonthYear.toLocaleString('id-ID', { month: 'long', year: 'numeric' }) }}
        </h2>
        <div class="row">
          <div class="col-md-6 mb-3" style="margin-top: 5px;">
          </div>
          <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto; display: flex-end">
            <div class="d-flex justify-content-end">
              <select id="departemenFilter" v-model="departementFilter" class="form-cari"
                style="margin-right: 10px; width: 190px;">
                <option value="">Semua Departemen</option>
                <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{
                  dep.nama_departement }}</option>
              </select>
              <select id="cabangFilter" v-model="cabangFilter" class="form-cari"
                style="margin-right: 10px; width: 155px;">
                <option value="">Semua Cabang</option>
                <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
                </option>
              </select>
              <div class="search-container" style="margin-right: -10px; width: 275px;">
                <input type="text" class="form-cari" v-model="keywordFilter" placeholder="cari agenda"
                  style="width: 100%; padding-right: 40px;" />
                <SearchIcon class="search-icon" />
              </div>
            </div>
          </div>
        </div>


        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th scope="col" style="width: 2%;">ID</th>
              <th scope="col" style="width: 8%;">Agenda</th>
              <th scope="col" style="width: 8%;">Status</th>
              <th scope="col" style="width: 8%;">Cabang</th>
              <th scope="col" style="width: 8%;">Jadwal</th>
              <th scope="col" style="width: 8%;">Action</th>
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
            <tr v-else v-for="jadwal in jadwalList" :key="jadwal.id_jadwal">
              <td class="text-center">{{ jadwal.id_jadwal }}</td>
              <td>{{ jadwal.agenda }}</td>
              <td>{{ jadwal.status === null ? 'Seluruh Departement' : "Departement " + getNamaDepartement(jadwal.status)
                }}</td>
              <td class="text-center">{{ getNamaCabang(jadwal.cabang) }}</td>
              <td>{{ new Date(jadwal.tanggal).toLocaleString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit'
              }) }}</td>
              <td class="text-center">
                <button @click="editJadwal(jadwal)" class="btn btn-warning">Ubah</button>
                <button @click="deleteJadwal(jadwal.id_jadwal)" class="btn btn-danger">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button class="btn-prev" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
          <span class="pagination">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn-next" @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages">Next</button>
        </div>
        <button @click="viewModal = false" class="btn btn-danger">Tutup</button>
      </div>
    </div>

    <!-- View Date Modal -->
    <div v-if="viewModal2" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center">
          {{ new Date(clickedDate ?? new Date()).toLocaleString('id-ID', {
            weekday: 'long', day: 'numeric', month:
              'long', year: 'numeric'
          }) }}
        </h2>
        <table class="table table-bordered">
          <thead class="text-center">
            <tr>
              <th>Jadwal</th>
              <th>Agenda</th>
              <th>Status</th>
              <th>Cabang</th>
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
              <td>{{ tanggall.status === null ? 'Seluruh Departement' : "Departement " +
                getNamaDepartement(tanggall.status) }}</td>
              <td class="text-center">{{ getNamaCabang(tanggall.cabang) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="viewModal2 = false" class="btn btn-danger">Tutup</button>
      </div>
    </div>

    <!-- Edit Event Modal -->
    <div v-if="editModal" class="modal">
      <div class="modal-content-kalendar">
        <h2 style="text-align: center;">Ubah Data Jadwal</h2>
        <form @submit.prevent="saveEditJadwal" class="form-container">
          <div class="form-group">
            <label for="id_jadwal">ID</label>
            <input type="text" id="id_jadwal" v-model="editFormData.id_jadwal" readonly />
          </div>
          <div class="form-group">
            <label for="agenda">Agenda</label>
            <input type="text" id="agenda" v-model="editFormData.agenda" required>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="departement" style="width:450px">Status</label>
              <select type="text" id="departement" v-model="editFormData.status">
                <option value="">Seluruh Departement</option>
                <option v-for="d in departementList" :value="d.id_departement" :key="d.id_departement">{{
                  d.nama_departement }}</option>
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
            <button type="submit" class="btn btn-success" style="margin-left: 1px;">Simpan Perubahan</button>
            <button type="button" @click="editModal = false" class="btn btn-danger">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
