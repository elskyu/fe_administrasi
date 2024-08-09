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
import logo23 from '/src/style/logo2.vue';

const inventarisList = ref([]);
const searchQuery = ref('');
const kategoriFilter = ref('');
const isLoading = ref(true);

const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/ip');
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

onMounted(async () => {
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
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
          </div>
        </div>

        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card-ruang border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                </div>
                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="kategoriFilter" v-model="kategoriFilter" class="form-cari"
                      style="margin-right: 10px; width: 155px;">
                      <option value="">Mobil/Motor</option>
                      <option value="Mobil">Mobil</option>
                      <option value="Motor">Motor</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari inventaris"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width: 20%;">Id Inventaris</th>
                      <th scope="col" style="width: 20%;">Nopol</th>
                      <th scope="col" style="width: 20%;">Merek</th>
                      <th scope="col" style="width: 20%;">Kategori</th>
                      <th scope="col" style="width: 20%;">Tahun</th>
                      <th scope="col" style="width: 10%;">Aksi</th>

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
                      <td class="text-center">
                        <router-link
                          :to="{ name: 'inventaris_pegawai.lihat_inventaris', params: { id: inventaris.id_inventaris } }"
                          class="btn btn-sm btn-warning rounded-sm border-0 me-2 custom-button">Lihat</router-link>
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
