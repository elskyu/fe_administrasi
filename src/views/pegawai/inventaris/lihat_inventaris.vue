<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
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
const inventarisList = ref([]);
const cabangList = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');

const addFormData = ref({
  id_pinjam: '',
  inventaris: '',
  tanggal_pinjam: '',
  tanggal_kembali: '',
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

const fetchDataInventaris = async () => {
  try {
    console.log('ID:', id.value);
    const response = await api.get(`/api/ip/${id.value}`);
    console.log(response);
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
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

const saveNewPemakaian = async () => {
  try {
    addFormData.value.pegawai = userID.value;
    addFormData.value.cabang = userCabang.value;
    addFormData.value.inventaris = id.value;
    await api.post('/api/pip', addFormData.value);
    addFormData.value = {
      id_pinjam: '',
      inventaris: '',
      tanggal_pinjam: '',
      tanggal_kembali: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showAddModal.value = false;
    fetchDataInventaris();
    generateNewPiId();
  } catch (error) {
    console.error('Error saving new inventaris:', error);
  }
};

const generateNewPiId = async () => {
  try {
    const response = await api.get('/api/piallp');
    const pemakaianList = response.data.data;

    if (pemakaianList.length === 0) {
      addFormData.value.id_pinjam = "PI001";
    } else {
      const existingIds = pemakaianList.map(pi => parseInt(pi.id_pinjam.slice(3)));
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

      addFormData.value.id_pinjam = `PI${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Peminjaman ID:', error);
  }
};

onBeforeMount(() => {
  fetchUserName();
  generateNewPiId();
  fetchDataInventaris();
});

onMounted(() => { 
  fetchUserName();
  generateNewPiId();
  fetchDataInventaris();
  fetchDataCabang();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>INVENTARIS</h2>
          </div>
        </div>

        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="card-body">
                  <h3 class="card-title">Detail Inventaris</h3>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">ID Inventaris :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].id_inventaris }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Nopol :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].nopol }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Merek :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].merek }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Kategori :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].kategori }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Tahun :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].tahun }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Pajak :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].pajak }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Masa Pajak :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].masa_pajak }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Harga Beli :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].harga_beli }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Tanggal Beli :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].tanggal_beli }}</p>
                    </div>
                  </div>
                </div>
                <h3 class="card-title">Detail Peminjaman</h3>
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Pinjam Inventaris</button>
                </div>
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <router-link :to="{ name: 'inventaris_pegawai.inventaris' }" class="btn btn-md btn-warning rounded-sm" style="right: 0;">Kembali</router-link>
                </div>
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col">ID Pinjam</th>
                    <th scope="col">pinjam</th>
                    <th scope="col">kembali</th>
                    <th scope="col">Durasi Pinjam</th>
                    <th scope="col">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!inventarisList.length || !inventarisList[0].pemakaian_inventaris.some(pinventaris => pinventaris.id_pinjam !== null)">
                    <td colspan="11" class="text-center">
                      <div class="alert alert-warning mb-0">
                        Belum ada yang melakukan peminjaman.
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="pinventaris in inventarisList[0].pemakaian_inventaris" :key="pinventaris.id_pinjam">
                    <td class="text-center">{{ pinventaris.id_pinjam }}</td>
                    <td>{{ pinventaris.tanggal_pinjam }}</td>
                    <td>{{ pinventaris.tanggal_kembali }}</td>
                    <td>{{ pinventaris.durasi_pinjam }}</td>
                    <td>{{ pinventaris.keterangan }}</td>
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

  <!-- Modal untuk menambah inventaris baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Pinjam {{ inventarisList[0].merek }}</h4>
        <div class="form-group">
          <label for="id_pinjam" style="width: 195px;">ID</label>
          <input type="text" id="id_pinjam" v-model="addFormData.id_pinjam" readonly />
        </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="tanggal_pinjam" style="width: 195px;">Tanggal Pinjam</label>
          <input type="datetime-local" id="tanggal_pinjam" v-model="addFormData.tanggal_pinjam" />
        </div>
        <div class="form-group">
          <label for="tanggal_kembali" style="width: 195px;">Tanggal Kembali</label>
          <input type="datetime-local" id="tanggal_kembali" v-model="addFormData.tanggal_kembali" />
        </div>
      </div>
      <div class="form-group">
        <label for="durasi_pinjam" style="width: 195px;">Durasi</label>
        <input type="time" id="durasi_pinjam" v-model="addFormData.durasi_pinjam" />
      </div>
      <div class="form-group">
        <label for="keterangan">Keterangan</label>
        <input type="text" id="keterangan" v-model="addFormData.keterangan" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewPemakaian">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
