<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';

const isLoading = ref(true);
const userName = ref(''); // Default name
const ruang = ref([]);
const cabangList = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const cabangFilter = ref('');
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Disesuaikan dengan pagination dari backend
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang: '',
});

const editFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang: '',
});

const currentRuangId = ref(null);

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataRuang(); // Fetch data for the new page
  }
};

const fetchUserName = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/useradmin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = response.data;
      if (user && user.nama) {
        userName.value = user.nama;
      } else {
        console.error('Nama pengguna tidak ditemukan dalam respons');
      }
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error);
      // Tangani error, misalnya dengan mengarahkan ke halaman login jika token tidak valid
    }
  } else {
    console.error('Token tidak ditemukan');
    // Tangani kasus di mana token tidak ditemukan
  }
};

const fetchDataRuang = async () => {
  try {
    let url = `/api/ruang?page=${currentPage.value}`;

    if (cabangFilter.value) {
      url += `&cabang?=${encodeURIComponent(cabangFilter.value)}`;
    }

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    ruang.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching ruang:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cabang');
    cabangList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const editRuang = (r) => {
  currentRuangId.value = r.id_ruang;
  editFormData.value = {
    id_ruang: r.id_ruang,
    nama_ruang: r.nama_ruang,
    cabang: r.cabang,
  };
  showEditModal.value = true;
};

const deleteRuang = async (id_ruang) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/ruang/${id_ruang}`);
      ruang.value = ruang.value.filter(r => r.id_ruang !== id_ruang);
      generateNewRuangId();
      fetchDataRuang();
    } catch (error) {
      console.error('Error deleting ruang:', error);
    }
  }
};

// const filteredRuang = computed(() => {
//   const query = searchQuery.value.toLowerCase();

//   let filtered = ruang.value;

//   if (query) {
//     filtered = filtered.filter(r =>
//       r.nama_ruang.toLowerCase().includes(query) ||
//       r.id_ruang.toLowerCase().includes(query)
//     );
//   }
//   return filtered;
// });

const saveNewRuang = async () => {
  try {
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }
    await api.post('/api/ruang', addFormData.value);
    addFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
    showAddModal.value = false;
    fetchDataRuang();
    generateNewRuangId();
  } catch (error) {
    console.error('Error saving new ruang:', error);
  }
};

const saveEditRuang = async () => {
  try {
    await api.put(`/api/ruang/${currentRuangId.value}`, editFormData.value);
    editFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
    showEditModal.value = false;
    fetchDataRuang();
    generateNewRuangId();
  } catch (error) {
    console.error('Error saving edit ruang:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const generateNewRuangId = async () => {
  try {
    const response = await api.get('/api/ruangall');
    const ruang = response.data.data;

    if (ruang.length === 0) {
      addFormData.value.id_ruang = "R001";
    } else {
      const existingIds = ruang.map(r => parseInt(r.id_ruang.slice(3)));
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
      addFormData.value.id_ruang = `R${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Ruang ID:', error);
  }
};

watch([cabangFilter, searchQuery], async () => {
  await fetchDataRuang();
});

onMounted(async () => {
  fetchUserName();
  fetchDataCabang();
  await fetchDataRuang();
  await generateNewRuangId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>RUANG</h2>
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
              <h4>Hello {{ userName }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">TAMBAH</button>
                </div>

                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari"
                      style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
                      </option>
                    </select>
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
                      <th scope="col" style="width:10%">ID RUANG</th>
                      <th scope="col" style="width:15%">NAMA RUANG</th>
                      <th scope="col" style="width:15%">CABANG</th>
                      <th scope="col" style="width:5%">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="ruang.length === 0">
                      <td colspan="4" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <!-- <tr v-else-if="ruang.length === 0">
                      <td colspan="4" class="text-center">
                        <div class="alert alert-warning mb-0">
                          Data Tidak Ditemukan!
                        </div>
                      </td>
                    </tr> -->
                    <tr v-else v-for="(r, index) in ruang" :key="index">
                      <td class="text-center">{{ r.id_ruang }}</td>
                      <td>{{ r.nama_ruang }}</td>
                      <td>{{ getNamaCabang(r.cabang) }}</td>
                      <td class="text-center">
                        <button @click="editRuang(r)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteRuang(r.id_ruang)" class="btn btn-sm btn-danger border-0"
                          style="margin-right: 7px;">HAPUS</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination">
                  <button class="btn-prev" @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1">Previous</button>
                  <span class="pagination">Page {{ currentPage }} of {{ totalPages }}</span>
                  <button class="btn-next" @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <Loading /> <!-- Menampilkan komponen loading -->
  </div>

  <!-- Modal for adding new ruang -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH RUANG</h4>
      <div class="form-group">
        <label for="id_ruang">ID Ruang</label>
        <input type="text" id="id_ruang" v-model="addFormData.id_ruang" />
      </div>
      <div class="form-group">
        <label for="nama_ruang">Nama Ruang</label>
        <input type="text" id="nama_ruang" v-model="addFormData.nama_ruang" />
      </div>
      <div class="form-group">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="addFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewRuang">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal for editing ruang -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT RUANG</h4>
      <div class="form-group">
        <label for="id_ruang">ID Ruang</label>
        <input type="text" id="id_ruang" v-model="editFormData.id_ruang" />
      </div>
      <div class="form-group">
        <label for="nama_ruang">Nama Ruang</label>
        <input type="text" id="nama_ruang" v-model="editFormData.nama_ruang" />
      </div>
      <div class="form-group select">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="editFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditRuang">Update perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>