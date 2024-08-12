<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';
import defaultImage from '/src/images/potopesan.png';

const suratMasuk = ref([]);
const cabangList = ref([]);
const searchQuery = ref('');
const cabangFilter = ref('');
const showAddModal = ref(false);
const isLoading = ref(true); // State untuk loading
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Disesuaikan dengan pagination dari backend
const totalPages = ref(1); // Total pages dari backend

const addFormData = ref({
  id_surat_masuk: '',
  nomor_surat: '',
  tanggal_terima: '',
  asal_surat: '',
  perihal: '',
  cabang: '',
  foto: '',
});

const addFotoFile = ref(null);
const editFotoFile = ref(null);

const handleFileChange = (event, isEdit = false) => {
  const file = event.target.files[0];
  if (file) {
    if (isEdit) {
      editFotoFile.value = file;
    } else {
      addFotoFile.value = file;
    }
  }
};

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDataSuratKeluar(); // Fetch data for the new page
  }
};

const fetchDataSuratMasuk = async () => {
  try {
    let url = `/api/sm?page=${currentPage.value}`;

    if (cabangFilter.value) {
      url += `&cabang?=${encodeURIComponent(cabangFilter.value)}`;
    }

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    suratMasuk.value = response.data.data.data.map(suratMasuk => {
      return {
        ...suratMasuk,
        foto: suratMasuk.foto // Pastikan URL gambar sudah lengkap dari backend
      };
    });

    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching surat masuk:', error);
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

const saveNewSuratMasuk = async () => {
  try {
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }

    // Membuat instance FormData
    const formData = new FormData();
    Object.keys(addFormData.value).forEach(key => {
      formData.append(key, addFormData.value[key]);
    });

    // Menambahkan foto jika ada
    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    } else {
      // Menggunakan gambar default dari folder images
      const defaultFile = await fetch(defaultImage)
        .then(res => res.blob())
        .then(blob => new File([blob], "potopesan.png", { type: "image/png" }));
      formData.append('foto', defaultFile);
    }

    // Mengirim data menggunakan FormData
    await api.post('/api/sm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    addFormData.value = {
      id_surat_masuk: '',
      nomor_surat: '',
      tanggal_terima: '',
      asal_surat: '',
      perihal: '',
      cabang: '',
      foto: '',
    };

    showAddModal.value = false;
    addFotoFile.value = null; // Reset file foto jika ada
    fetchDataSuratMasuk();
    generateNewSmId();
  } catch (error) {
    console.error('Error saving new surat masuk:', error);
  }
};

const getNamaCabang = (idCabang) => {
  const cabang = cabangList.value.find(c => c.id_cabang === idCabang);
  return cabang ? cabang.nama_cabang : '';
};

const generateNewSmId = async () => {
  try {
    const response = await api.get('/api/small');
    const suratMasuk = response.data.data;

    if (suratMasuk.length === 0) {
      addFormData.value.id_surat_masuk = "SM001";
    } else {
      const existingIds = suratMasuk.map(sm => parseInt(sm.id_surat_masuk.slice(3)));
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

      addFormData.value.id_surat_masuk = `SM${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Surat Masuk ID:', error);
  }
};

watch([cabangFilter, searchQuery], async () => {
  await fetchDataSuratMasuk();
});

onMounted(async () => {
  fetchDataCabang();
  await fetchDataSuratMasuk();
  await generateNewSmId();
  isLoading.value = false;
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Surat Masuk</h2>
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
                      <th scope="col" style="width:10%">ID Surat Masuk</th>
                      <th scope="col" style="width:15%">Nomor Surat</th>
                      <th scope="col" style="width:15%">Tanggal Terima</th>
                      <th scope="col" style="width:15%">Asal Surat</th>
                      <th scope="col" style="width:15%">Perihal</th>
                      <th scope="col" style="width:10%">Cabang</th>
                      <th scope="col" style="width:10%">Foto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="suratMasuk.length === 0">
                      <td colspan="8" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="suratMasuk.length === 0">
                      <td colspan="9" class="text-center">
                        <div class="alert alert-warning mb-0">
                          Data Tidak Ditemukan!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in suratMasuk" :key="index">
                      <td class="text-center">{{ s.id_surat_masuk }}</td>
                      <td class="text-center">{{ s.nomor_surat }}</td>
                      <td>{{ s.tanggal_terima }}</td>
                      <td>{{ s.asal_surat }}</td>
                      <td>{{ s.perihal }}</td>
                      <td>{{ getNamaCabang(s.cabang) }}</td>
                      <td><img :src="s.foto" width="125" class="rounded-3" /></td>
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

  <!-- Modal untuk menambah surat masuk baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Tambah Data Surat Masuk
      </h4>
      <div class="form-group">
        <label for="id_surat_masuk">ID Surat Masuk</label>
        <input type="text" id="id_surat_masuk" v-model="addFormData.id_surat_masuk" />
      </div>
      <div class="form-group">
        <label for="nomor_surat">Nomor Surat</label>
        <input type="text" id="nomor_surat" v-model="addFormData.nomor_surat" />
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="tanggal_terima" style="width: 195px;">Tanggal Terima</label>
          <input type="date" id="tanggal_terima" v-model="addFormData.tanggal_terima" />
        </div>
        <div class="form-group" style="width: 200px;">
          <label for="cabang">Cabang</label>
          <select id="cabang" v-model="addFormData.cabang">
            <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="asal_surat">Asal Surat</label>
        <input type="text" id="asal_surat" v-model="addFormData.asal_surat" />
      </div>
      <div class="form-group">
        <label for="perihal">Perihal</label>
        <input type="text" id="perihal" v-model="addFormData.perihal" />
      </div>
      <div style=" margin: 0px 10px 20px 0px;">
        <label for="foto">Upload Foto Anda</label>
        <input style="margin-top: 5px;" type="file" @change="handleFileChange" class="form-control">
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSuratMasuk">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
