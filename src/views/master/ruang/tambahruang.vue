<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api'; // Import from the api folder containing index.js
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State for storing ruang
const ruang = ref([]);
const cabangList = ref([]); // To store the list of cabangs for selection
const searchQuery = ref(''); // State for search query
const tempSearchQuery = ref(''); // Temporary state for holding input value

// State to control modals visibility
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data for adding a new ruang
const addFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang: '', // Store the cabang id for the new ruang
});

// Form data for editing an existing ruang
const editFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang_id: '', // Store the cabang id for the existing ruang
});

const currentRuangId = ref(null);

// Function to fetch ruang from the API
const fetchDataRuang = async () => {
  try {
    const response = await api.get('/api/ruang');
    console.log(response); // Log the response to inspect its structure
    ruang.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching ruang:', error);
  }
};

// Function to fetch cabang list from the API
const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cabang');
    cabangList.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const editRuang = (r) => {
  currentRuangId.value = r.id_ruang;
  editFormData.value = {
    id_ruang: r.id_ruang,
    nama_ruang: r.nama_ruang,
    cabang: r.cabang, // Pastikan cabang_id diambil dari r.cabang.id
  };
  showEditModal.value = true;
};

// Function to delete a ruang
const deleteRuang = async (id_ruang) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/ruang/${id_ruang}`);
      // Remove the deleted ruang from the ruang array
      ruang.value = ruang.value.filter(r => r.id_ruang !== id_ruang);
    } catch (error) {
      console.error('Error deleting ruang:', error);
    }
  }
};

// Computed property to filter ruang based on search query
const filteredRuang = computed(() => {
  if (!searchQuery.value) {
    return ruang.value;
  }
  return ruang.value.filter(r => 
    r.nama_ruang.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Method to handle the search button click
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Function to handle form submission for adding a new ruang
const saveNewRuang = async () => {
  try {
    // Pastikan cabang_id terisi sebelum melakukan permintaan POST
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }

    await api.post('/api/ruang', addFormData.value);
    // Reset form data
    addFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
    // Close the modal
    showAddModal.value = false;
    // Refresh the ruang list
    fetchDataRuang();
  } catch (error) {
    console.error('Error saving new ruang:', error);
  }
};

// Function to handle form submission for editing a ruang
const saveEditRuang = async () => {
  try {
    await api.put(`/api/ruang/${currentRuangId.value}`, editFormData.value);
    // Reset form data
    editFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
    // Close the modal
    showEditModal.value = false;
    // Refresh the ruang list
    fetchDataRuang();
  } catch (error) {
    console.error('Error saving edit ruang:', error);
  }
};

// Method atau computed property untuk mendapatkan nama cabang berdasarkan ID cabang
const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

async function fetchUserData() {
  try {
    const response = await api.get('/api/useradmin');
    console.log(response.data.data.data);
  } catch (error) {
    console.error(error);
  }
}

// Run hook "onMounted"
onMounted(() => {
  fetchDataRuang();
  fetchDataCabang();
  fetchUserData();
});
</script>

<template>
    <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
          <div class="row">
            <div class="card2">
              <h2>RUANG</h2>
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
                      <button @click="handleSearch" class="btn btn-primary ml-2">FILTER</button>
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
                      <td>{{ getNamaCabang(r.cabang) }}</td>
                      <td class="text-center">
                        <button @click="editRuang(r)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteRuang(r.id_ruang)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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
          <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveNewRuang">Simpan Perubahan</button>
          <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
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
          <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveEditRuang">Update perubahan</button>
          <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
        </div>
      </div>
    </div>
  </template>
