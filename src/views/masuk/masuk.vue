<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const userName = ref(''); // Default name

const suratMasuk = ref([]);
const cabangList = ref([]);
const searchQuery = ref('');
const cabangFilter = ref('');
const showAddModal = ref(false);

const addFormData = ref({
  id_surat_masuk: '',
  nomor_surat: '',
  tanggal_surat: '',
  tanggal_terima: '',
  asal_surat: '',
  perihal: '',
  cabang: '',
});

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

const fetchDataSuratMasuk = async () => {
  try {
    const response = await api.get('/api/sm');
    console.log(response);
    suratMasuk.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching surat masuk:', error);
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

const filteredSuratMasuk = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;

  let filtered = suratMasuk.value;
  
  if (query) {
    filtered = filtered.filter(s =>
      s.nomor_surat.toLowerCase().includes(query) ||
      s.perihal.toLowerCase().includes(query) ||
      s.asal_surat.toLowerCase().includes(query) ||
      getNamaCabang(s.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(s => s.cabang === cabang);
  }

  return filtered;
});

const saveNewSuratMasuk = async () => {
  try {
    await api.post('/api/sm', addFormData.value);
    addFormData.value = {
      id_surat_masuk: '',
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_terima: '',
      asal_surat: '',
      perihal: '',
      cabang: '',
    };
    showAddModal.value = false;
    fetchDataSuratMasuk();
    generateNewSmId();
  } catch (error) {
    console.error('Error saving new surat masuk:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const generateNewSmId = async () => {
  try {
    const response = await api.get('/api/small');
    const suratMasuk = response.data.data;

    if (suratMasuk.length === 0) {
      addFormData.value.id_surat_masuk = "SM001";
    } else {
      const existingIds = suratMasuk.map(sm => parseInt(sm.id_surat_masuk.slice(3)));
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

      addFormData.value.id_surat_masuk = `SM${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Surat Masuk ID:', error);
  }
};

onMounted(() => {
  generateNewSmId();
  fetchDataSuratMasuk();
  fetchDataCabang();
  fetchUserName();
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>SURAT MASUK</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <h4>Hello {{ userName }}</h4>
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
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari surat" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>
              
              
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col" style="width:13%">ID SURAT MASUK</th>
                    <th scope="col" style="width:13%">NOMOR SURAT</th>
                    <th scope="col" style="width:13%">TANGGAL SURAT</th>
                    <th scope="col" style="width:13%">TANGGAL TERIMA</th>
                    <th scope="col" style="width:15%">ASAL SURAT</th>
                    <th scope="col" style="width:15%">PERIHAL</th>
                    <th scope="col" style="width:20%">CABANG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredSuratMasuk.length === 0">
                    <td colspan="8" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(s, index) in filteredSuratMasuk" :key="index">
                    <td class="text-center">{{ s.id_surat_masuk }}</td>
                    <td class="text-center">{{ s.nomor_surat }}</td>
                    <td>{{ s.tanggal_surat }}</td>
                    <td>{{ s.tanggal_terima }}</td>
                    <td>{{ s.asal_surat }}</td>
                    <td>{{ s.perihal }}</td>
                    <td>{{ getNamaCabang(s.cabang) }}</td>
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

  <!-- Modal untuk menambah surat masuk baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH SURAT MASUK</h4>
      <div class="form-group">
        <label for="id_surat_masuk">ID Surat Masuk</label>
        <input type="text" id="id_surat_masuk" v-model="addFormData.id_surat_masuk" />
      </div>
      <div class="form-group">
        <label for="nomor_surat">Nomor Surat</label>
        <input type="text" id="nomor_surat" v-model="addFormData.nomor_surat" />
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="tanggal_surat" style="width: 195px;">Tanggal Surat</label>
          <input type="date" id="tanggal_surat" v-model="addFormData.tanggal_surat" />
        </div>
        <div class="form-group">
          <label for="tanggal_terima" style="width: 195px;">Tanggal Terima</label>
          <input type="date" id="tanggal_terima" v-model="addFormData.tanggal_terima" />
        </div>
      </div>
      <div class="form-group">
        <label for="asal_surat">Asal Surat</label>
        <input type="text" id="asal_surat" v-model="addFormData.asal_surat" />
      </div>
      <div class="form-group">
        <label for="perihal">Perihal</label>
        <input type="text" id="perihal" v-model="addFormData.perihal" />
      </div>
      <div class="form-group">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="addFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSuratMasuk">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
