<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import '/src/style/surat_masuk.css';
import '/src/style/loading.css';
import '/src/style/kalender_jadwal.css';
import Swal from 'sweetalert2';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';

const showProfileModal = ref(false);
const isLoading = ref(true);
const surat = ref([]);
const nomor_surat = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const showEditModalNomor = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const showFormatModal = ref(false);

const addFormData = ref({
  kode_surat: '',
  jenis_surat: '',
  prefix_surat: '',
});

const editFormData = ref({
  kode_surat: '',
  jenis_surat: '',
  prefix_surat: '',
});

const editFormDatanomor = ref({
  format: '',
});



const currentSuratId = ref(null);
const currentNomorId = ref(null);

const changePage = async (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await fetchDataSurat(page);
  }
};

const fetchDataSurat = async (page = 1) => {
  try {
    let url = `/api/surat?page=${currentPage.value}`;

    if (searchQuery.value) {
      url += `&keyword=${encodeURIComponent(searchQuery.value)}`;
    }

    const response = await api.get(url);

    surat.value = response.data.data.data;
    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching surat:', error);
  }
};

const fetchDataNomor = async () => {
  try {
    let url = `/api/nomor`;

    const response = await api.get(url);

    nomor_surat.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching nomor surat:', error);
  }
};

const editSurat = (s) => {
  currentSuratId.value = s.kode_surat;
  editFormData.value = { ...s };
  showEditModal.value = true;
};

const editNomor = (n) => {
  currentNomorId.value = n.id;
  editFormDatanomor.value = { ...n };
  showEditModalNomor.value = true;
};

