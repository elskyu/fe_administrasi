<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api'; // Impor dari folder api yang berisi index.js
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State for storing surat
const surat = ref([]);
const searchQuery = ref(''); // State for search query
const tempSearchQuery = ref(''); // Temporary state for holding input value

// State to control modals visibility
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data for adding a new surat
const addFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

// Form data for editing an existing surat
const editFormData = ref({
  kode_surat: '',
  jenis_surat: '',
});

const currentSuratId = ref(null);

// Function to fetch surat from the API
const fetchDataSurat = async () => {
  try {
    const response = await api.get('/api/surat');
    console.log(response); // Log the response to inspect its structure
    surat.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching surat:', error);
  }
};

const editSurat = (s) => {
  currentSuratId.value = s.kode_surat;
  editFormData.value = { ...s };
  showEditModal.value = true;
};

// Function to delete a surat
const deleteSurat = async (kode_surat) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/surat/${kode_surat}`);
      // Remove the deleted surat from the surat array
      surat.value = surat.value.filter(s => s.kode_surat !== kode_surat);
    } catch (error) {
      console.error('Error deleting surat:', error);
    }
  }
};

// Computed property to filter surat based on search query
const filteredSurat = computed(() => {
  if (!searchQuery.value) {
    return surat.value;
  }
  return surat.value.filter(s => 
    s.jenis_surat.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Method to handle the search button click
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Function to handle form submission for adding a new surat
const saveNewSurat = async () => {
  try {
    await api.post('/api/surat', addFormData.value);
    // Reset form data
    addFormData.value = { kode_surat: '', jenis_surat: '' };
    // Close the modal
    showAddModal.value = false;
    // Refresh the surat list
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving new surat:', error);
  }
};

// Function to handle form submission for editing a surat
const saveEditSurat = async () => {
  try {
    await api.put(`/api/surat/${currentSuratId.value}`, editFormData.value);
    // Reset form data
    editFormData.value = { kode_surat: '', jenis_surat: '' };
    // Close the modal
    showEditModal.value = false;
    // Refresh the surat list
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving edit surat:', error);
  }
};

// Run hook "onMounted"
onMounted(() => {
  fetchDataSurat();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>SURAT</h2>
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
                      <button @click="editSurat(s)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                      <button @click="deleteSurat(s.kode_surat)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveNewSurat">Simpan Perubahan</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
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
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveEditSurat">Update Perubahans</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
