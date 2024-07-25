<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';
import axios from 'axios';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/surat_masuk.css';
import '/src/style/modal.css';
import '/src/style/surat_masuk.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const userName = ref(''); // Default name

const pegawai = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const currentPegawaiId = ref(null);
const searchQuery = ref('');
const tempSearchQuery = ref('');
const cabangFilter = ref('');
const departemenFilter = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);

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
});

const fetchUserName = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/useradmin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("nama : ",response.data); // Tambahkan log ini
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


const fetchDataPegawai = async () => {
  try {
    const response = await api.get('/api/pegawai');
    pegawai.value = response.data.data.data;
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
    password: p.password,
    departement: p.departement,
    alamat: p.alamat,
    no_hp: p.no_hp,
    cabang: p.cabang,
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

const filteredPegawai = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;
  const departemen = departemenFilter.value;

  let filtered = pegawai.value;

  if (query) {
    filtered = filtered.filter(p =>
      p.nip.toLowerCase().includes(query) ||
      p.nama.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.departement.toLowerCase().includes(query) ||
      p.alamat.toLowerCase().includes(query) ||
      p.no_hp.toLowerCase().includes(query) ||
      getNamaCabang(p.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(tamu => tamu.cabang === cabang);
  }

  if (departemen) {
    filtered = filtered.filter(tamu => tamu.departement === departemen);
  }

  return filtered;
});

const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

const saveNewPegawai = async () => {
  try {
    if (!addFormData.value.cabang) {
      console.error('Cabang harus dipilih');
      return;
    }

    await api.post('/api/pegawai', addFormData.value);
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
    };
    showAddModal.value = false;
    fetchDataPegawai();
    generateNewPegawaiId();
  } catch (error) {
    console.error('Error saving new pegawai:', error);
  }
};

const saveEditPegawai = async () => {
  try {
    await api.put(`/api/pegawai/${currentPegawaiId.value}`, editFormData.value);
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
    };
    showEditModal.value = false;
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

onMounted(async () => {
  generateNewPegawaiId();
  fetchDataPegawai();
  fetchDataCabang();
  fetchDataDepartement();
  await fetchUserName();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="flex-container" style="display: flex; justify-content: space-between;">
          <div class="card2" style="flex: 0 0 81%; margin-right: 10px; margin-left: -10px;">
            <h2>PEGAWAI</h2>
          </div>
          <div class="card-nama" style="flex: 0 0 20%;">
            <div class="form-group-row" style="display: flex; align-items: center; margin-right: 20px;">
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="align-items: center; margin-right: 5px;">
                  <path d="M10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM4.023 13.416C5.491 15.606 7.695 17 10.16 17C12.624 17 14.829 15.607 16.296 13.416C14.6317 11.8606 
                  12.4379 10.9968 10.16 11C7.88171 10.9966 5.68751 11.8604 4.023 13.416V13.416ZM10 9C10.7956 9 11.5587 8.68393 12.1213 8.12132C12.6839 7.55871 13 6.79565 13 6C13 5.20435 12.6839 4.44129 12.1213 
                  3.87868C11.5587 3.31607 10.7956 3 10 3C9.20435 3 8.44129 3.31607 7.87868 3.87868C7.31607 4.44129 7 5.20435 7 6C7 6.79565 7.31607 7.55871 7.87868 8.12132C8.44129 8.68393 9.20435 9 10 9V9Z" fill="#44d569"/>
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
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">TAMBAH</button>
                </div>

                <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                  <div class="d-flex justify-content-end">
                    <select id="departemenFilter" v-model="departemenFilter" class="form-cari" style="margin-right: 10px; width: 190px;">
                      <option value="">Semua Departemen</option>
                      <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{ dep.nama_departement }}</option>
                    </select>
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari pegawai" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
                    </div>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:8%">ID PEGAWAI</th>
                      <th scope="col" style="width:8%">NIP</th>
                      <th scope="col" style="width:10%">NAMA</th>
                      <th scope="col" style="width:15%">Email</th>
                      <th scope="col" style="width:10%">Departemen</th>
                      <th scope="col" style="width:10%">Alamat</th>
                      <th scope="col" style="width:10%">No. HP</th>
                      <th scope="col" style="width:7%">Cabang</th>
                      <th scope="col" style="width:10%">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredPegawai.length === 0">
                      <td colspan="9" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(p, index) in filteredPegawai" :key="index">
                      <td class="text-center">{{ p.id_pegawai }}</td>
                      <td>{{ p.nip }}</td>
                      <td>{{ p.nama }}</td>
                      <td>{{ p.email }}</td>
                      <td>{{ getNamaDepartemen(p.departement) }}</td>
                      <td>{{ p.alamat }}</td>
                      <td>{{ p.no_hp }}</td>
                      <td>{{ getNamaCabang(p.cabang) }}</td> <!-- Menampilkan nama cabang -->
                      <td class="text-center">
                        <button @click="editPegawai(p)" class="btn btn-sm btn-warning rounded-sm shadow border-0" style="margin-right: 7px;">EDIT</button>
                        <button @click="deletePegawai(p.id_pegawai)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
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

    <!-- Modal for adding new pegawai -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH PEGAWAI</h4>
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
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="addFormData.password" />
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 200px;">
            <label for="departement">Departemen</label>
            <select id="departement" v-model="addFormData.departement">
              <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{ dep.nama_departement }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 190px;">
            <label for="cabang">Cabang</label>
            <select id="cabang" v-model="addFormData.cabang">
              <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="addFormData.alamat" />
        </div>
        <div class="form-group">
          <label for="no_hp">No. HP</label>
          <input type="text" id="no_hp" v-model="addFormData.no_hp" />
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
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">EDIT PEGAWAI</h4>
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
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="editFormData.password" />
        </div>
        <div class="form-group-row">
          <div class="form-group" style="width: 200px;">
            <label for="departement">Departemen</label>
            <select id="departement" v-model="editFormData.departement">
              <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{ dep.nama_departement }}</option>
            </select>
          </div>
          <div class="form-group" style="width: 190px;">
            <label for="cabang">Cabang</label>
            <select id="cabang" v-model="editFormData.cabang">
              <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="editFormData.alamat" />
        </div>
        <div class="form-group">
          <label for="no_hp">No. HP</label>
          <input type="text" id="no_hp" v-model="editFormData.no_hp" />
        </div>
        <div class="form-actions">
          <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditPegawai">Update Perubahan</button>
          <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>
