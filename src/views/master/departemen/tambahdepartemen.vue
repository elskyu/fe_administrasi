<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api'; // Impor dari folder api yang berisi index.js
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State for storing departments
const departments = ref([]);
const searchQuery = ref(''); // State for search query
const tempSearchQuery = ref(''); // Temporary state for holding input value

// State to control modals visibility
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data for adding a new department
const addFormData = ref({
  id_departement: '',
  nama_departement: '',
});

// Form data for editing an existing department
const editFormData = ref({
  id_departement: '',
  nama_departement: '',
});

const currentDepartmentId = ref(null);

// Function to fetch departments from the API
const fetchDataDepartments = async () => {
  try {
    const response = await api.get('/api/departement');
    console.log(response); // Log the response to inspect its structure
    departments.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

const editDepartment = (department) => {
  currentDepartmentId.value = department.id_departement;
  editFormData.value = { ...department };
  showEditModal.value = true;
};

// Function to delete a department
const deleteDepartment = async (id_departement) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/departement/${id_departement}`);
      // Remove the deleted department from the departments array
      departments.value = departments.value.filter(department => department.id_departement !== id_departement);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  }
};

// Computed property to filter departments based on search query
const filteredDepartments = computed(() => {
  if (!searchQuery.value) {
    return departments.value;
  }
  return departments.value.filter(department => 
    department.nama_departement.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Method to handle the search button click
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Function to handle form submission for adding a new department
const saveNewDepartment = async () => {
  try {
    await api.post('/api/departement', addFormData.value);
    // Reset form data
    addFormData.value = { id_departement: '', nama_departement: '' };
    // Close the modal
    showAddModal.value = false;
    // Refresh the department list
    fetchDataDepartments();
  } catch (error) {
    console.error('Error saving new department:', error);
  }
};

// Function to handle form submission for editing a department
const saveEditDepartment = async () => {
  try {
    await api.put(`/api/departement/${currentDepartmentId.value}`, editFormData.value);
    // Reset form data
    editFormData.value = { id_departement: '', nama_departement: '' };
    // Close the modal
    showEditModal.value = false;
    // Refresh the department list
    fetchDataDepartments();
  } catch (error) {
    console.error('Error saving edit department:', error);
  }
};

// Run hook "onMounted"
onMounted(() => {
  fetchDataDepartments();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>DEPARTEMEN</h2>
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
                    <th scope="col" style="width:10%">ID</th>
                    <th scope="col" style="width:15%">NAMA</th>
                    <th scope="col" style="width:3%">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredDepartments.length === 0">
                    <td colspan="3" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(department, index) in filteredDepartments" :key="index">
                    <td class="text-center">{{ department.id_departement }}</td>
                    <td>{{ department.nama_departement }}</td>
                    <td class="text-center">
                      <button @click="editDepartment(department)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                      <button @click="deleteDepartment(department.id_departement)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

  <!-- Modal for adding new department -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH DEPARTEMEN</h4>
      <div class="form-group">
        <label for="id_departement">ID</label>
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
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT DEPARTEMEN</h4>
      <div class="form-group">
        <label for="id_departement">ID</label>
        <input type="text" id="id_departement" v-model="editFormData.id_departement" />
      </div>
      <div class="form-group">
        <label for="nama_departement">Nama</label>
        <input type="text" id="nama_departement" v-model="editFormData.nama_departement" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditDepartment">Update Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
