<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const ruang = ref([]);
const cabangList = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const cabangFilter = ref('');

const addFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang: '',
});

const editFormData = ref({
  id_ruang: '',
  nama_ruang: '',
  cabang_id: '',
});

const currentRuangId = ref(null);

const fetchDataRuang = async () => {
  try {
    const response = await api.get('/api/ruang');
    console.log(response);
    ruang.value = response.data.data.data;
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

const filteredRuang = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;

  let filtered = ruang.value;

  if (query) {
    filtered = filtered.filter(r => 
      r.nama_ruang.toLowerCase().includes(query) ||
      r.id_ruang.toLowerCase().includes(query) ||
      getNamaCabang(r.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(s => s.cabang === cabang);
  }

  return filtered;
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

const saveNewRuang = async () => {
  try {
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }
    await api.post('/api/ruang', addFormData.value);
    addFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
    showAddModal.value = false;
    fetchDataRuang();
    generateNewRuangId();
  } catch (error) {
    console.error('Error saving new ruang:', error);
  }
};

const saveEditRuang = async () => {
  try {
    await api.put(`/api/ruang/${currentRuangId.value}`, editFormData.value);
    editFormData.value = { id_ruang: '', nama_ruang: '', cabang: '' };
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

onMounted(() => {
  generateNewRuangId();
  fetchDataRuang();
  fetchDataCabang();
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
                      <select id="cabangFilter" v-model="cabangFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                        <option value="">Semua Cabang</option>
                        <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
                      </select>
                      <div class="search-container" style="margin-right: -10px; width: 275px;">
                        <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari ruang" style="width: 100%; padding-right: 40px;" />
                        <SearchIcon class="search-icon" />
                      </div>
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
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewRuang">Simpan Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
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
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditRuang">Update perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
        </div>
      </div>
    </div>
  </template>
