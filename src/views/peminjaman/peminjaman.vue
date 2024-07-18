<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/peminjaman.css';
import '/src/style/modal.css';

// State untuk menyimpan data inventaris
const pemakaianList = ref([]);
const cabangList = ref([]);
const pegawaiList = ref([]);
const currentPemakaianId = ref(null);
const searchQuery = ref('');
const tempSearchQuery = ref('');

// State untuk mengontrol modal tambah
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data untuk tambah inventaris
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

// Ambil data inventaris dari API
const fetchDataPemakaian = async () => {
  try {
    const response = await api.get('/api/pi');
    console.log(response); // Untuk inspeksi struktur respons
    pemakaianList.value = response.data.data.data; // Sesuaikan dengan struktur respons yang sesuai
  } catch (error) {
    console.error('Error fetching inventaris:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cabang');
    cabangList.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching cabang list:', error);
  }
};

const editPemakaian = (p) => {
  currentPemakaianId.value = p.id_inventaris;
  editFormData.value = {
    id_inventaris: p.id_inventaris,
    nopol: p.nopol,
    merek: p.merek,
    kategori: p.kategori,
    tahun: p.tahun,
    pajak: p.pajak,
    masa_pajak: p.masa_pajak,
    harga_beli: p.harga_beli,
    tanggal_beli: p.tanggal_beli,
    cabang: p.cabang, // Pastikan cabang_id diambil dari p.cabang.id_cabang
  };
  showEditModal.value = true;
};

// Properti computed untuk memfilter inventaris berdasarkan query pencarian
const filteredPemakaian = computed(() => {
  if (!searchQuery.value) {
    return pemakaianList.value;
  }
  return pemakaianList.value.filter(pemakaian =>
    pemakaian.nopol.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.merek.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.kategori.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.tahun.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.pajak.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.masa_pajak.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.harga_beli.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pemakaian.tanggal_beli.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Metode untuk menangani klik tombol pencarian
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Fungsi untuk menyimpan data inventaris baru
const saveNewPemakaian = async () => {
  try {
    await api.post('/api/pi', addFormData.value);
    // Reset form data
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
    // Tutup modal tambah
    showAddModal.value = false;
    // Muat ulang daftar inventaris
    fetchDataPemakaian();
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
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

const fetchDataPegawai = async () => {
  try {
    const response = await api.get('/api/pegawai');
    pegawaiList.value = response.data.data.data; // Adjust based on the actual response structure
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

// Jalankan hook "onMounted"
onMounted(() => {
  fetchDataPegawai();
  fetchDataPemakaian();
  fetchDataCabang();
});
</script>

<template>
 <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
            <div class="row">
                <div class="card2" style="">
                    <h2>PEMAKAIAN INVENTARIS</h2>
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
                        <!-- Search Bar -->
                        <div class="d-flex justify-content-end">
                            <button @click="handleSearch" class="btn btn-primary">FILTER</button>
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
                <input type="text" id="inventaris" v-model="addFormData.inventaris" />
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
</template>