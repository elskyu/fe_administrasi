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
import SearchIcon from '/src/style/SearchIcon.vue';

const userName = ref(''); // Default name

const admins = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

const addFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
});

const editFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
});

const currentAdminId = ref(null);

const fetchUserName = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/useradmin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("nama : ",response.data); // Tambahkan log ini
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

const fetchDataAdmins = async () => {
  try {
    const response = await api.get('/api/admin');
    console.log(response);
    admins.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
};

const editAdmin = (admin) => {
  currentAdminId.value = admin.id_admin;
  editFormData.value = { ...admin};
  showEditModal.value = true;
};

const deleteAdmin = async (id_admin) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/admin/${id_admin}`);
      admins.value = admins.value.filter(admin => admin.id_admin !== id_admin);
      generateNewAdminId();
      fetchDataAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  }
};

const filteredAdmins = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    return admins.value;
  }
  return admins.value.filter(admin => 
    admin.nama.toLowerCase().includes(query) ||
    admin.email.toLowerCase().includes(query)
  );
});


const saveNewAdmin = async () => {
  try {
    await api.post('/api/admin', addFormData.value);
    addFormData.value = { id_admin: '', nama: '', no_hp: '', email: '', password: '' };
    showAddModal.value = false;
    fetchDataAdmins();
    generateNewAdminId();
  } catch (error) {
    console.error('Error saving new admin:', error);
  }
};

const saveEditAdmin = async () => {
  try {
    await api.put(`/api/admin/${currentAdminId.value}`, editFormData.value);
    editFormData.value = null;
    showEditModal.value = false;
    fetchDataAdmins();
    generateNewAdminId();
  } catch (error) {
    console.error('Error saving edit admin:', error);
  }
};

const generateNewAdminId = async () => {
  try {
    const response = await api.get('/api/adminall');
    const admins = response.data.data;

    if (admins.length === 0) {
      addFormData.value.id_admin = "ADM001";
    } else {
      const existingIds = admins.map(a => parseInt(a.id_admin.slice(3)));
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
      addFormData.value.id_admin = `ADM${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Admin ID:', error);
  }
};

onMounted(async () => {
  generateNewAdminId();
  fetchDataAdmins();
  await fetchUserName();
});
</script>


<template>
    <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>ADMIN</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <div class="form-group-row" style="display: flex; align-items: center; margin-right: 20px;">
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="align-items: center; margin-right: 5px;">
                  <path d="M10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM4.023 13.416C5.491 15.606 7.695 17 10.16 17C12.624 17 14.829 15.607 16.296 13.416C14.6317 11.8606 
                  12.4379 10.9968 10.16 11C7.88171 10.9966 5.68751 11.8604 4.023 13.416V13.416ZM10 9C10.7956 9 11.5587 8.68393 12.1213 8.12132C12.6839 7.55871 13 6.79565 13 6C13 5.20435 12.6839 4.44129 12.1213 
                  3.87868C11.5587 3.31607 10.7956 3 10 3C9.20435 3 8.44129 3.31607 7.87868 3.87868C7.31607 4.44129 7 5.20435 7 6C7 6.79565 7.31607 7.55871 7.87868 8.12132C8.44129 8.68393 9.20435 9 10 9V9Z" fill="#44d569"/>
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
                        <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari admin" style="width: 100%; padding-right: 40px;" />
                        <SearchIcon class="search-icon" />
                      </div>
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
    