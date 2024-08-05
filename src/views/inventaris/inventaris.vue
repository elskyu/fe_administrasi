<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';


const userName = ref(''); // Default name
const inventarisList = ref([]);
const kategoriFilter = ref('');
const cabangList = ref([]);
const currentInventarisId = ref(null);
const searchQuery = ref('');
const cabangFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(true); // State untuk loading
const currentPage = ref(1); // State untuk paginasi
const totalPages = ref(1); // Total pages dari backend

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

const changePage = async (page) => {
  console.log("s", page);
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await fetchDataInventaris(page); // Fetch data for the new page
  }
};

const fetchUserName = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/useradmin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("nama : ", response.data); // Tambahkan log ini
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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get(`/api/inventaris?page=${currentPage.value}&keyword=${searchQuery.value}&cabang?=${cabangFilter.value}&kategori?=${kategoriFilter.value}`);

    inventarisList.value = response.data.data.data;
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
    cabang: i.cabang,
  };
  showEditModal.value = true;
};

const filteredInventaris = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const kategori = kategoriFilter.value;

  let filtered = inventarisList.value;
  if (query) {
    filtered = filtered.filter(inventaris =>
      inventaris.nopol.toLowerCase().includes(query) ||
      inventaris.merek.toLowerCase().includes(query) ||
      inventaris.kategori.toLowerCase().includes(query) ||
      inventaris.tahun.toString().includes(query) ||
      inventaris.pajak.toString().includes(query) ||
      inventaris.masa_pajak.toString().includes(query) ||
      inventaris.harga_beli.toString().includes(query) ||
      inventaris.tanggal_beli.toLowerCase().includes(query) ||
      getNamaCabang(inventaris.cabang).toLowerCase().includes(query)
    );
  }

  if (kategori) {
    filtered = filtered.filter(inventaris => inventaris.kategori === kategori);
  }

  return filtered;
});


const saveNewInventaris = async () => {
  try {
    await api.post('/api/inventaris', addFormData.value);
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
    showAddModal.value = false;
    fetchDataInventaris();
    generateNewInvId();
  } catch (error) {
    console.error('Error saving new inventaris:', error);
  }
};

const saveEditInventaris = async () => {
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
    generateNewInvId();
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
      inventarisList.value = inventarisList.value.filter(inventaris => inventaris.id_inventaris !== id_inventaris);
      generateNewInvId();
      fetchDataInventaris();
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

const generateNewInvId = async () => {
  try {
    const response = await api.get('/api/inventarisall');
    const inventarisList = response.data.data;

    if (inventarisList.length === 0) {
      addFormData.value.id_surat_masuk = "INV001";
    } else {
      const existingIds = inventarisList.map(inv => parseInt(inv.id_inventaris.slice(3)));
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

      addFormData.value.id_inventaris = `INV${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Inventaris ID:', error);
  }
};

watch([cabangFilter, searchQuery, currentPage, kategoriFilter], async () => {
  await fetchDataInventaris();
});

onMounted(async () => {
  fetchUserName();
  fetchDataCabang();
  await fetchDataInventaris();
  await generateNewInvId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Inventaris</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <div class="form-group-row" style="display: flex; align-items: center; margin-right: 20px;">
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                style="align-items: center; margin-right: 5px;">
                <path
                  d="M10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM4.023 13.416C5.491 15.606 7.695 17 10.16 17C12.624 17 14.829 15.607 16.296 13.416C14.6317 11.8606 
                  12.4379 10.9968 10.16 11C7.88171 10.9966 5.68751 11.8604 4.023 13.416V13.416ZM10 9C10.7956 9 11.5587 8.68393 12.1213 8.12132C12.6839 7.55871 13 6.79565 13 6C13 5.20435 12.6839 4.44129 12.1213 
                  3.87868C11.5587 3.31607 10.7956 3 10 3C9.20435 3 8.44129 3.31607 7.87868 3.87868C7.31607 4.44129 7 5.20435 7 6C7 6.79565 7.31607 7.55871 7.87868 8.12132C8.44129 8.68393 9.20435 9 10 9V9Z"
                  fill="#44d569" />
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
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Tambah</button>
                </div>

                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari"
                      style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
                      </option>
                    </select>
                    <select id="kategoriFilter" v-model="kategoriFilter" class="form-cari"
                      style="margin-right: 10px; width: 170px;">
                      <option value="">Jenis Kendaraan</option>
                      <option value="Mobil">Mobil</option>
                      <option value="Motor">Motor</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari inventaris"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col">ID Inventaris</th>
                      <th scope="col">Nopol</th>
                      <th scope="col">Merek</th>
                      <th scope="col">Kategori</th>
                      <th scope="col">Tahun</th>
                      <th scope="col">Pajak</th>
                      <th scope="col">Masa Pajak</th>
                      <th scope="col">Harga Beli</th>
                      <th scope="col">Tanggal Beli</th>
                      <th scope="col">Cabang</th>
                      <th scope="col">Aksi</th>
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
                        <button @click="editInventaris(inventaris)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteInventaris(inventaris.id_inventaris)"
                          class="btn btn-sm btn-danger border-0" style="margin-right: 7px;">Hapus</button>
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

  <!-- Modal untuk menambah inventaris baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Tambah Data Inventaris</h4>
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
          <select id="kategori" v-model="addFormData.kategori">
            <option value="">Kategori</option>
            <option value="Mobil">Mobil</option>
            <option value="Motor">Motor</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tahun">Tahun</label>
          <input type="number" id="tahun" v-model="addFormData.tahun" />
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
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewInventaris">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- modal edit -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Ubah Data Inventaris</h4>
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
          <select id="kategori" v-model="editFormData.kategori">
            <option value="Mobil">Mobil</option>
            <option value="Motor">Motor</option>
          </select>
          <!-- <select id="kategori" v-model="editFormData.kategori">
            <option v-for="k in kategoriList" :value="k.id_kategori" :key="k.id_kategori">{{ k.nama_kategori }}</option>
          </select> -->
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="tahun">Tahun</label>
          <input type="number" id="tahun" v-model="editFormData.tahun" />
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
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditInventaris">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
