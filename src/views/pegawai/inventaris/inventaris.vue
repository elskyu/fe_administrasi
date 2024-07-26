<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const inventarisList = ref([]);
const cabangList = ref([]);
const currentInventarisId = ref(null);
const searchQuery = ref('');
const kategoriFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

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

const fetchDataInventaris = async () => {
  try {
    const response = await api.get('/api/ip');
    console.log(response);
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching inventaris:', error);
  }
};

const fetchDataCabang = async () => {
  try {
    const response = await api.get('/api/cp');
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
    filtered = filtered.filter(i =>
      i.nopol.toLowerCase().includes(query) ||
      i.merek.toLowerCase().includes(query) ||
      i.kategori.toLowerCase().includes(query) ||
      i.tahun.toLowerCase().includes(query) ||
      i.pajak.toLowerCase().includes(query) ||
      i.masa_pajak.toLowerCase().includes(query) ||
      i.harga_beli.toLowerCase().includes(query) ||
      i.tanggal_beli.toLowerCase().includes(query)
    );
  }

  if (kategori) {
    filtered = filtered.filter(inventaris => inventaris.kategori === kategori);
  }

  return filtered;
});

const saveNewInventaris = async () => {
  try {
    await api.post('/api/ip', addFormData.value);
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

const saveEditPegawai = async () => {
  try {
    await api.put(`/api/ip/${currentInventarisId.value}`, editFormData.value);
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
      await api.delete(`/api/ip/${id_inventaris}`);
      inventaris.value = inventaris.value.filter(inventaris => inventaris.id_inventaris !== id_inventaris);
      generateNewInvId();
      fetchDataInventaris();
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

const generateNewInvId = async () => {
  try {
    const response = await api.get('/api/ip');
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

onMounted(() => {
  generateNewInvId();
  generateNewInvId();
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
                </div>
                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="kategoriFilter" v-model="kategoriFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                      <option value="">Mobil/Motor</option>
                      <option value="Mobil">Mobil</option>
                      <option value="Motor">Motor</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari inventaris" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
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
                    <td class="text-center">{{ inventaris.id_inventaris }}</td>
                    <td>{{ inventaris.nopol }}</td>
                    <td>{{ inventaris.merek }}</td>
                    <td>{{ inventaris.kategori }}</td>
                    <td>{{ inventaris.tahun }}</td>
                    <td>{{ inventaris.pajak }}</td>
                    <td>{{ inventaris.masa_pajak }}</td>
                    <td>{{ inventaris.harga_beli }}</td>
                    <td>{{ inventaris.tanggal_beli }}</td>
                    <td class="text-center">
                        <router-link :to="{ name: 'inventaris_pegawai.lihat_inventaris', params: { id: inventaris.id_inventaris } }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2 custom-button">Lihatttt</router-link>
                        <button @click="editInventaris(inventaris)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">Lihat</button>
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
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewInventaris">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- modal edit -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">DETAIL INVENTARIS</h4>
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
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditPegawai">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