const deleteSurat = async (kode_surat) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: 'Apakah Anda yakin ingin menghapus data ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/surat/${kode_surat}`);
      Swal.fire({
        title: 'Dihapus!',
        text: 'Data surat berhasil dihapus.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      surat.value = surat.value.filter(s => s.kode_surat !== kode_surat);
    } catch (error) {
      console.error('Error deleting surat:', error);
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat menghapus data.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
};

const saveNewSurat = async () => {
  try {
    if (!addFormData.value.kode_surat || 
        !addFormData.value.jenis_surat || 
        !addFormData.value.prefix_surat) {
      Swal.fire({
        title: 'Form tidak lengkap',
        text: 'Harap isi semua field yang diperlukan.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    await api.post('/api/surat', addFormData.value);

    Swal.fire({
      title: 'Berhasil!',
      text: 'Data surat berhasil disimpan.',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    addFormData.value = { kode_surat: '', jenis_surat: '' };
    showAddModal.value = false;
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving new surat:', error);
    Swal.fire({
      title: 'Error',
      text: 'Terjadi kesalahan saat menyimpan data.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

const saveEditSurat = async () => {
  try {
    if (!editFormData.value.kode_surat || 
       !editFormData.value.jenis_surat || 
       !editFormData.value.prefix_surat) {
      Swal.fire({
        title: 'Form tidak lengkap',
        text: 'Harap isi semua field yang diperlukan.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    await api.put(`/api/surat/${currentSuratId.value}`, editFormData.value);
    Swal.fire({
      title: 'Berhasil!',
      text: 'Data surat berhasil diperbarui.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    editFormData.value = { kode_surat: '', jenis_surat: '', prefix_surat: '' };
    showEditModal.value = false;
    fetchDataSurat();
  } catch (error) {
    console.error('Error saving edit surat:', error);
    Swal.fire({
      title: 'Error',
      text: 'Terjadi kesalahan saat memperbarui data.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

const saveEditNomor = async () => {
  try {
    if (!editFormDatanomor.value.format) {
      Swal.fire({
        title: 'Form tidak lengkap',
        text: 'Harap isi semua field yang diperlukan.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    await api.put(`/api/nomor/${currentNomorId.value}`, editFormDatanomor.value);
    Swal.fire({
      title: 'Berhasil!',
      text: 'Formula nomor surat berhasil diperbarui.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    editFormDatanomor.value = { format: ''};
    showEditModalNomor.value = false;
    fetchDataNomor();
  } catch (error) {
    console.error('Error saving edit nomor surat:', error);
    Swal.fire({
      title: 'Error',
      text: 'Terjadi kesalahan saat memperbarui formula nomor surat.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};


watch(searchQuery, async () => {
  await fetchDataSurat();
});

onMounted(async () => {
  fetchDataNomor();
  await fetchDataSurat();
  isLoading.value = false;
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Surat</h2>
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
                    <button style="margin-right: 10px;" @click="showFormatModal = true"
                      class="btn btn-md btn-success border-0">Format</button>

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
                      <th scope="col" style="width:10%">Kode Surat</th>
                      <th scope="col" style="width:10%">Jenis Surat</th>
                      <th scope="col" style="width:10%">Prefix Surat</th>
                      <th scope="col" style="width:3%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="surat.length === 0">
                      <td colspan="4" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in surat" :key="index">
                      <td class="text-center">{{ s.kode_surat }}</td>
                      <td>{{ s.jenis_surat }}</td>
                      <td>{{ s.prefix_surat }}</td>
                      <td class="text-center">
                        <button @click="editSurat(s)" class="btn btn-sm btn-warning border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deleteSurat(s.kode_surat)" class="btn btn-sm btn-danger border-0"
                          style="margin-right: 7px;">Hapus</button>
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
      <!-- Modal for Profile -->
      <ProfileModal v-if="showProfileModal" />
    </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <Loading /> <!-- Menampilkan komponen loading -->
  </div>

  <!-- Modal for adding new surat -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Surat</h4>
      <div class="form-group">
        <label for="kode_surat">Kode Surat</label>
        <input type="text" id="kode_surat" v-model="addFormData.kode_surat" />
      </div>
      <div class="form-group">
        <label for="jenis_surat">Jenis Surat</label>
        <input type="text" id="jenis_surat" v-model="addFormData.jenis_surat" />
      </div>
      <div class="form-group">
        <label for="prefix_surat">Prefix Surat</label>
        <input type="text" id="prefix_surat" v-model="addFormData.prefix_surat" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSurat">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal for editing surat -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Surat</h4>
      <div class="form-group">
        <label for="kode_surat">Kode Surat</label>
        <input type="text" id="kode_surat" v-model="editFormData.kode_surat" />
      </div>
      <div class="form-group">
        <label for="jenis_surat">Jenis Surat</label>
        <input type="text" id="jenis_surat" v-model="editFormData.jenis_surat" />
      </div>
      <div class="form-group">
        <label for="prefix_surat">Prefix Surat</label>
        <input type="text" id="prefix_surat" v-model="editFormData.prefix_surat" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditSurat">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal Format -->
  <div v-if="showFormatModal" class="modal-overlay" @click.self="showFormatModal = false">
    <div class="modal-content-kalendar">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Formula Nomor</h4>
      <table class="table table-bordered" style="margin-top: 30px;">
        <thead class="bg-dark text-white text-center">
          <tr>
            <th scope="col" style="width:15%">Format Surat</th>
            <th scope="col" style="width:3%">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="nomor_surat.length === 0">
            <td colspan="3" class="text-center">
              <div class="alert alert-danger mb-0">
                Data Belum Tersedia!
              </div>
            </td>
          </tr>
          <tr v-else v-for="(n, index) in nomor_surat" :key="index">
            <td class="text-center">{{ n.format }}</td>
            <td class="text-center">
              <button @click="editNomor(n)" class="btn btn-sm btn-warning border-0"
                style="margin-right: 7px;">Ubah</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="deskripsi">
        <span style="font-weight: 1000;">Keterangan</span><br>
        <span style="font-weight: 500;">{kode_surat}</span> : Kode surat berdasarkan jenis surat yang dipilih<br>
        <span style="font-weight: 500;">{prefix_surat}</span> : Prefix surat berdasarkan jenis surat yang dipilih<br>
        <span style="font-weight: 500;">{id_departement}</span> : ID departement berdasarkan departement yang dipilih<br>
        <span style="font-weight: 500;">{nomor}</span> : Nomor urut surat<br>
        <span style="font-weight: 500;">{bulan}</span> : Bulan surat<br>
        <span style="font-weight: 500;">{tahun}</span> : Tahun surat
      </p>   
    </div>
  </div>

  <!-- Modal for nomor surat -->
  <div v-if="showEditModalNomor" class="modal-overlay" @click.self="showEditModalNomor = false">
    <div class="modal-content-kalendar">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Formula Nomor</h4>

      <div class="form-group">
        <label for="format">Format</label>
        <input type="text" id="format" v-model="editFormDatanomor.format" />
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditNomor">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModalNomor = false">Batal</button>
      </div>
    </div>
  </div>
</template>
