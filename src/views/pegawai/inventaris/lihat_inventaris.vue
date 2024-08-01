<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import api from '../../../api';
import axios from 'axios';
import { useRoute } from 'vue-router';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import Loading from '/src/style/loading.vue';

const route = useRoute();
const id = ref(route.params.id);
const inventarisList = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');
const userName = ref('');
const isLoading = ref(true);

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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get(`/api/ip/${id.value}`);
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
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
  fetchDataInventaris();
});

onMounted(async() => { 
  fetchUserName();
  await fetchDataInventaris();
  await generateNewPiId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Inventaris</h2>
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
                <div class="col-md-6 mb-3" style="margin-top: 5px; margin-right: -10px;">
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

  <div v-if="isLoading" class="loading-overlay">
    <Loading />
  </div>

  <!-- Modal untuk peminjaman inventaris -->
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
