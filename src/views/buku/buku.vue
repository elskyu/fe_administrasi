<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api'; // Sesuaikan dengan struktur folder dan file yang benar
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';


// State untuk menyimpan data buku tamu
const bukuTamu = ref([]);
const pegawaiList = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');

// State untuk mengontrol modal tambah dan edit
const showAddModal = ref(false);

// State untuk kontrol visibility dropdown menu
const showDropdown = ref(false);

// Form data untuk tambah tamu
const addFormData = ref({
  id_tamu: '',
  tanggal_kunjungan: '',
  nama: '',
  jabatan: '',
  no_hp: '',
  departement_dikunjungi: '',
  org_dikunjungi: '',
  keperluan: '',
  cabang: '',
});

// Ambil data buku tamu dari API
const fetchDataBukuTamu = async () => {
  try {
    const response = await api.get('/api/tamu');
    console.log(response); // Untuk inspeksi struktur respons
    bukuTamu.value = response.data.data.data; // Sesuaikan dengan struktur respons yang sesuai
  } catch (error) {
    console.error('Error fetching buku tamu:', error);
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

const fetchDataDepartement = async () => {
  try {
    const response = await api.get('/api/departement');
    departementList.value = response.data.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching departement list:', error);
  }
};

// Properti computed untuk memfilter buku tamu berdasarkan query pencarian
const filteredBukuTamu = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    return bukuTamu.value;
  }
  return bukuTamu.value.filter(tamu =>
    tamu.nama.toLowerCase().includes(query) ||
    tamu.jabatan.toLowerCase().includes(query) ||
    tamu.no_hp.toLowerCase().includes(query) ||
    tamu.departement_dikunjungi.toLowerCase().includes(query) ||
    tamu.org_dikunjungi.toLowerCase().includes(query) ||
    tamu.keperluan.toLowerCase().includes(query) ||
    getNamaCabang(tamu.cabang).toLowerCase().includes(query)
  );
});

