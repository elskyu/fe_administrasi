<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import api from '../../../api';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const toast = useToast();
const route = useRoute();
const id = ref(route.params.id);
const inventarisList = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');
const isLoading = ref(true);

// Data untuk paginasi
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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get(`/api/ip/${id.value}`);
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
  }
};

const isAvailable = (tanggal_pinjam, tanggal_kembali) => {
  const existingPemakaian = inventarisList.value[0]?.pemakaian_inventaris || [];
  for (const pemakaian of existingPemakaian) {
    const start = new Date(pemakaian.tanggal_pinjam);
    const end = new Date(pemakaian.tanggal_kembali);
    const newStart = new Date(tanggal_pinjam);
    const newEnd = new Date(tanggal_kembali);

    if ((newStart >= start && newStart <= end) || (newEnd >= start && newEnd <= end) ||
      (start >= newStart && start <= newEnd) || (end >= newStart && end <= newEnd)) {
      return false;
    }
  }
  return true;
};

const saveNewPemakaian = async () => {
  try {
    if (!isAvailable(addFormData.value.tanggal_pinjam, addFormData.value.tanggal_kembali)) {
      toast.error('Inventaris Sudah Digunakan!');
      return;
    }

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
          <div class="card2" style="flex: 0 0 81%; margin-right: 15px; margin-left: -10px;">
            <h2>Inventaris</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
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
                    <div class="card-lihat" style="width: 940px;">
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
                    <div class="card-lihat" style="width: 250px;">
                      <img :src="inventarisList[0].foto" width="220" class="rounded-3" alt="Inventaris Foto"
                        style="display: flex; margin: 0 auto;" />
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
                      <th scope="col">Tanggal Pinjam</th>
                      <th scope="col">Tanggal Kembali</th>
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
