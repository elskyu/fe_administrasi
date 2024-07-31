<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import api from '../../../api';
import axios from 'axios';
import { useRoute } from 'vue-router';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';


const route = useRoute();
const id = ref(route.params.id);
const ruang = ref([]);
const cabangList = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');

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

const currentRuangId = ref(null);

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
    console.log(response);
    ruang.value = response.data.data;
  } catch (error) {
    console.error('Error fetching ruang:', error);
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

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
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
  generateNewRrId();
  fetchUserName();
});

onMounted(() => {
  fetchUserName();
  fetchDataRuang();
  fetchDataCabang();
  generateNewRrId();
});
</script>

<template>
    <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
          <div class="row">
            <div class="card2">
              <h2>RUANG</h2>
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
                  <div class="col-md-6 mb-3" style="margin-top: 5px;">
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
