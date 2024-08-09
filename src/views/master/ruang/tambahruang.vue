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
import defaultImage from '/src/images/potoruang.png';

const isLoading = ref(true);
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
  foto: '',
});

const editFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang: '',
  foto: '',
});

const currentRuangId = ref(null);

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

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataRuang(); // Fetch data for the new page
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

    ruang.value = response.data.data.data.map(ruang => {
      return {
        ...ruang,
        foto: ruang.foto // Pastikan URL gambar sudah lengkap dari backend
      };
    });

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
    foto: r.foto, // Pastikan URL gambar sudah lengkap dari backend
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

const saveNewRuang = async () => {
  try {
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }

    // Membuat instance FormData
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
        .then(blob => new File([blob], "potoruang.png", { type: "image/png" }));
      formData.append('foto', defaultFile);
    }

    // Mengirim data menggunakan FormData
    await api.post('/api/ruang', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    addFormData.value = { id_ruang: '', nama_ruang: '', cabang: '', foto: '' };
    showAddModal.value = false;
    addFotoFile.value = null; // Reset file foto jika ada
    fetchDataRuang();
    generateNewRuangId();
  } catch (error) {
    console.error('Error saving new ruang:', error);
  }
};

const saveEditRuang = async () => {
  try {
    // Membuat instance FormData
    const formData = new FormData();
    Object.keys(editFormData.value).forEach(key => {
      formData.append(key, editFormData.value[key]);
    });

    // Menambahkan foto jika ada
    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    }

    // Menambahkan _method untuk menyimulasikan metode PUT
    formData.append('_method', 'PUT');

    // Mengirim data menggunakan FormData
    await api.post(`/api/ruang/${currentRuangId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    editFormData.value = { id_ruang: '', nama_ruang: '', cabang: '', foto: '' };
    addFotoFile.value = null; // Reset file foto jika ada
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
            <h2>Ruang</h2>
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
                      <th scope="col" style="width:13%">ID Ruang</th>
                      <th scope="col" style="width:13%">Nama Ruang</th>
                      <th scope="col" style="width:13%">Cabang</th>
                      <th scope="col" style="width:2%">Foto</th>
                      <th scope="col" style="width:6%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="ruang.length === 0">
                      <td colspan="5" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(r, index) in ruang" :key="index">
                      <td class="text-center">{{ r.id_ruang }}</td>
                      <td>{{ r.nama_ruang }}</td>
                      <td>{{ getNamaCabang(r.cabang) }}</td>
                      <td><img :src="r.foto" width="100" class="rounded-3" /></td>
                      <td class="text-center">
                        <button @click="editRuang(r)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteRuang(r.id_ruang)" class="btn btn-sm btn-danger border-0"
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

  <!-- Modal for adding new ruang -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Ruang</h4>
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
      <div style="margin: 0px 10px 20px 0px;">
        <label for="foto">Upload Foto Anda</label>
        <input style="margin-top: 5px;" type="file" @change="handleFileChange" class="form-control">
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
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Ruang</h4>
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
      <div style=" margin: 0px 10px 20px 0px;">
        <label for="foto">Upload Foto Anda</label>
        <input style="margin-top: 5px;" type="file" @change="handleFileChange" class="form-control">
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditRuang">Simpan perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>