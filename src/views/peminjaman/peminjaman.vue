<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/peminjaman.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const userName = ref(''); // Default name
const pemakaianList = ref([]);
const cabangList = ref([]);
const inventarisList = ref([]);
const pegawaiList = ref([]);
const currentPemakaianId = ref(null);
const searchQuery = ref('');
const cabangFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

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


const fetchDataPemakaian = async () => {
  try {
    const response = await api.get('/api/pi');
    console.log(response);
    pemakaianList.value = response.data.data.data;
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
  const cabang = cabangFilter.value;

  let filtered = pemakaianList.value;

  if (query) {
    filtered = filtered.filter(pemakaian =>
      pemakaian.nopol.toLowerCase().includes(query) ||
      pemakaian.merek.toLowerCase().includes(query) ||
      pemakaian.kategori.toLowerCase().includes(query) ||
      pemakaian.tahun.toLowerCase().includes(query) ||
      pemakaian.pajak.toLowerCase().includes(query) ||
      pemakaian.keterangan.toLowerCase().includes(query) ||
      pemakaian.harga_beli.toLowerCase().includes(query) ||
      pemakaian.tanggal_beli.toLowerCase().includes(query) ||
      getNamaCabang(pemakaian.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(inventaris => inventaris.cabang === cabang);
  }

  return filtered;
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

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

onMounted(async () => {
  generateNewPiId();
  fetchDataPegawai();
  fetchDataPemakaian();
  fetchDataCabang();
  fetchDataInventaris();
  await fetchUserName();
});
</script>

<template>
 <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>PEMAKAIAN INVENTARIS</h2>
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
                        <select id="cabangFilter" v-model="cabangFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                          <option value="">Semua Cabang</option>
                          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
                        </select>
                        <div class="search-container" style="margin-right: -10px; width: 275px;">
                          <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari pemakaian" style="width: 100%; padding-right: 40px;" />
                          <SearchIcon class="search-icon" />
                        </div>
                      </div>
                    </div>
                
                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:10%">ID PINJAM</th>
                      <th scope="col" style="width:7%">INVENTARIS</th>
                      <th scope="col" style="width:15%">TANGGAL PINJAM</th>
                      <th scope="col" style="width:15%">TANGGAL KEMBALI</th>
                      <th scope="col" style="width:12%">DURASI PINJAM</th>
                      <th scope="col" style="width:7%">PEGAWAI</th>
                      <th scope="col" style="width:15%">KETERANGAN</th>
                      <th scope="col" style="width:7%">CABANG</th>
                      <th scope="col" style="width:15%">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredPemakaian.length === 0">
                      <td colspan="11" class="text-center">
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
                          <button @click="editPemakaian(pemakaian)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                          <button @click="deletePemakaian(pemakaian.id_pinjam)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

    <!-- Simple Pop-up Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH PEMAKAIAN INVENTARIS</h4>
        <div class="form-group-row">
            <div class="form-group">
                <label for="id_pinjam" style="width: 195px;">ID Inven</label>
                <input type="text" id="id_pinjam" v-model="addFormData.id_pinjam" />
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
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH PEMAKAIAN INVENTARIS</h4>
        <div class="form-group-row">
            <div class="form-group">
                <label for="id_pinjam" style="width: 195px;">ID Inven</label>
                <input type="text" id="id_pinjam" v-model="editFormData.id_pinjam" />
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