<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/surat_masuk.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import '/src/style/loading.css';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const ruang = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);

const fetchDataRuang = async () => {
  try {
    const response = await api.get('/api/rp');
    ruang.value = response.data.data;
  } catch (error) {
    console.error('Error fetching ruang:', error);
  }
};

const filteredRuang = computed(() => {
  const query = searchQuery.value.toLowerCase();

  let filtered = ruang.value;

  if (query) {
    filtered = filtered.filter(r =>
      r.nama_ruang.toLowerCase().includes(query) ||
      r.id_ruang.toLowerCase().includes(query)
    );
  }
  return filtered;
});

onMounted(async () => {
  await fetchDataRuang();
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
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari ruang"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:20%">Id Ruang</th>
                      <th scope="col" style="width:20%">Nama Ruang</th>
                      <th scope="col" style="width:1%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredRuang.length === 0">
                      <td colspan="4" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(r, index) in filteredRuang" :key="index">
                      <td class="text-center">{{ r.id_ruang }}</td>
                      <td>{{ r.nama_ruang }}</td>
                      <td class="text-center">
                        <router-link :to="{ name: 'ruang_pegawai.lihat_ruang', params: { id: r.id_ruang } }"
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
