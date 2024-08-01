<script setup>
import { ref, onBeforeMount, onMounted} from 'vue';
import api from '../../../api';
import axios from 'axios';
import { useRoute } from 'vue-router';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/loading.css';
import Loading from '/src/style/loading.vue';

const route = useRoute();
const id = ref(route.params.id);
const ruang = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');
const userName = ref('');
const isLoading = ref(true);

const addFormData = ref({
      id_reservasi: '',
      ruang: '',
      tanggal_reservasi: '',
      tanggal_selesai: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
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
        userID.value = user.id_pegawai;
        userCabang.value = user.cabang;
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

const fetchDataRuang = async () => {
  try {
    const response = await api.get(`/api/rp/${id.value}`);
    ruang.value = response.data.data;
  } catch (error) {
    console.error('Error fetching ruang:', error);
  }
};

const saveNewReservasi = async () => {
  try {
    addFormData.value.pegawai = userID.value;
    addFormData.value.cabang = userCabang.value;
    addFormData.value.ruang = id.value;
    await api.post('/api/rrp', addFormData.value);
    addFormData.value = {
      id_reservasi: '',
      ruang: '',
      tanggal_reservasi: '',
      tanggal_selesai: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showAddModal.value = false;
    fetchDataRuang();
    generateNewRrId();
  } catch (error) {
    console.error('Error saving new reservasi:', error);
  }
};

const generateNewRrId = async () => {
  try {
    const response = await api.get('/api/rrallp');
    const reservasiList = response.data.data;

    if (reservasiList.length === 0) {
      addFormData.value.id_reservasi = "RSV001";
    } else {
      const existingIds = reservasiList.map(rr => parseInt(rr.id_reservasi.slice(3)));
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

      addFormData.value.id_reservasi = `RSV${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Reservasi ID:', error);
  }
};

onBeforeMount(() => {
  fetchDataRuang();
});

onMounted(async () => {
  fetchUserName();
  await fetchDataRuang();
  await generateNewRrId();
  isLoading.value = false;
});
</script>

<template>
    <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
          <div class="flex-container" style="display: flex; justify-content: space-between;">
            <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
              <h2>Ruang</h2>
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
  
          <div class="col-md-12" style="margin-left: -10px; width: auto;">
            <div class="card border-0">
              <div class="card-body">
                <div class="row">
                  <div class="card-body">
                    <h3 class="card-title">Detail Ruang</h3>
                    <div class="row">
                      <label class="col-sm-3 col-form-label">ID Ruang :</label>
                      <div class="col-sm-9">
                        <p class="form-control-plaintext">{{ ruang[0].id_ruang }}</p>
                      </div>
                    </div>
                    <div class="row">
                      <label class="col-sm-3 col-form-label">Nama Ruang :</label>
                      <div class="col-sm-9">
                        <p class="form-control-plaintext">{{ ruang[0].nama_ruang }}</p>
                      </div>
                    </div>
                  </div>
                  <h3 class="card-title">Detail Reservasi Ruang</h3>
                  <div class="col-md-6 mb-3" style="margin-top: 5px;">
                    <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Reservasi</button>
                  </div>
                  <div class="col-md-6 mb-3">
                    <router-link :to="{ name: 'ruang_pegawai.ruang' }" class="btn btn-md btn-warning rounded-sm">Kembali</router-link>
                  </div>
                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col">ID Reservasi</th>
                      <th scope="col">Tanggal Reservasi</th>
                      <th scope="col">Tanggal Selesai</th>
                      <th scope="col">Durasi Resrvasi</th>
                      <th scope="col">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rr in ruang[0].reservasi_ruang" :key="rr.id_reservasi">
                      <td class="text-center">{{ rr.id_reservasi }}</td>
                      <td>{{ rr.tanggal_reservasi }}</td>
                      <td>{{ rr.tanggal_selesai }}</td>
                      <td>{{ rr.durasi }}</td>
                      <td>{{ rr.keterangan }}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <Loading />
    </div>
  
    <!-- Modal for adding new ruang -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">RESERVASI {{ ruang[0].nama_ruang }}</h4>
          <div class="form-group">
            <label for="id_reservasi">Id Reservasi</label>
            <input v-model="addFormData.id_reservasi" type="text" id="id_reservasi" readonly>
          </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 195px;">
            <label for="tanggal_reservasi">Tanggal Reservasi</label>
            <input v-model="addFormData.tanggal_reservasi" type="datetime-local" id="tanggal_reservasi">
          </div>
          <div class="form-group" style="width: 195px;">
            <label for="tanggal_selesai">Tanggal Selesai</label>
            <input v-model="addFormData.tanggal_selesai" type="datetime-local" id="tanggal_selesai">
          </div>
        </div>
        <div class="form-group">
          <label for="durasi">Durasi</label>
          <input v-model="addFormData.durasi" type="time" id="durasi">
        </div>
        <div class="form-group">
          <label for="keterangan">Keterangan</label>
          <input v-model="addFormData.keterangan" type="text" id="keterangan">
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewReservasi">Simpan Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
        </div>
      </div>
    </div>
  </template>
