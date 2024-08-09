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
import logo23 from '/src/style/logo2.vue';
import defaultImage from '/src/images/potoprofil2.png';

const admins = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(true);
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Disesuaikan dengan pagination dari backend
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
  foto: '',
  jenkel: '',
  status: '',
});

const editFormData = ref({
  id_admin: '',
  nama: '',
  no_hp: '',
  email: '',
  password: '',
  foto: '',
  jenkel: '',
  status: '',
});

const addFotoFile = ref(null);
const editFotoFile = ref(null);

const handleFileChange = (event, isEdit = false) => {
  const file = event.target.files[0];
  if (file) {
    if (isEdit) {
      editFotoFile.value = file;
    } else {
      addFotoFile.value = file;
    }
  }
};

const currentAdminId = ref(null);

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataAdmins(); // Fetch data for the new page
  }
};

const fetchDataAdmins = async () => {
  try {
    let url = `/api/admin?page=${currentPage.value}`;

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);
    admins.value = response.data.data.data.map(admin => {
      return {
        ...admin,
        foto: admin.foto // Pastikan URL gambar sudah lengkap dari backend
      };
    });
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
};

const editAdmin = (admin) => {
  currentAdminId.value = admin.id_admin;
  editFormData.value = { ...admin };
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

const saveNewAdmin = async () => {
  try {
    const formData = new FormData();

    Object.keys(addFormData.value).forEach(key => {
      formData.append(key, addFormData.value[key]);
    });

    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    } else {
      // Menggunakan gambar default dari folder images
      const defaultFile = await fetch(defaultImage)
        .then(res => res.blob())
        .then(blob => new File([blob], "potoprofil2.png", { type: "image/png" }));
      formData.append('foto', defaultFile);
    }

    await api.post('/api/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    addFormData.value = { id_admin: '', nama: '', no_hp: '', email: '', password: '', foto: '', jenkel: '', status: '', };
    showAddModal.value = false;
    addFotoFile.value = null; // Reset file foto
    fetchDataAdmins();
    generateNewAdminId();
  } catch (error) {
    console.error('Error saving new admin:', error);
  }
};

const saveEditAdmin = async () => {
  try {
    const formData = new FormData();
    Object.keys(editFormData.value).forEach(key => {
      formData.append(key, editFormData.value[key]);
    });
    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    }
    // Tambahkan _method untuk menyimulasikan metode PUT
    formData.append('_method', 'PUT');

    await api.post(`/api/admin/${currentAdminId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    editFormData.value = { id_admin: '', nama: '', no_hp: '', email: '', password: '', foto: '', jenkel: '', status: '' };
    addFotoFile.value = null; // Reset file foto
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

watch(searchQuery, async () => {
  await fetchDataAdmins();
});

onMounted(async () => {
  await fetchDataAdmins();
  await generateNewAdminId();
  isLoading.value = false;
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Admin</h2>
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
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari admin"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>


                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:9%">ID Admin</th>
                      <th scope="col" style="width:9%">Nama</th>
                      <th scope="col" style="width:9%">Jenis Kelamin</th>
                      <th scope="col" style="width:13%">No Telepon</th>
                      <th scope="col" style="width:13%">Email</th>
                      <th scope="col" style="width:9%">Status</th>
                      <th scope="col" style="width:5%">Foto</th>
                      <th scope="col" style="width:10%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="admins.length === 0">
                      <td colspan="10" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(admin, index) in admins" :key="index">
                      <td class="text-center">{{ admin.id_admin }}</td>
                      <td>{{ admin.nama }}</td>
                      <td>{{ admin.jenkel }}</td>
                      <td>{{ admin.no_hp }}</td>
                      <td>{{ admin.email }}</td>
                      <td>{{ admin.status }}</td>
                      <td><img :src="admin.foto" width="60" class="rounded-3" /></td>
                      <td class="text-center">
                        <button @click="editAdmin(admin)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteAdmin(admin.id_admin)" class="btn btn-sm btn-danger border-0"
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
    </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <Loading /> <!-- Menampilkan komponen loading -->
  </div>

  <!-- Modal for adding new admin -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Admin</h4>
      <div class="form-group-row">
        <div class="form-group" style="width: 165px;">
          <label for="id_admin">ID Admin</label>
          <input type="text" id="id_admin" v-model="addFormData.id_admin" />
        </div>
        <div class="form-group" style="width: 225px;">
          <label for="nama">Nama</label>
          <input type="text" id="nama" v-model="addFormData.nama" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 225px;">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="addFormData.email" />
        </div>
        <div class="form-group" style="width: 165px;">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="addFormData.password" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="no_hp">No HP</label>
          <input type="text" id="no_hp" v-model="addFormData.no_hp" />
        </div>
        <div class="form-group" style="width: 200px;">
          <label for="status">Status</label>
          <select id="status" v-model="addFormData.status">s
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Non Aktif</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div style="width: 190px;">
          <label for="jenkel">Jenis Kelamin</label>
          <div style="margin-bottom: 20px; margin-top: 5px;">
            <div>
              <input type="radio" id="laki-laki" value="laki-laki" v-model="addFormData.jenkel" />
              <label for="laki-laki" style="margin-left: 5px;">Laki-laki</label>
            </div>
            <div>
              <input type="radio" id="perempuan" value="Perempuan" v-model="addFormData.jenkel" />
              <label style="margin-left: 5px;" for="perempuan">Perempuan</label>
            </div>
          </div>
        </div>
        <div style="width: 185px; margin: 0px 10px 20px 0px;">
          <label for="foto">Upload Foto Anda</label>
          <input type="file" @change="handleFileChange" class="form-control">
        </div>
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
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Admin</h4>
      <div class="form-group-row">
        <div class="form-group" style="width: 165px;">
          <label for="id_admin">ID Admin</label>
          <input type="text" id="id_admin" v-model="editFormData.id_admin" />
        </div>
        <div class="form-group" style="width: 225px;">
          <label for="nama">Nama</label>
          <input type="text" id="nama" v-model="editFormData.nama" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 225px;">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="editFormData.email" />
        </div>
        <div class="form-group" style="width: 165px;">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="editFormData.password" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="no_hp">No HP</label>
          <input type="text" id="no_hp" v-model="editFormData.no_hp" />
        </div>
        <div class="form-group" style="width: 200px;">
          <label for="status">Status</label>
          <select id="status" v-model="editFormData.status">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Non Aktif</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div style="width: 190px;">
          <label for="jenkel">Jenis Kelamin</label>
          <div style="margin-bottom: 20px; margin-top: 5px;">
            <div>
              <input type="radio" id="jenkel" value="laki-laki" v-model="editFormData.jenkel" />
              <label for="laki-laki" style="margin-left: 5px;">Laki-laki</label>
            </div>
            <div>
              <input type="radio" id="jenkel" value="Perempuan" v-model="editFormData.jenkel" />
              <label style="margin-left: 5px;" for="perempuan">Perempuan</label>
            </div>
          </div>
        </div>
        <div style="width: 185px; margin: 0px 10px 20px 0px;">
          <label for="foto">Upload Foto Anda</label>
          <input type="file" @change="handleFileChange" class="form-control">
        </div>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditAdmin">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>