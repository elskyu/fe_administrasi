<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const reservasiList = ref([]);
const cabangList = ref([]);
const ruangList = ref([]);
const pegawaiList = ref([]);
const currentReservasiId = ref(null);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const cabangFilter = ref('');
const ruangFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

const addFormData = ref({
  id_reservasi: '',
  ruang: '',
  tanggal_reservasi: '',
  tanggal_selesai: '',
  durasi: '',
  pegawai: '',
  keterangan: '',
  cabang: '',
});

const editFormData = ref({
  id_reservasi: '',
  ruang: '',
  tanggal_reservasi: '',
  tanggal_selesai: '',
  durasi: '',
  pegawai: '',
  keterangan: '',
  cabang: '',
});

const fetchDataReservasi = async () => {
  try {
    const response = await api.get('/api/rr');
    console.log(response);
    reservasiList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching reservasi:', error);
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

const fetchDataRuang = async () => {
  try {
    const response = await api.get('/api/ruang');
    ruangList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const fetchDataPegawai = async () => {
  try {
    const response = await api.get('/api/pegawai');
    pegawaiList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching pegawai:', error);
  }
};

const editReservasi = (r) => {
  currentReservasiId.value = r.id_reservasi;
  editFormData.value = {
    id_reservasi: r.id_reservasi,
    ruang: r.ruang,
    tanggal_reservasi: r.tanggal_reservasi,
    tanggal_selesai: r.tanggal_selesai,
    durasi: r.durasi,
    pegawai: r.pegawai,
    keterangan: r.keterangan,
    cabang: r.cabang,
  };
  showEditModal.value = true;
};

const filteredReservasi = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;
  const ruang = ruangFilter.value;

  let filtered = reservasiList.value;
  if (query) {  
    filtered = filtered.filter(reservasi =>
      getNamaRuang(reservasi.ruang).toLowerCase().includes(query) ||
      reservasi.tanggal_reservasi.toLowerCase().includes(query) ||
      reservasi.tanggal_selesai.toLowerCase().includes(query) ||
      reservasi.durasi.toLowerCase().includes(query) ||
      reservasi.pegawai.toLowerCase().includes(query) ||
      reservasi.keterangan.toLowerCase().includes(query) ||
      getNamaCabang(reservasi.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(reservasi => reservasi.cabang === cabang);
  }

  if (ruang) {
    filtered = filtered.filter(reservasi => reservasi.ruang === ruang);
  }

  return filtered;
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

const saveNewReservasi = async () => {
  try {
    await api.post('/api/rr', addFormData.value);
    addFormData.value = {
      id_reservasi: '',
      ruang: '',
      tanggal_reservasi: '',
      tanggal_selesai: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showAddModal.value = false;
    fetchDataReservasi();
    generateNewRrId();
  } catch (error) {
    console.error('Error saving new reservasi:', error);
  }
};

const saveEditReservasi = async () => {
  try {
    await api.put(`/api/rr/${currentReservasiId.value}`, editFormData.value);
    editFormData.value = {
      id_reservasi: '',
      ruang: '',
      tanggal_reservasi: '',
      tanggal_selesai: '',
      durasi: '',
      pegawai: '',
      keterangan: '',
      cabang: '',
    };
    showEditModal.value = false;
    fetchDataReservasi();
    generateNewRrId();
  } catch (error) {
    console.error('Error saving edit reservasi:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const getNamaRuang = (idRuang) => {
  const ruang = ruangList.value.find(r => r.id_ruang === idRuang);
  return ruang ? ruang.nama_ruang : '';
};

const getNamaPegawai = (idPegawai) => {
  const pegawai = pegawaiList.value.find(p => p.id_pegawai === idPegawai);
  return pegawai ? pegawai.nama_pegawai : '';
};

const deleteReservasi = async (id_reservasi) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/rr/${id_reservasi}`);
      reservasiList.value = reservasiList.value.filter(reservasi => reservasi.id_reservasi !== id_reservasi);
      generateNewRrId();
      fetchDataReservasi();
    } catch (error) {
      console.error('Error deleting reservasi:', error);
    }
  }
};

function convertToMinutes(time) {
  const [hours, minutes, seconds] = time.split(':');
  return parseInt(hours) * 60 + parseInt(minutes);
}

function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:00`;
}

const generateNewRrId = async () => {
  try {
    const response = await api.get('/api/rrall');
    const reservasiList = response.data.data;

    if (reservasiList.length === 0) {
      addFormData.value.id_reservasi = "RSV001";
    } else {
      const existingIds = reservasiList.map(rr => parseInt(rr.id_reservasi.slice(3)));
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

      addFormData.value.id_reservasi = `RSV${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Reservasi ID:', error);
  }
};

onMounted(() => {
  generateNewRrId();
  fetchDataReservasi();
  fetchDataCabang();
  fetchDataRuang();
  fetchDataPegawai();
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>RESERVASI</h2>
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
                    <select id="ruangFilter" v-model="ruangFilter" class="form-cari" style="margin-right: 10px; width: 175px;">
                      <option value="">Semua Ruang</option>
                      <option v-for="r in ruangList" :value="r.id_ruang" :key="r.id_ruang">{{ r.nama_ruang }}</option>
                    </select>
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari reservasi" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>
              
              
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col">ID RESERVASI</th>
                    <th scope="col">RUANG</th>
                    <th scope="col">TANGGAL RESERVASI</th>
                    <th scope="col">TANGGAL SELESAI</th>
                    <th scope="col">DURASI</th>
                    <th scope="col">PEGAWAI</th>
                    <th scope="col">KETERANGAN</th>
                    <th scope="col">CABANG</th>
                    <th scope="col">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredReservasi.length === 0">
                    <td colspan="9" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(reservasi, index) in filteredReservasi" :key="index">
                    <td class="text-center">{{ reservasi.id_reservasi }}</td>
                    <td>{{ getNamaRuang(reservasi.ruang) }}</td>
                    <td>{{ reservasi.tanggal_reservasi }}</td>
                    <td>{{ reservasi.tanggal_selesai }}</td>
                    <td>{{ convertToMinutes(reservasi.durasi) + " menit" }}</td>
                    <td>{{ reservasi.pegawai }}</td>
                    <td>{{ reservasi.keterangan }}</td>
                    <td>{{ getNamaCabang(reservasi.cabang) }}</td>
                    <td class="text-center">
                        <button @click="editReservasi(reservasi)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteReservasi(reservasi.id_reservasi)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

  <!-- Modal untuk menambah reservasi baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH RESERVASI</h4>
            <div class="form-group-row">
              <div class="form-group" style="width: 195px;">
                <label for="id_reservasi">Id Reservasi</label>
                <input v-model="addFormData.id_reservasi" type="text" id="id_reservasi">
              </div>      
              <div class="form-group" style="width: 195px;">
                <label for="ruang">Ruang</label>
                <select id="ruang" v-model="addFormData.ruang">
                  <option v-for="r in ruangList" :value="r.id_ruang" :key="r.id_ruang">{{ r.nama_ruang }}</option>
                </select>
              </div>
            </div> 
            <div class="form-group-row">
              <div class="form-group" style="width: 195px;">
                <label for="tanggal_reservasi">Tanggal Reservasi</label>
                <input v-model="addFormData.tanggal_reservasi" type="datetime-local" id="tanggal_reservasi" >
              </div>
              <div class="form-group" style="width: 195px;">
                <label for="tanggal_selesai">Tanggal Selesai</label>
                <input v-model="addFormData.tanggal_selesai" type="datetime-local" id="tanggal_selesai">
              </div>
            </div>
            
            <div class="form-group">
              <label for="durasi">Durasi</label>
              <input v-model="addFormData.durasi" type="time" id="durasi">
            </div>
            <div class="form-group">
              <label for="pegawai">Pegawai</label>
              <input v-model="addFormData.pegawai" type="text" id="pegawai">
            </div>
            <div class="form-group">
              <label for="keterangan">Keterangan</label>
              <input v-model="addFormData.keterangan" type="text" id="keterangan">
            </div>
            <div class="form-group">
              <label for="cabang">Cabang</label>
              <select id="cabang" v-model="addFormData.cabang">
                <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
              </select>
            </div>

            <div class="form-actions">
              <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewReservasi">Simpan Perubahan</button>
              <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
            </div>
        </div>
    </div>

  <!-- Modal untuk mengedit reservasi -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH RESERVASI</h4>
            <div class="form-group-row">
              <div class="form-group" style="width: 195px;">
                <label for="id_reservasi">Id Reservasi</label>
                <input v-model="editFormData.id_reservasi" type="text" id="id_reservasi">
              </div>      
              <div class="form-group" style="width: 195px;">
                <label for="ruang">Ruang</label>
                <select id="ruang" v-model="editFormData.ruang">
                  <option v-for="r in ruangList" :value="r.id_ruang" :key="r.id_ruang">{{ r.nama_ruang }}</option>
                </select>
              </div>
            </div> 
            <div class="form-group-row">
              <div class="form-group" style="width: 195px;">
                <label for="tanggal_reservasi">Tanggal Reservasi</label>
                <input v-model="editFormData.tanggal_reservasi" type="datetime-local" id="tanggal_reservasi" >
              </div>
              <div class="form-group" style="width: 195px;">
                <label for="tanggal_selesai">Tanggal Selesai</label>
                <input v-model="editFormData.tanggal_selesai" type="datetime-local" id="tanggal_selesai">
              </div>
            </div>
            
            <div class="form-group">
              <label for="durasi">Durasi</label>
              <input v-model="editFormData.durasi" type="time" id="durasi">
            </div>
            <div class="form-group">
              <label for="pegawai">Pegawai</label>
              <input v-model="editFormData.pegawai" type="text" id="pegawai">
            </div>
            <div class="form-group">
              <label for="keterangan">Keterangan</label>
              <input v-model="editFormData.keterangan" type="text" id="keterangan">
            </div>
            <div class="form-group">
              <label for="cabang">Cabang</label>
              <select id="cabang" v-model="editFormData.cabang">
                <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
              </select>
            </div>

            <div class="form-actions">
              <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditReservasi">Update Perubahan</button>
              <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Tambahkan gaya khusus untuk tampilan reservasi di sini */
</style>

