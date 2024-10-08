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

const departments = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(true);
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Disesuaikan dengan pagination dari backend
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  id_departement: '',
  nama_departement: '',
});

const editFormData = ref({
  id_departement: '',
  nama_departement: '',
});

const currentDepartmentId = ref(null);

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataDepartments(); // Fetch data for the new page
  }
};

const fetchDataDepartments = async () => {
  try {
    let url = `/api/departement?page=${currentPage.value}`;

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    departments.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

const editDepartment = (department) => {
  currentDepartmentId.value = department.id_departement;
  editFormData.value = { ...department };
  showEditModal.value = true;
};

const deleteDepartment = async (id_departement) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/departement/${id_departement}`);
      departments.value = departments.value.filter(department => department.id_departement !== id_departement);
      generateNewDepartementId();
      fetchDataDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  }
};

// const filteredDepartments = computed(() => {
//   const query = searchQuery.value.toLowerCase();
//   if (!query) {
//     return departments.value;
//   }
//   return departments.value.filter(department =>
//     department.nama_departement.toLowerCase().includes(query)
//   );
// });

const saveNewDepartment = async () => {
  try {
    await api.post('/api/departement', addFormData.value);
    addFormData.value = { id_departement: '', nama_departement: '' };
    showAddModal.value = false;
    fetchDataDepartments();
    generateNewDepartementId();
  } catch (error) {
    console.error('Error saving new department:', error);
  }
};

const saveEditDepartment = async () => {
  try {
    await api.put(`/api/departement/${currentDepartmentId.value}`, editFormData.value);
    editFormData.value = { id_departement: '', nama_departement: '' };
    showEditModal.value = false;
    fetchDataDepartments();
    generateNewDepartementId();
  } catch (error) {
    console.error('Error saving edit department:', error);
  }
};

const generateNewDepartementId = async () => {
  try {
    const response = await api.get('/api/departementall');
    const departements = response.data.data;

    if (departements.length === 0) {
      addFormData.value.id_departement = "DEPT001";
    } else {
      const existingIds = departements.map(d => parseInt(d.id_departement.slice(4)));
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
      addFormData.value.id_departement = `DEPT${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Departement ID:', error);
  }
};

watch(searchQuery, async () => {
  await fetchDataDepartments();
});

onMounted(async () => {
  await fetchDataDepartments();
  await generateNewDepartementId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Departemen</h2>
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
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari departemen"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:10%">ID Departemen</th>
                      <th scope="col" style="width:15%">Nama</th>
                      <th scope="col" style="width:3%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="departments.length === 0">
                      <td colspan="3" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(department, index) in departments" :key="index">
                      <td class="text-center">{{ department.id_departement }}</td>
                      <td>{{ department.nama_departement }}</td>
                      <td class="text-center">
                        <button @click="editDepartment(department)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteDepartment(department.id_departement)"
                          class="btn btn-sm btn-danger border-0" style="margin-right: 7px;">Hapus</button>
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

  <!-- Modal for adding new department -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Departement</h4>
      <div class="form-group">
        <label for="id_departement">ID Departement</label>
        <input type="text" id="id_departement" v-model="addFormData.id_departement" />
      </div>
      <div class="form-group">
        <label for="nama_departement">Nama</label>
        <input type="text" id="nama_departement" v-model="addFormData.nama_departement" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewDepartment">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal for editing department -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Departemnt</h4>
      <div class="form-group">
        <label for="id_departement">ID Departement</label>
        <input type="text" id="id_departement" v-model="editFormData.id_departement" />
      </div>
      <div class="form-group">
        <label for="nama_departement">Nama</label>
        <input type="text" id="nama_departement" v-model="editFormData.nama_departement" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditDepartment">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
