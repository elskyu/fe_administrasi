<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/peminjaman.css';
import '/src/style/modal.css';

// State untuk menyimpan data inventaris
const inventarisList = ref([]);
const cabangList = ref([]);
const pegawaiList = ref([]);
const currentInventarisId = ref(null);
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
const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/pi');
    console.log(response); // Untuk inspeksi struktur respons
    inventarisList.value = response.data.data.data; // Sesuaikan dengan struktur respons yang sesuai
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

const editInventaris = (i) => {
  currentInventarisId.value = i.id_inventaris;
  editFormData.value = {
    id_inventaris: i.id_inventaris,
    nopol: i.nopol,
    merek: i.merek,
    kategori: i.kategori,
    tahun: i.tahun,
    pajak: i.pajak,
    masa_pajak: i.masa_pajak,
    harga_beli: i.harga_beli,
    tanggal_beli: i.tanggal_beli,
    cabang: i.cabang, // Pastikan cabang_id diambil dari p.cabang.id_cabang
  };
  showEditModal.value = true;
};

// Properti computed untuk memfilter inventaris berdasarkan query pencarian
const filteredInventaris = computed(() => {
  if (!searchQuery.value) {
    return inventarisList.value;
  }
  return inventarisList.value.filter(inventaris =>
    inventaris.nopol.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.merek.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.kategori.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.tahun.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.pajak.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.masa_pajak.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.harga_beli.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inventaris.tanggal_beli.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Metode untuk menangani klik tombol pencarian
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Fungsi untuk menyimpan data inventaris baru
const saveNewInventaris = async () => {
  try {
    await api.post('/api/inventaris', addFormData.value);
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
    fetchDataInventaris();
  } catch (error) {
    console.error('Error saving new inventaris:', error);
  }
};

const saveEditPegawai = async () => {
  try {
    await api.put(`/api/inventaris/${currentInventarisId.value}`, editFormData.value);
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
    fetchDataInventaris();
  } catch (error) {
    console.error('Error saving edit pegawai:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const deleteInventaris = async (id_pinjam) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/pi/${id_pinjam}`);
      inventaris.value = inventaris.value.filter(inventaris => inventaris.id_inventaris !== id_pinjam);
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
  fetchDataInventaris();
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
                        <button @click="showModal = true" class="btn btn-md btn-success border-0">TAMBAH</button>
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
                      <th scope="col" style="width:5%">ID PINJAM</th>
                      <th scope="col" style="width:15%">INVENTARIS</th>
                      <th scope="col" style="width:15%">TANGGAL PINJAM</th>
                      <th scope="col" style="width:12%">TANGGAL KEMBALI</th>
                      <th scope="col" style="width:15%">DURASI PINJAM</th>
                      <th scope="col" style="width:15%">PEGAWAI</th>
                      <th scope="col" style="width:15%">KETERANGAN</th>
                      <th scope="col" style="width:25%">CABANG</th>
                      <th scope="col">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredInventaris.length === 0">
                      <td colspan="11" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(inventaris, index) in filteredInventaris" :key="index">
                      <td class="text-center">{{ inventaris.id_pinjam }}</td>
                      <td>{{ inventaris.inventaris }}</td>
                      <td>{{ inventaris.tanggal_pinjam }}</td>
                      <td>{{ inventaris.tanggal_kembali }}</td>
                      <td>{{ convertToMinutes(inventaris.durasi_pinjam) + " menit" }}</td>
                      <td>{{ getNamaPegawai(inventaris.pegawai) }}</td>
                      <td>{{ inventaris.keterangan }}</td>
                      <td>{{ getNamaCabang(inventaris.cabang) }}</td>
                      <td class="text-center">
                          <button @click="editInventaris(inventaris)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                          <button @click="deleteInventaris(inventaris.id_pinjam)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH PEMAKAIAN INVENTARIS</h4>
        <div class="form-group-row">
            <div class="form-group">
                <label for="id" style="width: 195px;">ID Inven</label>
                <input type="text" id="id" v-model="formData.id" />
            </div>
            <div class="form-group">
                <label for="namainventaris" style="width: 195px;">Nama Inven</label>
                <input type="text" id="namainventaris" v-model="formData.namainventaris" />
            </div>
        </div>
        <div class="form-group-row">
            <div class="form-group">
                <label for="namapegawai" style="width: 195px;">Nama Pegawai</label>
                <input type="text" id="namapegawai" v-model="formData.namapegawai" />
            </div>
            <div class="form-group">
                <label for="durasi" style="width: 195px;">Durasi</label>
                <input type="text" id="durasi" v-model="formData.durasi" />
            </div>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label for="tanggalpinjam" style="width: 195px;">Tanggal Pinjam</label>
            <input type="date" id="tanggalpinjam" v-model="formData.tanggalpinjam" />
          </div>
          <div class="form-group">
            <label for="tanggalkembali" style="width: 195px;">Tanggal Kembali</label>
            <input type="date" id="tanggalkembali" v-model="formData.tanggalkembali" />
          </div>
        </div>
        <div class="form-group">
          <label for="keterangan">Keterangan</label>
          <input type="text" id="keterangan" v-model="formData.keterangan" />
        </div>
        <div class="form-group">
          <label for="cabang">Cabang</label>
          <input type="text" id="cabang" v-model="formData.cabang" />
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveData">Simpan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showModal = false">Batal</button>
        </div>
      </div>
    </div>
</template>