// Metode untuk menangani klik tombol pencarian
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Fungsi untuk menyimpan data tamu baru
const saveNewTamu = async () => {
  try {
    await api.post('/api/tamu', addFormData.value);
    // Reset form data
    addFormData.value = {
      id_tamu: '',
      tanggal_kunjungan: '',
      nama: '',
      jabatan: '',
      no_hp: '',
      departement_dikunjungi: '',
      org_dikunjungi: '',
      keperluan: '',
      cabang: '',
    };
    // Tutup modal tambah
    showAddModal.value = false;
    // Muat ulang daftar buku tamu
    fetchDataBukuTamu();
  } catch (error) {
    console.error('Error saving new tamu:', error);
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

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const getNamaDepartemen = (idDepartemen) => {
  const departement = departementList.value.find(d => d.id_departement === idDepartemen);
  return departement ? departement.nama_departement : '';
};

const filterByCategory = (categoryType, value) => {
  if (categoryType === 'month') {
    selectedMonth.value = value;
  } else if (categoryType === 'departement') {
    selectedDepartement.value = value;
  } else if (categoryType === 'cabang') {
    selectedCabang.value = value;
  }
  showDropdown.value = false; // Hide the dropdown menu after selecting a filter
};

// Fungsi untuk toggle visibility dropdown menu
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Jalankan hook "onMounted"
onMounted(() => {
  fetchDataBukuTamu();
  fetchDataCabang();
  fetchDataDepartement();
  fetchDataPegawai();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>BUKU TAMU</h2>
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
                    <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari buku" style="margin-right: 10px; width: 300px;">
                    <div class="dropdown" style="position: relative;">
                      <button @click="toggleDropdown" class="btn btn-icon">
                        <svg width="28" height="28" viewBox="0   0 24 24"  xmlns="http://www.w3.org/2000/svg" style="margin-right: -15px;">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7221 7.47212C20.98 7.21432 21.1249 6.86464 21.125 6.5V3.75C21.125 2.23122 19.8938 1 18.375 1H5.75C4.23122 1 3 2.23122 3 3.75V6.5C3.00008 6.86464 3.14499 7.21432 3.40288 7.47212L9 14V22C9 22.5523 9.44772 23 10 23H11.5C11.8148 23 12.1111 22.8518 12.3 22.6L15 19V14L20.7221 7.47212Z" fill="black"/>
                        </svg>
                      </button>
                      <div v-if="showDropdown" class="dropdown-menu" style="position: absolute; top: 100%; left: 0; z-index: 1000; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">
                        <a class="dropdown-item" href="#" @click.prevent="filterByCategory('month', '1')">Bulan</a>
                        <a class="dropdown-item" href="#" @click.prevent="filterByCategory('department', 'selectedDepartement')">Departemen</a>
                        <a class="dropdown-item" href="#" @click.prevent="filterByCategory('branch', 'selectedCabang')">Cabang</a>
                      </div>
                    </div>   
                  </div>
                </div>
          
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col" style="width: 7%;">ID TAMU</th>
                    <th scope="col" style="width: 16%;">TANGGAL KUNJUNGAN</th>
                    <th scope="col" style="width: 5%;">NAMA</th>
                    <th scope="col" style="width: 5%;">JABATAN</th>
                    <th scope="col" style="width: 7%;">NO HP</th>
                    <th scope="col" style="width: 18%;">DEPARTEMEN DIKUNJUNGI</th>
                    <th scope="col" style="width: 15%;">ORANG DIKUNJUNGI</th>
                    <th scope="col" style="width: 15%;">KEPERLUAN</th>
                    <th scope="col" style="width: 7%;">CABANG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredBukuTamu.length === 0">
                    <td colspan="9" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(tamu, index) in filteredBukuTamu" :key="index">
                    <td class="text-center">{{ tamu.id_tamu }}</td>
                    <td>{{ tamu.tanggal_kunjungan }}</td>
                    <td>{{ tamu.nama }}</td>
                    <td>{{ tamu.jabatan }}</td>
                    <td>{{ tamu.no_hp }}</td>
                    <td>{{ getNamaDepartemen(tamu.departement_dikunjungi) }}</td>
                    <td>{{ getNamaPegawai(tamu.org_dikunjungi) }}</td>
                    <td>{{ tamu.keperluan }}</td>
                    <td>{{ getNamaCabang(tamu.cabang) }}</td>
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

  <!-- Modal untuk menambah tamu baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH TAMU</h4>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="id_tamu">ID Tamu</label>
          <input type="text" id="id_tamu" v-model="addFormData.id_tamu" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="nama">Nama</label>
          <input type="text" id="nama" v-model="addFormData.nama" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tanggal_kunjungan">Tanggal Kunjungan</label>
          <input type="date" id="tanggal_kunjungan" v-model="addFormData.tanggal_kunjungan" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="cabang">Cabang</label>
          <select id="cabang" v-model="addFormData.cabang">
            <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
          </select>
        </div>
      </div>
      <div class="form-group" style="width: 400px;">
        <label for="departement_dikunjungi">Departemen Dikunjungi</label>
          <select id="departement_dikunjungi" v-model="addFormData.departement_dikunjungi">
            <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{ dep.nama_departement }}</option>
          </select>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="jabatan">Jabatan</label>
          <input type="text" id="jabatan" v-model="addFormData.jabatan" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="no_hp">No HP</label>
          <input type="text" id="no_hp" v-model="addFormData.no_hp" />
        </div>
      </div>     
      
      <div class="form-group">
        <label for="org_dikunjungi">Orang Dikunjungi</label>
        <input type="text" id="org_dikunjungi" v-model="addFormData.org_dikunjungi" />
      </div>
      <div class="form-group">
        <label for="keperluan">Keperluan</label>
        <input type="text" id="keperluan" v-model="addFormData.keperluan" />
      </div>
      
      <div class="form-actions">
        <button class="btn-modal-save rounded-sm shadow border-0" @click="saveNewTamu">Simpan Perubahan</button>
        <button class="btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>


