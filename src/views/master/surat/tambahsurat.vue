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
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';

const isLoading = ref(true);

const userName = ref(''); // Default name

const surat = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

const addFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

const editFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

const currentSuratId = ref(null);

const fetchDataSurat = async () => {
  try {
    const response = await api.get('/api/surat');
    console.log(response);
    surat.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching surat:', error);
  }
};

const editSurat = (s) => {
  currentSuratId.value = s.kode_surat;
  editFormData.value = { ...s };
  showEditModal.value = true;
};

const deleteSurat = async (kode_surat) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/surat/${kode_surat}`);
      surat.value = surat.value.filter(s => s.kode_surat !== kode_surat);
    } catch (error) {
      console.error('Error deleting surat:', error);
    }
  }
};

const filteredSurat = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    return surat.value;
  }
  return surat.value.filter(s =>
    s.jenis_surat.toLowerCase().includes(query) ||
    s.kode_surat.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

const saveNewSurat = async () => {
  try {
    await api.post('/api/surat', addFormData.value);
    addFormData.value = { kode_surat: '', jenis_surat: '' };
    showAddModal.value = false;
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving new surat:', error);
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
      console.log("nama : ", response.data); // Tambahkan log ini
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

const saveEditSurat = async () => {
  try {
    await api.put(`/api/surat/${currentSuratId.value}`, editFormData.value);
    editFormData.value = { kode_surat: '', jenis_surat: '' };
    showEditModal.value = false;
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving edit surat:', error);
  }
};

onMounted(async () => {
  fetchUserName();
  await fetchDataSurat();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>SURAT</h2>
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
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari surat"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:10%">KODE SURAT</th>
                      <th scope="col" style="width:15%">JENIS SURAT</th>
                      <th scope="col" style="width:3%">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredSurat.length === 0">
                      <td colspan="3" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in filteredSurat" :key="index">
                      <td class="text-center">{{ s.kode_surat }}</td>
                      <td>{{ s.jenis_surat }}</td>
                      <td class="text-center">
                        <button @click="editSurat(s)" class="btn btn-sm btn-warning rounded-sm shadow border-0"
                          style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteSurat(s.kode_surat)"
                          class="btn btn-sm btn-danger rounded-sm shadow border-0"
                          style="margin-right: 7px;">HAPUS</button>
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
    <Loading /> <!-- Menampilkan komponen loading -->
  </div>

  <!-- Modal for adding new surat -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH SURAT</h4>
      <div class="form-group">
        <label for="kode_surat">Kode Surat</label>
        <input type="text" id="kode_surat" v-model="addFormData.kode_surat" />
      </div>
      <div class="form-group">
        <label for="jenis_surat">Jenis Surat</label>
        <input type="text" id="jenis_surat" v-model="addFormData.jenis_surat" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSurat">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal for editing surat -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT SURAT</h4>
      <div class="form-group">
        <label for="kode_surat">Kode Surat</label>
        <input type="text" id="kode_surat" v-model="editFormData.kode_surat" />
      </div>
      <div class="form-group">
        <label for="jenis_surat">Jenis Surat</label>
        <input type="text" id="jenis_surat" v-model="editFormData.jenis_surat" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditSurat">Update Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
