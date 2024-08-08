<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/surat_masuk.css';
import '/src/style/modal.css';
import '/src/style/loading.css';
import SearchIcon from '/src/style/SearchIcon.vue';
import Loading from '/src/style/loading.vue';
import logo23 from '/src/style/logo2.vue';
import defaultImage from '/src/images/potoprofil.png';


const isLoading = ref(true);
const pegawai = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const currentPegawaiId = ref(null);
const searchQuery = ref('');
const cabangFilter = ref('');
const departementFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const currentPage = ref(1); // State untuk paginasi
const itemsPerPage = ref(5); // Tetap simpan ini untuk backend pagination
const totalPages = ref(1); // Total pages dari backend
const lastpage = ref('');

const showProfileModal = ref(false);

const addFormData = ref({
  id_pegawai: '',
  nip: '',
  nama: '',
  email: '',
  password: '',
  departement: '',
  alamat: '',
  no_hp: '',
  cabang: '',
  foto: '',
  jenkel: '',
  status: '',
});

const editFormData = ref({
  id_pegawai: '',
  nip: '',
  nama: '',
  email: '',
  password: '',
  departement: '',
  alamat: '',
  no_hp: '',
  cabang: '',
  foto: '',
  jenkel: '',
  status: '',
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
  console.log("s", page);
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await fetchDataPegawai(page); // Fetch data for the new page
  }
};


