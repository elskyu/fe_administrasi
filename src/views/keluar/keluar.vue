<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api'; // Sesuaikan dengan struktur folder dan file yang benar
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State untuk menyimpan data surat masuk
const suratMasuk = ref([]);
const cabangList = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');

// State untuk mengontrol modal tambah dan edit
const showAddModal = ref(false);

// Form data untuk tambah surat masuk
const addFormData = ref({
  id_surat_keluar: '', // Tambahkan id_surat_masuk di sini
  nomor_surat: '',
  tanggal_surat: '',
  tanggal_kirim: '',
  tujuan_surat: '',
  perihal: '',
  cabang: '',
});

// Ambil data surat masuk dari API
const fetchDataSuratMasuk = async () => {
  try {
    const response = await api.get('/api/sk');
    console.log(response); // Untuk inspeksi struktur respons
    suratMasuk.value = response.data.data.data; // Sesuaikan dengan struktur respons yang sesuai
  } catch (error) {
    console.error('Error fetching surat masuk:', error);
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


// Properti computed untuk memfilter surat masuk berdasarkan query pencarian
const filteredSuratMasuk = computed(() => {
  if (!searchQuery.value) {
    return suratMasuk.value;
  }
  return suratMasuk.value.filter(s =>
    s.nomor_surat.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Metode untuk menangani klik tombol pencarian
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Fungsi untuk menyimpan data surat masuk baru
const saveNewSuratMasuk = async () => {
  try {
    await api.post('/api/sk', addFormData.value);
    // Reset form data
    addFormData.value = {
      id_surat_keluar: '', // Reset id_surat_masuk
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      tujuan_surat: '',
      perihal: '',
      cabang: '',
    };
    // Tutup modal tambah
    showAddModal.value = false;
    // Muat ulang daftar surat masuk
    fetchDataSuratMasuk();
  } catch (error) {
    console.error('Error saving new surat masuk:', error);
  }
};


const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};


// Jalankan hook "onMounted"
onMounted(() => {
  fetchDataSuratMasuk();
  fetchDataCabang();
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>SURAT KELUAR</h2>
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
                    <th scope="col" style="width:13%">ID SURAT KELUAR</th>
                    <th scope="col" style="width:13%">NOMOR SURAT</th>
                    <th scope="col" style="width:13%">TANGGAL SURAT</th>
                    <th scope="col" style="width:13%">TANGGAL KIRIM</th>
                    <th scope="col" style="width:15%">TUJUAN SURAT</th>
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
                    <td class="text-center">{{ s.id_surat_keluar }}</td>
                    <td class="text-center">{{ s.nomor_surat }}</td>
                    <td>{{ s.tanggal_surat }}</td>
                    <td>{{ s.tanggal_kirim }}</td>
                    <td>{{ s.tujuan_surat }}</td>
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
        <label for="id_surat_keluar">ID Surat Keluar</label>
        <input type="text" id="id_surat_keluar" v-model="addFormData.id_surat_keluar" />
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
          <label for="tanggal_kirim" style="width: 195px;">Tanggal Kirim</label>
          <input type="date" id="tanggal_kirim" v-model="addFormData.tanggal_kirim" />
        </div>
      </div>
      <div class="form-group">
        <label for="tujuan_surat">Tujuan Surat</label>
        <input type="text" id="tujuan_surat" v-model="addFormData.tujuan_surat" />
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
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveNewSuratMasuk">Simpan Perubahan</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>

