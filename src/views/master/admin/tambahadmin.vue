<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api'; // Impor dari folder api yang berisi index.js
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State for storing admins
const admins = ref([]);
const searchQuery = ref(''); // State for search query
const tempSearchQuery = ref(''); // Temporary state for holding input value

// State to control modals visibility
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data for adding a new admin
const addFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
});

// Form data for editing an existing admin
const editFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
});

const currentAdminId = ref(null);

// Function to fetch admins from the API
const fetchDataAdmins = async () => {
  try {
    const response = await api.get('/api/admin');
    console.log(response); // Log the response to inspect its structure
    admins.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
};

const editAdmin = (admin) => {
  currentAdminId.value = admin.id_admin;
  editFormData.value = { ...admin}; // Jangan isi password untuk keamanan
  showEditModal.value = true;
};

// Function to delete an admin
const deleteAdmin = async (id_admin) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/admin/${id_admin}`);
      // Remove the deleted admin from the admins array
      admins.value = admins.value.filter(admin => admin.id_admin !== id_admin);
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  }
};

// Computed property to filter admins based on search query
const filteredAdmins = computed(() => {
  if (!searchQuery.value) {
    return admins.value;
  }
  return admins.value.filter(admin => 
    admin.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Method to handle the search button click
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Function to handle form submission for adding a new admin
const saveNewAdmin = async () => {
  try {
    await api.post('/api/admin', addFormData.value);
    // Reset form data
    addFormData.value = { id_admin: '', nama: '', no_hp: '', email: '', password: '' };
    // Close the modal
    showAddModal.value = false;
    // Refresh the admin list
    fetchDataAdmins();
  } catch (error) {
    console.error('Error saving new admin:', error);
  }
};

// Function to handle form submission for editing an admin
const saveEditAdmin = async () => {
  try {
    await api.put(`/api/admin/${currentAdminId.value}`, editFormData.value);
    // Reset form data
    editFormData.value = null;
    // Close the modal
    showEditModal.value = false;
    // Refresh the admin list
    fetchDataAdmins();
  } catch (error) {
    console.error('Error saving edit admin:', error);
  }
};

const updateAdmin = async () => {
  try {
    await api.put(`/api/admin/${currentAdminId.value}`, editFormData.value);
    // Reset state
    currentAdminId.value = null;
    showEditModal.value = false;
    // Refresh daftar admin
    fetchDataAdmins();
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

// Run hook "onMounted"
onMounted(() => {
  fetchDataAdmins();
});
</script>


<template>
    <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
          <div class="row">
            <div class="card2">
              <h2>ADMIN</h2>
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
                      <th scope="col" style="width:10%">NO TELEPON</th>
                      <th scope="col" style="width:20%">EMAIL</th>
                      <th scope="col" style="width:10%">PASSWORD</th>
                      <th scope="col" style="width:15%">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredAdmins.length === 0">
                      <td colspan="6" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(admin, index) in filteredAdmins" :key="index">
                      <td class="text-center">{{ admin.id_admin }}</td>
                      <td>{{ admin.nama }}</td>
                      <td>{{ admin.no_hp }}</td>
                      <td>{{ admin.email }}</td>
                      <td>{{ admin.password }}</td>
                      <td class="text-center">
                        <button @click="editAdmin(admin)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteAdmin(admin.id_admin)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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
  
    <!-- Modal for adding new admin -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH ADMIN</h4>
        <div class="form-group">
          <label for="id_admin">ID</label>
          <input type="text" id="id_admin" v-model="addFormData.id_admin" />
        </div>
        <div class="form-group">
          <label for="nama">Nama</label>
          <input type="text" id="nama" v-model="addFormData.nama" />
        </div>
        <div class="form-group">
          <label for="no_hp">No Hp</label>
          <input type="text" id="no_hp" v-model="addFormData.no_hp" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="addFormData.email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="addFormData.password" />
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewAdmin">Simpan Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
        </div>
      </div>
    </div>
  
    <!-- Modal for editing admin -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT ADMIN</h4>
        <div class="form-group">
          <label for="id_admin">ID</label>
          <input type="text" id="id_admin" v-model="editFormData.id_admin" />
        </div>
        <div class="form-group">
          <label for="nama">Nama</label>
          <input type="text" id="nama" v-model="editFormData.nama" />
        </div>
        <div class="form-group">
          <label for="no_hp">No Hp</label>
          <input type="text" id="no_hp" v-model="editFormData.no_hp" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="editFormData.email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="editFormData.password" />
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditAdmin">Update Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
        </div>
      </div>
    </div>
  </template>
    