const fetchDataPegawai = async () => {
  try {
    let url = `/api/pegawai?page=${currentPage.value}&keyword=${encodeURIComponent(searchQuery.value)}`;

    if (departementFilter.value) {
      url += `&departement?=${encodeURIComponent(departementFilter.value)}`;
    }

    if (cabangFilter.value) {
      url += `&cabang?=${encodeURIComponent(cabangFilter.value)}`;
    }

    const response = await api.get(url);

    pegawai.value = response.data.data.data.map(pegawai => {
      return {
        ...pegawai,
        foto: pegawai.foto // Pastikan URL gambar sudah lengkap dari backend
      };
    });

    currentPage.value = response.data.data.current_page;
    totalPages.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching pegawai:', error);
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

const editPegawai = (p) => {
  currentPegawaiId.value = p.id_pegawai;
  editFormData.value = {
    id_pegawai: p.id_pegawai,
    nip: p.nip,
    nama: p.nama,
    email: p.email,
    password: '',
    departement: p.departement,
    alamat: p.alamat,
    no_hp: p.no_hp,
    cabang: p.cabang,
    foto: p.foto,
    jenkel: p.jenkel,
    status: p.status,
  };
  showEditModal.value = true;
};

const deletePegawai = async (id_pegawai) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/pegawai/${id_pegawai}`);
      pegawai.value = pegawai.value.filter(p => p.id_pegawai !== id_pegawai);
      generateNewPegawaiId();
      fetchDataPegawai();
    } catch (error) {
      console.error('Error deleting pegawai:', error);
    }
  }
};

const saveNewPegawai = async () => {
  try {
    // Memeriksa apakah cabang telah dipilih
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }

    // Membuat instance FormData
    const formData = new FormData();
    Object.keys(addFormData.value).forEach(key => {
      formData.append(key, addFormData.value[key]);
    });

    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    } else {
      // Menggunakan gambar default dari folder images
      const defaultFile = await fetch(defaultImage)
        .then(res => res.blob())
        .then(blob => new File([blob], "potoprofil.png", { type: "image/png" }));
      formData.append('foto', defaultFile);
    }

    // Mengirim data menggunakan FormData
    await api.post('/api/pegawai', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form data setelah berhasil
    addFormData.value = {
      id_pegawai: '',
      nip: '',
      nama: '',
      email: '',
      password: '',
      departement: '',
      alamat: '',
      no_hp: '',
      cabang: '',
      foto: '',
      jenkel: '',
      status: ''
    };

    // Menutup modal dan memperbarui daftar pegawai
    showAddModal.value = false;
    addFotoFile.value = null; // Reset file foto jika ada
    fetchDataPegawai();
    generateNewPegawaiId();
  } catch (error) {
    console.error('Error saving new pegawai:', error);
  }
};

const saveEditPegawai = async () => {
  try {
    // Membuat instance FormData
    const formData = new FormData();
    Object.keys(editFormData.value).forEach(key => {
      formData.append(key, editFormData.value[key]);
    });

    // Menambahkan foto jika ada
    if (addFotoFile.value) {
      formData.append('foto', addFotoFile.value);
    }

    // Menambahkan _method untuk menyimulasikan metode PUT
    formData.append('_method', 'PUT');

    // Mengirim data menggunakan FormData
    await api.post(`/api/pegawai/${currentPegawaiId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(editFormData.value);

    // Reset form data setelah berhasil
    editFormData.value = {
      id_pegawai: '',
      nip: '',
      nama: '',
      email: '',
      password: '',
      departement: '',
      alamat: '',
      no_hp: '',
      cabang: '',
      foto: '',
      jenkel: '',
      status: ''
    };

    // Menutup modal dan memperbarui daftar pegawai
    showEditModal.value = false;
    addFotoFile.value = null; // Reset file foto jika ada
    fetchDataPegawai();
    generateNewPegawaiId();
  } catch (error) {
    console.error('Error saving edit pegawai:', error);
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

const generateNewPegawaiId = async () => {
  try {
    const response = await api.get('/api/pegawaiall');
    const pegawai = response.data.data;

    if (pegawai.length === 0) {
      addFormData.value.id_pegawai = "PEG001";
    } else {
      const existingIds = pegawai.map(p => parseInt(p.id_pegawai.slice(3)));
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
      addFormData.value.id_pegawai = `PEG${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Pegawai ID:', error);
  }
};

const formattedFotoUrl = (foto) => {
  if (!foto) {
    return 'https://bootdey.com/img/Content/avatar/avatar7.png'; // URL default jika foto kosong
  }
  return foto.startsWith('http') ? foto : `${baseUrl}${foto}`;
};

watch([cabangFilter, departementFilter, searchQuery, currentPage], async () => {
  changePage();
  await fetchDataPegawai();
});

onMounted(async () => {
  fetchDataDepartement();
  fetchDataCabang();
  await fetchDataPegawai();
  await generateNewPegawaiId();
  isLoading.value = false;
});
</script>


<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>Pegawai</h2>
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
                    <select id="departemenFilter" v-model="departementFilter" class="form-cari"
                      style="margin-right: 10px; width: 190px;">
                      <option value="">Semua Departement</option>
                      <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{
                        dep.nama_departement }}</option>
                    </select>
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari"
                      style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}
                      </option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari pegawai"
                        style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:8%">ID Pegawai</th>
                      <th scope="col" style="width:8%">NIP</th>
                      <th scope="col" style="width:10%">Nama</th>
                      <th scope="col" style="width:15%">Jenis Kelamin</th>
                      <th scope="col" style="width:15%">Email</th>
                      <th scope="col" style="width:10%">Departemen</th>
                      <th scope="col" style="width:10%">Alamat</th>
                      <th scope="col" style="width:10%">No HP</th>
                      <th scope="col" style="width:7%">Cabang</th>
                      <th scope="col" style="width:15%">Status</th>
                      <th scope="col" style="width:15%">Foto</th>
                      <th scope="col" style="width:11%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="pegawai.length === 0">
                      <td colspan="15" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <!-- <tr v-else-if="pegawai.length === 0">
                      <td colspan="9" class="text-center">
                        <div class="alert alert-warning mb-0">
                          Data Tidak Ditemukan!
                        </div>
                      </td>
                    </tr> -->
                    <tr v-else v-for="(p, index) in pegawai" :key="index">
                      <td class="text-center">{{ p.id_pegawai }}</td>
                      <td>{{ p.nip }}</td>
                      <td>{{ p.nama }}</td>
                      <td>{{ p.jenkel }}</td>
                      <td>{{ p.email }}</td>
                      <td>{{ getNamaDepartemen(p.departement) }}</td>
                      <td>{{ p.alamat }}</td>
                      <td>{{ p.no_hp }}</td>
                      <td>{{ getNamaCabang(p.cabang) }}</td> <!-- Menampilkan nama cabang -->
                      <td>{{ p.status }}</td>
                      <td><img :src="formattedFotoUrl(p.foto)" alt="Foto Pegawai" width="70" class="rounded-3" /></td>
                      <td class="text-center">
                        <button @click="editPegawai(p)" class="btn btn-sm btn-warning  border-0"
                          style="margin-right: 7px;">Ubah</button>
                        <button @click="deletePegawai(p.id_pegawai)" class="btn btn-sm btn-danger border-0"
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
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <Loading /> <!-- Menampilkan komponen loading -->
    </div>

    <!-- Modal for adding new pegawai -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Tambah Data Pegawai</h4>
        <div class="form-group-row">
          <div class="form-group" style="width: 175px;">
            <label for="id_pegawai">ID Pegawai</label>
            <input type="text" id="id_pegawai" v-model="addFormData.id_pegawai" />
          </div>
          <div class="form-group" style="width: 220px;">
            <label for="nip">NIP</label>
            <input type="text" id="nip" v-model="addFormData.nip" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 155px;">
            <label for="nama">Nama</label>
            <input type="text" id="nama" v-model="addFormData.nama" />
          </div>
          <div class="form-group" style="width: 240px;">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="addFormData.email" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 195px;">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="addFormData.password" />
          </div>
          <div class="form-group" style="width: 200px;">
            <label for="no_hp">No HP</label>
            <input type="text" id="no_hp" v-model="addFormData.no_hp" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 130px;">
            <label for="departement">Departement</label>
            <select id="departement" v-model="addFormData.departement">
              <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{
                dep.nama_departement }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 130px;">
            <label for="cabang">Cabang</label>
            <select id="cabang" v-model="addFormData.cabang">
              <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 130px;">
            <label for="status">Status</label>
            <select id="status" v-model="addFormData.status">s
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Non Aktif</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="addFormData.alamat" />
        </div>
        <div class="form-group-row">
          <div style="width: 190px;">
            <label for="jenkel">Jenis Kelamin</label>
            <div style="margin-bottom: 10px; margin-top: 5px;">
              <div>
                <input type="radio" id="laki-laki" value="laki-laki" v-model="addFormData.jenkel" />
                <label for="laki-laki" style="margin-left: 5px;">Laki-laki</label>
              </div>
              <div>
                <input type="radio" id="perempuan" value="Perempuan" v-model="addFormData.jenkel" />
                <label style="margin-left: 5px;" for="perempuan">Perempuan</label>
              </div>
            </div>
          </div>
          <div style="width: 185px; margin: 0px 10px 20px 0px;">
            <label for="foto">Upload Foto Anda</label>
            <input type="file" @change="handleFileChange" class="form-control">
          </div>
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewPegawai">Simpan Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Modal for editing pegawai -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">Ubah Data Pegawai</h4>
        <div class="form-group-row">
          <div class="form-group" style="width: 175px;">
            <label for="id_pegawai">ID Pegawai</label>
            <input type="text" id="id_pegawai" v-model="editFormData.id_pegawai" />
          </div>
          <div class="form-group" style="width: 220px;">
            <label for="nip">NIP</label>
            <input type="text" id="nip" v-model="editFormData.nip" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 155px;">
            <label for="nama">Nama</label>
            <input type="text" id="nama" v-model="editFormData.nama" />
          </div>
          <div class="form-group" style="width: 240px;">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="editFormData.email" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 195px;">
            <label for="password">Password</label>
            <input placeholder="ubah password" type="text" id="password" v-model="editFormData.password" />
          </div>
          <div class="form-group" style="width: 200px;">
            <label for="no_hp">No HP</label>
            <input type="text" id="no_hp" v-model="editFormData.no_hp" />
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 130px;">
            <label for="departement">Departement</label>
            <select id="departement" v-model="editFormData.departement">
              <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{
                dep.nama_departement }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 130px;">
            <label for="cabang">Cabang</label>
            <select id="cabang" v-model="editFormData.cabang">
              <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 130px;">
            <label for="status">Status</label>
            <select id="status" v-model="editFormData.status">s
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Non Aktif</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="editFormData.alamat" />
        </div>
        <div class="form-group-row">
          <div style="width: 190px;">
            <label for="jenkel">Jenis Kelamin</label>
            <div style="margin-bottom: 10px; margin-top: 5px;">
              <div>
                <input type="radio" id="laki-laki" value="laki-laki" v-model="editFormData.jenkel" />
                <label for="laki-laki" style="margin-left: 5px;">Laki-laki</label>
              </div>
              <div>
                <input type="radio" id="perempuan" value="Perempuan" v-model="editFormData.jenkel" />
                <label style="margin-left: 5px;" for="perempuan">Perempuan</label>
              </div>
            </div>
          </div>
          <div style="width: 185px; margin: 0px 10px 20px 0px;">
            <label for="foto">Upload Foto Anda</label>
            <input type="file" @change="handleFileChange" class="form-control">
          </div>
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditPegawai">Simpan Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>
