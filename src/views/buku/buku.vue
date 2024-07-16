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
const cabangList = ref([]);
const departementList = ref([]);
const searchQuery = ref('');
const tempSearchQuery = ref('');

// State untuk mengontrol modal tambah dan edit
const showAddModal = ref(false);

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
  if (!searchQuery.value) {
    return bukuTamu.value;
  }
  return bukuTamu.value.filter(tamu =>
    tamu.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tamu.jabatan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tamu.no_hp.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tamu.departement_dikunjungi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tamu.org_dikunjungi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tamu.keperluan.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const getNamaDepartemen = (idDepartemen) => {
  const departement = departementList.value.find(d => d.id_departement === idDepartemen);
  return departement ? departement.nama_departement : '';
};

// Jalankan hook "onMounted"
onMounted(() => {
  fetchDataBukuTamu();
  fetchDataCabang();
  fetchDataDepartement();
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
                    <button @click="handleSearch" class="btn btn-primary ml-2">FILTER</button>
                  </div>
                </div>
              
              
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col">ID TAMU</th>
                    <th scope="col">TANGGAL KUNJUNGAN</th>
                    <th scope="col">NAMA</th>
                    <th scope="col">JABATAN</th>
                    <th scope="col">NO HP</th>
                    <th scope="col">DEPARTEMEN DIKUNJUNGI</th>
                    <th scope="col">ORANG DIKUNJUNGI</th>
                    <th scope="col">KEPERLUAN</th>
                    <th scope="col">CABANG</th>
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
                    <td>{{ tamu.org_dikunjungi }}</td>
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
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveNewTamu">Simpan Perubahan</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
