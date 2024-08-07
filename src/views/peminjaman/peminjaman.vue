<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/peminjaman.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const pemakaianList = ref([]);
const cabangList = ref([]);
const inventarisList = ref([]);
const pegawaiList = ref([]);
const currentPemakaianId = ref(null);
const searchQuery = ref('');
const cabangFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(true); // State untuk loading
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Disesuaikan dengan pagination dari backend
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  id_pinjam: '',
  inventaris: '',
  tanggal_pinjam: '',
  tanggal_kembali: '',
  durasi: '',
  pegawai: '',
  keterangan: '',
  cabang: '',
});

const editFormData = ref({
  id_pinjam: '',
  inventaris: '',
  tanggal_pinjam: '',
  tanggal_kembali: '',
  durasi: '',
  pegawai: '',
  keterangan: '',
  cabang: '',
});

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataSuratKeluar(); // Fetch data for the new page
  }
};

const fetchDataPemakaian = async () => {
  try {
    let response

    if (cabangFilter.value === '') {
      response = await api.get('/api/pi', {
        params: {
          page: currentPage.value,
        }
      });
    } else {
      response = await api.get(`/api/pi?cabang?=${cabangFilter.value}`, {
        params: {
          page: currentPage.value,
        }
      });
    }

    pemakaianList.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/inventaris');
    inventarisList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const editPemakaian = (p) => {
  currentPemakaianId.value = p.id_pinjam;
  editFormData.value = {
    id_pinjam: p.id_pinjam,
    inventaris: p.inventaris,
    tanggal_pinjam: p.tanggal_pinjam,
    tanggal_kembali: p.tanggal_kembali,
    durasi_pinjam: p.durasi_pinjam,
    pegawai: p.pegawai,
    keterangan: p.keterangan,
    cabang: p.cabang,
  };
  showEditModal.value = true;
};

const filteredPemakaian = computed(() => {
  const query = searchQuery.value.toLowerCase();

  let filtered = pemakaianList.value;

  if (query) {
    filtered = filtered.filter(pemakaian =>
      pemakaian.id_pinjam.toLowerCase().includes(query) ||
      pemakaian.inventaris.toLowerCase().includes(query) ||
      pemakaian.tanggal_pinjam.toLowerCase().includes(query) ||
      pemakaian.tanggal_kembali.toLowerCase().includes(query) ||
      pemakaian.durasi_pinjam.toLowerCase().includes(query) ||
      getNamaPegawai(pemakaian.pegawai).toLowerCase().includes(query) ||
      pemakaian.keterangan.toLowerCase().includes(query) ||
      getNamaCabang(pemakaian.cabang).toLowerCase().includes(query)
    );
  }

  return filtered;
});


const saveNewPemakaian = async () => {
  try {
    await api.post('/api/pi', addFormData.value);
    addFormData.value = {
      id_pinjam: '',
      inventaris: '',
      tanggal_pinjam: '',
      tanggal_kembali: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showAddModal.value = false;
    fetchDataPemakaian();
    generateNewPiId();
  } catch (error) {
    console.error('Error saving new inventaris:', error);
  }
};

const saveEditPemakaian = async () => {
  try {
    await api.put(`/api/pi/${currentPemakaianId.value}`, editFormData.value);
    editFormData.value = {
      id_pinjam: '',
      inventaris: '',
      tanggal_pinjam: '',
      tanggal_kembali: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showEditModal.value = false;
    fetchDataPemakaian();
    generateNewPiId();
  } catch (error) {
    console.error('Error saving edit pegawai:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const deletePemakaian = async (id_pinjam) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/pi/${id_pinjam}`);
      pemakaian.value = pemakaian.value.filter(pemakaian => pemakaian.id_pinjam !== id_pinjam);
      fetchDataPemakaian();
      generateNewPiId();
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

const fetchDataPegawai = async () => {
  try {
    const response = await api.get('/api/pegawai');
    pegawaiList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching pegawai list:', error);
  }
};

const getNamaPegawai = (idPegawai) => {
  const pegawai = pegawaiList.value.find(p => p.id_pegawai === idPegawai);
  return pegawai ? pegawai.nama : '';
};

function convertToMinutes(time) {
  const [hours, minutes, seconds] = time.split(':');
  return parseInt(hours) * 60 + parseInt(minutes);
}

const generateNewPiId = async () => {
  try {
    const response = await api.get('/api/piall');
    const pemakaianList = response.data.data;

    if (pemakaianList.length === 0) {
      addFormData.value.id_pinjam = "PI001";
    } else {
      const existingIds = pemakaianList.map(pi => parseInt(pi.id_pinjam.slice(3)));
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

      addFormData.value.id_pinjam = `PI${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Peminjaman ID:', error);
  }
};

watch(cabangFilter, async () => {
  await fetchDataPemakaian();
});

onMounted(async () => {
  fetchDataCabang();
  fetchDataPegawai();
  fetchDataPemakaian();
  await fetchDataInventaris();
  await generateNewPiId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Peminjaman Inventaris</h2>
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
                  <!-- <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Tambah</button> -->
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
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari pemakaian"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:8%">ID Peminjaman</th>
                      <th scope="col" style="width:7%">Inventaris</th>
                      <th scope="col" style="width:15%">Tanggal Pinjam</th>
                      <th scope="col" style="width:15%">Tanggal Kembali</th>
                      <th scope="col" style="width:12%">Durasi Pinjam</th>
                      <th scope="col" style="width:10%">Pegawai</th>
                      <th scope="col" style="width:13%">Keterangan</th>
                      <th scope="col" style="width:8%">Cabang</th>
                      <th scope="col" style="width:15%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredPemakaian.length === 0">
                      <td colspan="9" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(pemakaian, index) in filteredPemakaian" :key="index">
                      <td class="text-center">{{ pemakaian.id_pinjam }}</td>
                      <td>{{ pemakaian.inventaris }}</td>
                      <td>{{ pemakaian.tanggal_pinjam }}</td>
                      <td>{{ pemakaian.tanggal_kembali }}</td>
                      <td>{{ convertToMinutes(pemakaian.durasi_pinjam) + " menit" }}</td>
                      <td>{{ getNamaPegawai(pemakaian.pegawai) }}</td>
                      <td>{{ pemakaian.keterangan }}</td>
                      <td>{{ getNamaCabang(pemakaian.cabang) }}</td>
                      <td class="text-center">
                        <button @click="editPemakaian(pemakaian)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deletePemakaian(pemakaian.id_pinjam)" class="btn btn-sm btn-danger border-0"
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

  <!-- Simple Pop-up Modal -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Peminjaman Inventaris</h4>
      <div class="form-group-row">
        <div class="form-group">
          <label for="id_pinjam" style="width: 195px;">ID</label>
          <input type="text" id="id_pinjam" v-model="addFormData.id_pinjam" readonly />
        </div>
        <div class="form-group">
          <label for="inventaris" style="width: 195px;">Nama Inven</label>
          <!-- <input type="text" id="inventaris" v-model="addFormData.inventaris" /> -->
          <select id="inventaris" v-model="addFormData.inventaris">
            <option v-for="i in inventarisList" :value="i.id_inventaris" :key="i.id_inventaris">{{ i.merek }}</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="pegawai" style="width: 195px;">Nama Pegawai</label>
          <input type="text" id="pegawai" v-model="addFormData.pegawai" />
        </div>
        <div class="form-group">
          <label for="durasi_pinjam" style="width: 195px;">Durasi</label>
          <input type="time" id="durasi_pinjam" v-model="addFormData.durasi_pinjam" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="tanggal_pinjam" style="width: 195px;">Tanggal Pinjam</label>
          <input type="date" id="tanggal_pinjam" v-model="addFormData.tanggal_pinjam" />
        </div>
        <div class="form-group">
          <label for="tanggal_kembali" style="width: 195px;">Tanggal Kembali</label>
          <input type="date" id="tanggal_kembali" v-model="addFormData.tanggal_kembali" />
        </div>
      </div>
      <div class="form-group">
        <label for="keterangan">Keterangan</label>
        <input type="text" id="keterangan" v-model="addFormData.keterangan" />
      </div>
      <div class="form-group">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="addFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewPemakaian">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Simple Pop-up Modal -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Peminjaman Inventaris</h4>
      <div class="form-group-row">
        <div class="form-group">
          <label for="id_pinjam" style="width: 195px;">ID Inven</label>
          <input type="text" id="id_pinjam" v-model="editFormData.id_pinjam" readonly />
        </div>
        <div class="form-group">
          <label for="inventaris" style="width: 195px;">Nama Inven</label>
          <!-- <input type="text" id="inventaris" v-model="editFormData.inventaris" /> -->
          <select id="inventaris" v-model="editFormData.inventaris">
            <option v-for="i in inventarisList" :value="i.id_inventaris" :key="i.id_inventaris">{{ i.merek }}</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="pegawai" style="width: 195px;">Nama Pegawai</label>
          <input type="text" id="pegawai" v-model="editFormData.pegawai" />
        </div>
        <div class="form-group">
          <label for="durasi_pinjam" style="width: 195px;">Durasi</label>
          <input type="time" id="durasi_pinjam" v-model="editFormData.durasi_pinjam" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="tanggal_pinjam" style="width: 195px;">Tanggal Pinjam</label>
          <input type="date" id="tanggal_pinjam" v-model="editFormData.tanggal_pinjam" />
        </div>
        <div class="form-group">
          <label for="tanggal_kembali" style="width: 195px;">Tanggal Kembali</label>
          <input type="date" id="tanggal_kembali" v-model="editFormData.tanggal_kembali" />
        </div>
      </div>
      <div class="form-group">
        <label for="keterangan">Keterangan</label>
        <input type="text" id="keterangan" v-model="editFormData.keterangan" />
      </div>
      <div class="form-group">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="editFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditPemakaian">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>