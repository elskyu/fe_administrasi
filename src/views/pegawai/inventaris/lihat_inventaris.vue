<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
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

// Pagination data
const currentPage = ref(1);
const itemsPerPage = ref(5);

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

const paginatedPemakaian = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return inventarisList.value[0]?.pemakaian_inventaris.slice(start, end) || [];
});

const totalPages = computed(() => {
  return Math.ceil((inventarisList.value[0]?.pemakaian_inventaris.length || 0) / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

onBeforeMount(() => {
  fetchDataInventaris();
});

onMounted(async () => {
  fetchUserName();
  await fetchDataInventaris();
  await generateNewPiId();
  isLoading.value = false;
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class=" container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 15px; margin-left: -15px;">
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
          <div class="card-lihat-inventaris border-0">
            <div class="card-body">
              <div class="row">
                <div class="card-body">
                  <h3 class="card-title" style="display: flex; justify-content: center; margin-bottom: 25px;">Detail
                    Inventaris</h3>
                  <div class="form-group-row">
                    <div class="card-lihat" style="width: 395px;">
                      <div class="form-group-row">
                        <label class="label-lihat">ID Inventaris :</label>
                        <p class="text-lihat">{{ inventarisList[0].id_inventaris }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Merek :</label>
                        <p class="text-lihat">{{ inventarisList[0].merek }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Nopol :</label>
                        <p class="text-lihat">{{ inventarisList[0].nopol }}</p>
                      </div>
                    </div>

                    <div class="card-lihat" style="width: 395px;">
                      <div class="form-group-row">
                        <label class="label-lihat">Pajak :</label>
                        <p class="text-lihat">{{ inventarisList[0].pajak }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Kategori :</label>
                        <p class="text-lihat">{{ inventarisList[0].kategori }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Masa Pajak :</label>
                        <p class="text-lihat">{{ inventarisList[0].masa_pajak }}</p>
                      </div>
                    </div>

                    <div class="card-lihat" style="width: 395px;">
                      <div class="form-group-row">
                        <label class="label-lihat">Tahun :</label>
                        <p class="text-lihat">{{ inventarisList[0].tahun }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Harga Beli :</label>
                        <p class="text-lihat">{{ inventarisList[0].harga_beli }}</p>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat">Tanggal Beli :</label>
                        <p class="text-lihat">{{ inventarisList[0].tanggal_beli }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 class="card-title"
                  style="display: flex; justify-content: center; margin-bottom: 10px; margin-top: 25px;">Detail
                  Peminjaman</h3>
                <div class="form-group-row" style=" margin-bottom: 10px;">
                  <div style="margin-top: 5px; margin-bottom: 10px;">
                    <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Pinjam
                      Inventaris</button>
                  </div>
                  <div style="margin-top: 5px; margin-right: -10px; margin-bottom: 10px;">
                    <router-link :to="{ name: 'inventaris_pegawai.inventaris' }"
                      class="btn btn-md btn-warning rounded-sm" style="right: 0;">Kembali</router-link>
                  </div>
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
                    <tr
                      v-if="!inventarisList.length || !inventarisList[0].pemakaian_inventaris.some(pinventaris => pinventaris.id_pinjam !== null)">
                      <td colspan="11" class="text-center">
                        <div class="alert alert-warning mb-0">
                          Belum ada yang melakukan peminjaman.
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="pinventaris in paginatedPemakaian" :key="pinventaris.id_pinjam">
                      <td class="text-center">{{ pinventaris.id_pinjam }}</td>
                      <td>{{ pinventaris.tanggal_pinjam }}</td>
                      <td>{{ pinventaris.tanggal_kembali }}</td>
                      <td>{{ pinventaris.durasi_pinjam }}</td>
                      <td>{{ pinventaris.keterangan }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination-controls">
                  <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                  <span>Page {{ currentPage }} of {{ totalPages }}</span>
                  <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                </div>
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
        <div class="form-group" style="width: 195px;">
          <label for="tanggal_pinjam" style="width: 175px;">Tanggal Pinjam</label>
          <input type="datetime-local" id="tanggal_pinjam" v-model="addFormData.tanggal_pinjam" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="tanggal_kembali">Tanggal Kembali</label>
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

<style scoped>
.pagination-controls {

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.pagination-controls button {
  background-color: #44d569;
  border: none;
  color: white;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination-controls button:disabled {
  border-radius: 5px;
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
