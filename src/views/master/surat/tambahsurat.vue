<script setup>
import { ref, onMounted, watch } from 'vue';
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
import logo23 from '/src/style/logo2.vue';

const showProfileModal = ref(false);
const isLoading = ref(true);
const surat = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Tetap simpan ini untuk backend pagination
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

const editFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

const currentSuratId = ref(null);

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await fetchDataSurat(page); // Fetch data for the new page
  }
};

const fetchDataSurat = async (page = 1) => {
  try {
    let url = `/api/surat?page=${currentPage.value}`;

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    surat.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
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

watch(searchQuery, async () => {
  await fetchDataSurat();
});

onMounted(async () => {
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
            <h2>Surat</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
          </div>
        </div>
        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Tambah</button>
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
                      <th scope="col" style="width:10%">Kode Surat</th>
                      <th scope="col" style="width:15%">Jenis Surat</th>
                      <th scope="col" style="width:3%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="surat.length === 0">
                      <td colspan="3" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in surat" :key="index">
                      <td class="text-center">{{ s.kode_surat }}</td>
                      <td>{{ s.jenis_surat }}</td>
                      <td class="text-center">
                        <button @click="editSurat(s)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteSurat(s.kode_surat)" class="btn btn-sm btn-danger border-0"
                          style="margin-right: 7px;">Hapus</button>
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
      <!-- Modal for Profile -->
      <ProfileModal v-if="showProfileModal" />
    </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <Loading /> <!-- Menampilkan komponen loading -->
  </div>

  <!-- Modal for adding new surat -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Surat</h4>
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
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Suratx</h4>
      <div class="form-group">
        <label for="kode_surat">Kode Surat</label>
        <input type="text" id="kode_surat" v-model="editFormData.kode_surat" />
      </div>
      <div class="form-group">
        <label for="jenis_surat">Jenis Surat</label>
        <input type="text" id="jenis_surat" v-model="editFormData.jenis_surat" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditSurat">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>



</template>
