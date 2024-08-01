<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import '/src/style/loading.css';
import Loading from '/src/style/loading.vue';

const inventarisList = ref([]);
const searchQuery = ref('');
const kategoriFilter = ref('');
const userName = ref('');
const isLoading = ref(true);

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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/ip');
    console.log(response);
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
  }
};

const filteredInventaris = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const kategori = kategoriFilter.value;
  let filtered = inventarisList.value;

  if (query) {
    filtered = filtered.filter(inventaris =>
      inventaris.nopol.toLowerCase().includes(query) ||
      inventaris.merek.toLowerCase().includes(query) ||
      inventaris.kategori.toLowerCase().includes(query) ||
      inventaris.tahun.toString().includes(query) ||
      inventaris.pajak.toString().includes(query) ||
      inventaris.masa_pajak.toString().includes(query) ||
      inventaris.harga_beli.toString().includes(query) ||
      inventaris.tanggal_beli.toLowerCase().includes(query) ||
      getNamaCabang(inventaris.cabang).toLowerCase().includes(query)
    );
  }

  if (kategori) {
    filtered = filtered.filter(inventaris => inventaris.kategori === kategori);
  }

  return filtered;
});

onBeforeMount(async() => {
  await fetchUserName();
  isLoading.value = false;
});

onMounted(async() => {
  await fetchUserName();
  await fetchDataInventaris();
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
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                </div>
                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="kategoriFilter" v-model="kategoriFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                      <option value="">Mobil/Motor</option>
                      <option value="Mobil">Mobil</option>
                      <option value="Motor">Motor</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari inventaris" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>
              
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col">ID INVENTARIS</th>
                    <th scope="col">NOPOL</th>
                    <th scope="col">MEREK</th>
                    <th scope="col">KATEGORI</th>
                    <th scope="col">TAHUN</th>
                    <th scope="col">PAJAK</th>
                    <th scope="col">MASA PAJAK</th>
                    <th scope="col">HARGA BELI</th>
                    <th scope="col">TANGGAL BELI</th>
                    <th scope="col">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredInventaris.length === 0">
                    <td colspan="11" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(inventaris, index) in filteredInventaris" :key="index">
                    <td class="text-center">{{ inventaris.id_inventaris }}</td>
                    <td>{{ inventaris.nopol }}</td>
                    <td>{{ inventaris.merek }}</td>
                    <td>{{ inventaris.kategori }}</td>
                    <td>{{ inventaris.tahun }}</td>
                    <td>{{ inventaris.pajak }}</td>
                    <td>{{ inventaris.masa_pajak }}</td>
                    <td>{{ inventaris.harga_beli }}</td>
                    <td>{{ inventaris.tanggal_beli }}</td>
                    <td class="text-center">
                        <router-link :to="{ name: 'inventaris_pegawai.lihat_inventaris', params: { id: inventaris.id_inventaris } }" class="btn btn-sm btn-warning rounded-sm shadow border-0 me-2 custom-button">Lihat</router-link>
                      </td>
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
</template>
