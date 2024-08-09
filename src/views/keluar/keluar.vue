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
import logo23 from '/src/style/logo2.vue';

const suratKeluar = ref([]);
const cabangList = ref([]);
const kodeSuratList = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const cabangFilter = ref('');
const isLoading = ref(true);
const currentPage = ref(1); 
const itemsPerPage = ref(5); 
const totalPages = ref(1); 
const departementList = ref([]);

const addFormData = ref({
  id_surat_keluar: '',
  nomor_surat: '',
  tanggal_surat: '',
  tanggal_kirim: '',
  tujuan_surat: '',
  perihal: '',
  cabang: '',
  kode_surat: '',
});

const nomordataset = ref({
  kode_surat: '',
  departement: '',
});

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataSuratKeluar(); // Fetch data for the new page
  }
};

const fetchDataSuratKeluar = async () => {
  try {
    let url = `/api/sk?page=${currentPage.value}`;

    if (cabangFilter.value) {
      url += `&cabang?=${encodeURIComponent(cabangFilter.value)}`;
    }

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    suratKeluar.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching surat keluar:', error);
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

const fetchDataDepartement = async () => {
  try {
    const response = await api.get('/api/departement');
    departementList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching departement list:', error);
  }
};

const getNamaDepartement = (idDepartemen) => {
  const departement = departementList.value.find(d => d.id_departement === idDepartemen);
  return departement ? departement.nama_departement : '';
};

const fetchDataKodeSurat = async () => {
  try {
    const response = await api.get('/api/surat');
    kodeSuratList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching kode surat list:', error);
  }
};

const saveNewSuratKeluar = async () => {
  try {
    addFormData.value.nomor_surat = await generateNewNomorSurat();
    await api.post('/api/sk', addFormData.value);
    addFormData.value = {
      id_surat_keluar: '',
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      tujuan_surat: '',
      perihal: '',
      cabang: '',
      kode_surat: '',
    };
    fetchDataSuratKeluar();
    showAddModal.value = false;
    generateNewSkId();
  } catch (error) {
    console.error('Error saving new surat keluar:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const generateNewNomorSurat = async () => {
  try {
    const monthNames = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const currentMonth = monthNames[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const selectedKodeSurat = nomordataset.value.kode_surat;
    const selectedDepartement = nomordataset.value.departement;
    const selectedCabang = addFormData.value.cabang;

    const prefixResponse = await api.get(`/api/surat/${selectedKodeSurat}`);
    const fetchprefix = prefixResponse.data.data.prefix_surat;
    const templateprefix = fetchprefix;

    const templateResponse = await api.get(`/api/nomor`);
    const fetchnomor = templateResponse.data.data.data[0].format;
    const template = fetchnomor;

    const response = await api.get(`/api/sk?cabang=${selectedCabang}&kode_surat=${selectedKodeSurat}`);
    const suratList = response.data.data.data;

    let newNumber = 1;
    if (suratList.length > 0) {
      const existingNumbers = suratList.map(s => parseInt(s.nomor_surat.split('.')[1]));
      newNumber = Math.max(...existingNumbers) + 1;
    }
    const formattedNumber = String(newNumber).padStart(3, '0');

    const replacePlaceholders = (template, replacements) => {
      let result = template;
      for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
        result = result.replace(regex, value);
      }
      return result;
    };

    const replacements = {
      kode_surat: selectedKodeSurat,
      nomor: formattedNumber,
      bulan: currentMonth,
      tahun: currentYear,
      prefix_surat: templateprefix,
      id_departement: selectedDepartement,
    };

    const nomorSurat = replacePlaceholders(template, replacements);

    return nomorSurat;

  } catch (error) {
    console.error("Error generating nomor surat:", error);
    return null;
  }
};

const generateNewSkId = async () => {
  try {
    const response = await api.get('/api/skall');
    const suratKeluar = response.data.data;

    if (suratKeluar.length === 0) {
      addFormData.value.id_surat_keluar = "SK001";
    } else {
      const existingIds = suratKeluar.map(sk => parseInt(sk.id_surat_keluar.slice(3)));
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

      addFormData.value.id_surat_keluar = `SK${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Surat Keluar ID:', error);
  }
};

watch([cabangFilter, searchQuery], async () => {
  await fetchDataSuratKeluar();
});

onMounted(async () => {
  fetchDataKodeSurat();
  fetchDataDepartement();
  fetchDataCabang();
  await fetchDataSuratKeluar();
  await generateNewSkId();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Surat Keluar</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <logo23 class="logo" style="margin-bottom: -50px; margin-top: -55px;">Login</logo23>
          </div>
        </div>

        <div class="col-md-12" style="margin-left: -10px; width: auto;">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Tambah</button>
                </div>
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
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari surat"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:13%">ID Surat Keluar</th>
                      <th scope="col" style="width:13%">Nomor Surat</th>
                      <th scope="col" style="width:13%">Tanggal Surat</th>
                      <th scope="col" style="width:13%">Tanggal Kirim</th>
                      <th scope="col" style="width:15%">Tujuan Surat</th>
                      <th scope="col" style="width:15%">Perihal</th>
                      <th scope="col" style="width:20%">Cabang</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="suratKeluar.length === 0">
                      <td colspan="8" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in suratKeluar" :key="index">
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

  <!-- Modal untuk menambah surat keluar baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Tambah Data Surat Keluar
      </h4>
      <div class="form-group">
        <label for="id_surat_keluar">ID Surat Keluar</label>
        <input type="text" id="id_surat_keluar" v-model="addFormData.id_surat_keluar" />
      </div>
      <div class="form-group">
        <label for="kode_surat">Jenis Surat</label>
        <select id="kode_surat" v-model="nomordataset.kode_surat">
          <option v-for="k in kodeSuratList" :value="k.kode_surat" :key="k.kode_surat">{{ k.jenis_surat }}</option>
        </select>
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
      <div class="form-group-row">
        <div class="form-group" style="width: 195px;">
          <label for="departement">Departement</label>
          <select id="departement" v-model="nomordataset.departement">
            <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{
              dep.nama_departement }}</option>
          </select>
        </div>
        <div class="form-group" style="width: 195px;">
          <label for="cabang">Cabang</label>
          <select id="cabang" v-model="addFormData.cabang">
            <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSuratKeluar">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
