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
import '/src/style/admin.css';
import '/src/style/loading.css';
import '/src/style/surat_masuk.css';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const toast = useToast();
const route = useRoute();
const id = ref(route.params.id);
const ruang = ref([]);
const showAddModal = ref(false);
const userID = ref('');
const userCabang = ref('');
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(5);

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

const fetchDataRuang = async () => {
  try {
    const response = await api.get(`/api/rp/${id.value}`);
    ruang.value = response.data.data;
  } catch (error) {
    console.error('Error fetching ruang:', error);
  }
};

const checkAvailability = () => {
  const startNew = new Date(addFormData.value.tanggal_reservasi).getTime();
  const endNew = new Date(addFormData.value.tanggal_selesai).getTime();

  for (const reservasi of ruang.value[0]?.reservasi_ruang || []) {
    const startExisting = new Date(reservasi.tanggal_reservasi).getTime();
    const endExisting = new Date(reservasi.tanggal_selesai).getTime();

    if (
      (startNew >= startExisting && startNew < endExisting) ||
      (endNew > startExisting && endNew <= endExisting) ||
      (startNew <= startExisting && endNew >= endExisting)
    ) {
      return false;
    }
  }

  return true;
};

const saveNewReservasi = async () => {
  if (!checkAvailability()) {
    toast.error('Ruang Sudah Digunakan!');
    return;
  }

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

const paginatedRuang = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return ruang.value[0]?.reservasi_ruang.slice(start, end) || [];
});

const totalPages = computed(() => {
  return Math.ceil((ruang.value[0]?.reservasi_ruang.length || 0) / itemsPerPage.value);
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
  fetchDataRuang();
});

onMounted(async () => {
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
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
          </div>
        </div>

        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card-lihat-lihatRuang border-0">
            <div class="card-body">
              <div class="row">
                <div class="card-body">
                  <h3 class="card-title" style="display: flex; justify-content: center;  margin-bottom: 25px;">Detail
                    Ruang</h3>
                  <div class="form-group-row">
                    <div class="card-lihat-ruang" style="width: 940px;">
                      <div class="form-group-row">
                        <label class="label-lihat" style="font-size: 18px;">ID Ruang :</label>
                        <h6 class="text-lihat" style="font-size: 16px;">{{ ruang[0].id_ruang }}</h6>
                      </div>
                      <div class="form-group-row">
                        <label class="label-lihat" style="font-size: 18px;">Nama Ruang :</label>
                        <h6 class="text-lihat" style="font-size: 16px;">{{ ruang[0].nama_ruang }}</h6>
                      </div>
                    </div>
                    <div class="card-lihat-ruang" style="width: 250px;">
                      <img :src="ruang[0].foto" width="220" class="rounded-3" alt="Inventaris Foto"
                        style="display: flex; margin: 0 auto;" />
                    </div>
                  </div>
                </div>

                <h3 class="card-title"
                  style="display: flex; justify-content: center; margin-bottom: 15px; margin-top: 25px;">Detail
                  Reservasi Ruang</h3>
                <div class="form-group-row">
                  <div style="margin-top: 5px; margin-bottom: 10px;">
                    <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Reservasi</button>
                  </div>
                  <div style="margin-top: 5px; margin-bottom: 10px; margin-right: -10px;">
                    <router-link :to="{ name: 'ruang_pegawai.ruang' }" class="btn btn-md btn-warning rounded-sm"
                      style="right: 0;">Kembali</router-link>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col">ID Reservasi</th>
                      <th scope="col">Tanggal Reservasi</th>
                      <th scope="col">Tanggal Selesai</th>
                      <th scope="col">Durasi Reservasi</th>
                      <th scope="col">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!ruang.length || !ruang[0].reservasi_ruang.some(rr => rr.id_reservasi !== null)">
                      <td colspan="11" class="text-center">
                        <div class="alert alert-warning mb-0">
                          Belum ada yang melakukan peminjaman.
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="rr in paginatedRuang" :key="rr.id_reservasi">
                      <td class="text-center">{{ rr.id_reservasi }}</td>
                      <td>{{ rr.tanggal_reservasi }}</td>
                      <td>{{ rr.tanggal_selesai }}</td>
                      <td>{{ rr.durasi }}</td>
                      <td>{{ rr.keterangan }}</td>
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

  <!-- Modal for adding new ruang -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">RESERVASI {{
        ruang[0].nama_ruang }}</h4>
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
