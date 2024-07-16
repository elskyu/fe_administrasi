<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api'; // Sesuaikan dengan struktur folder dan file yang benar
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

// State untuk menyimpan data inventaris
const inventarisList = ref([]);
const cabangList = ref([]);
const currentInventarisId = ref(null);
const searchQuery = ref('');
const tempSearchQuery = ref('');

// State untuk mengontrol modal tambah
const showAddModal = ref(false);
const showEditModal = ref(false);

// Form data untuk tambah inventaris
const addFormData = ref({
  id_inventaris: '',
  nopol: '',
  merek: '',
  kategori: '',
  tahun: '',
  pajak: '',
  masa_pajak: '',
  harga_beli: '',
  tanggal_beli: '',
  cabang: '',
});

const editFormData = ref({
  id_inventaris: '',
  nopol: '',
  merek: '',
  kategori: '',
  tahun: '',
  pajak: '',
  masa_pajak: '',
  harga_beli: '',
  tanggal_beli: '',
  cabang: '',
});

// Ambil data inventaris dari API
const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/inventaris');
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
      id_inventaris: '',
      nopol: '',
      merek: '',
      kategori: '',
      tahun: '',
      pajak: '',
      masa_pajak: '',
      harga_beli: '',
      tanggal_beli: '',
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
      id_inventaris: '',
      nopol: '',
      merek: '',
      kategori: '',
      tahun: '',
      pajak: '',
      masa_pajak: '',
      harga_beli: '',
      tanggal_beli: '',
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

const deleteInventaris = async (id_inventaris) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/inventaris/${id_inventaris}`);
      inventaris.value = inventaris.value.filter(inventaris => inventaris.id_inventaris !== id_inventaris);
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

// Jalankan hook "onMounted"
onMounted(() => {
  fetchDataInventaris();
  fetchDataCabang();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>INVENTARIS</h2>
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
                    <th scope="col">ID INVENTARIS</th>
                    <th scope="col">NOPOL</th>
                    <th scope="col">MEREK</th>
                    <th scope="col">KATEGORI</th>
                    <th scope="col">TAHUN</th>
                    <th scope="col">PAJAK</th>
                    <th scope="col">MASA PAJAK</th>
                    <th scope="col">HARGA BELI</th>
                    <th scope="col">TANGGAL BELI</th>
                    <th scope="col">CABANG</th>
                    <th scope="col">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredInventaris.length === 0">
                    <td colspan="10" class="text-center">
                      <div class="alert alert-danger mb-0">
                        Data Belum Tersedia!
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(inventaris, index) in filteredInventaris" :key="index">
                    <td class="text-center">{{ inventaris.id_inventaris }}</td>
                    <td>{{ inventaris.nopol }}</td>
                    <td>{{ inventaris.merek }}</td>
                    <td>{{ inventaris.kategori }}</td>
                    <td>{{ inventaris.tahun }}</td>
                    <td>{{ inventaris.pajak }}</td>
                    <td>{{ inventaris.masa_pajak }}</td>
                    <td>{{ inventaris.harga_beli }}</td>
                    <td>{{ inventaris.tanggal_beli }}</td>
                    <td>{{ getNamaCabang(inventaris.cabang) }}</td>
                    <td class="text-center">
                        <button @click="editInventaris(inventaris)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                        <button @click="deleteInventaris(inventaris.id_inventaris)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

  <!-- Modal untuk menambah inventaris baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH INVENTARIS</h4>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="id_inventaris">ID Inventaris</label>
          <input type="text" id="id_inventaris" v-model="addFormData.id_inventaris" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="nopol">Nopol</label>
          <input type="text" id="nopol" v-model="addFormData.nopol" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="merek">Merek</label>
          <input type="text" id="merek" v-model="addFormData.merek" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="kategori">Kategori</label>
          <input type="text" id="kategori" v-model="addFormData.kategori" />
          <!-- <select id="kategori" v-model="addFormData.kategori">
            <option v-for="k in kategoriList" :value="k.id_kategori" :key="k.id_kategori">{{ k.nama_kategori }}</option>
          </select> -->
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tahun">Tahun</label>
          <input type="text" id="tahun" v-model="addFormData.tahun" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="pajak">Pajak</label>
          <input type="text" id="pajak" v-model="addFormData.pajak" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="masa_pajak">Masa Pajak</label>
          <input type="date" id="masa_pajak" v-model="addFormData.masa_pajak" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="harga_beli">Harga Beli</label>
          <input type="text" id="harga_beli" v-model="addFormData.harga_beli" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tanggal_beli">Tanggal Beli</label>
          <input type="date" id="tanggal_beli" v-model="addFormData.tanggal_beli" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="cabang">Cabang</label>
          <select id="cabang" v-model="addFormData.cabang">
            <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveNewInventaris">Simpan Perubahan</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- modal edit -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH INVENTARIS</h4>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="id_inventaris">ID Inventaris</label>
          <input type="text" id="id_inventaris" v-model="editFormData.id_inventaris" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="nopol">Nopol</label>
          <input type="text" id="nopol" v-model="editFormData.nopol" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="merek">Merek</label>
          <input type="text" id="merek" v-model="editFormData.merek" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="kategori">Kategori</label>
          <input type="text" id="kategori" v-model="editFormData.kategori" />
          <!-- <select id="kategori" v-model="editFormData.kategori">
            <option v-for="k in kategoriList" :value="k.id_kategori" :key="k.id_kategori">{{ k.nama_kategori }}</option>
          </select> -->
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tahun">Tahun</label>
          <input type="text" id="tahun" v-model="editFormData.tahun" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="pajak">Pajak</label>
          <input type="text" id="pajak" v-model="editFormData.pajak" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="masa_pajak">Masa Pajak</label>
          <input type="date" id="masa_pajak" v-model="editFormData.masa_pajak" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="harga_beli">Harga Beli</label>
          <input type="text" id="harga_beli" v-model="editFormData.harga_beli" />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tanggal_beli">Tanggal Beli</label>
          <input type="date" id="tanggal_beli" v-model="editFormData.tanggal_beli" />
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="cabang">Cabang</label>
          <select id="cabang" v-model="editFormData.cabang">
            <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveEditPegawai">Simpan Perubahan</button>
        <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
