<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

const cabang = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

const addFormData = ref({
  id_cabang: '',
  nama_cabang: '',
});

const editFormData = ref({
  id_cabang: '',
  nama_cabang: '',
});

const currentCabangId = ref(null);

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cabang');
    console.log(response);
    cabang.value = response.data.data;
  } catch (error) {
    console.error('Error fetching cabang:', error);
  }
};

const editCabang = (c) => {
  currentCabangId.value = c.id_cabang;
  editFormData.value = { ...c };
  showEditModal.value = true;
};

const deleteCabang = async (id_cabang) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/cabang/${id_cabang}`);
      cabang.value = cabang.value.filter(c => c.id_cabang !== id_cabang);
      generateNewCabangId();
    } catch (error) {
      console.error('Error deleting cabang:', error);
    }
  }
};

const filteredCabang = computed(() => {
  if (!searchQuery.value) {
    return cabang.value;
  }
  return cabang.value.filter(c => 
    c.nama_cabang.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

const saveNewCabang = async () => {
  try {
    await api.post('/api/cabang', addFormData.value);
    addFormData.value = { id_cabang: '', nama_cabang: '' };
    showAddModal.value = false;
    fetchDataCabang();
    generateNewCabangId();
  } catch (error) {
    console.error('Error saving new cabang:', error);
  }
};

const saveEditCabang = async () => {
  try {
    await api.put(`/api/cabang/${currentCabangId.value}`, editFormData.value);
    editFormData.value = { id_cabang: '', nama_cabang: '' };
    showEditModal.value = false;
    fetchDataCabang();
    generateNewCabangId();
  } catch (error) {
    console.error('Error saving edit cabang:', error);
  }
};

const generateNewCabangId = async () => {
  try {
    const response = await api.get('/api/cabang');
    const cabangList = response.data.data;

    if (cabangList.length === 0) {
      addFormData.value.id_cabang = "CAB001";
    } else {
      const existingIds = cabangList.map(c => parseInt(c.id_cabang.slice(3)));
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

      addFormData.value.id_cabang = `CAB${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new cabang ID:', error);
  }
};

onMounted(() => {
  fetchDataCabang();
  generateNewCabangId();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>CABANG</h2>
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
                    <th scope="col" style="width:10%">ID CABANG</th>
                    <th scope="col" style="width:15%">NAMA CABANG</th>
                    <th scope="col" style="width:3%">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredCabang.length === 0">
                    <td colspan="3" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(c, index) in filteredCabang" :key="index">
                    <td class="text-center">{{ c.id_cabang }}</td>
                    <td>{{ c.nama_cabang }}</td>
                    <td class="text-center">
                      <button @click="editCabang(c)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                      <button @click="deleteCabang(c.id_cabang)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

  <!-- Modal for adding new cabang -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH CABANG</h4>
      <div class="form-group">
        <label for="id_cabang">ID Cabang</label>
        <input type="text" id="id_cabang" v-model="addFormData.id_cabang" />
      </div>
      <div class="form-group">
        <label for="nama_cabang">Nama Cabang</label>
        <input type="text" id="nama_cabang" v-model="addFormData.nama_cabang" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewCabang">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal for editing cabang -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT CABANG</h4>
      <div class="form-group">
        <label for="id_cabang">ID Cabang</label>
        <input type="text" id="id_cabang" v-model="editFormData.id_cabang" />
      </div>
      <div class="form-group">
        <label for="nama_cabang">Nama Cabang</label>
        <input type="text" id="nama_cabang" v-model="editFormData.nama_cabang" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditCabang">Update Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
