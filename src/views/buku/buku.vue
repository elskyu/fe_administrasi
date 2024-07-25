<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';
import SearchIcon from '/src/style/SearchIcon.vue';

const bukuTamu = ref([]);
const pegawaiList = ref([]);
const cabangList = ref([]);
const departementList = ref([]);
const searchQuery = ref('');
const cabangFilter = ref('');
const departemenFilter = ref('');
const showAddModal = ref(false);

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

const fetchDataBukuTamu = async () => {
  try {
    const response = await api.get('/api/tamu');
    console.log(response);
    bukuTamu.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching buku tamu:', error);
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

const filteredBukuTamu = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const cabang = cabangFilter.value;
  const departemen = departemenFilter.value;

  let filtered = bukuTamu.value;

  if (query) {
    filtered = filtered.filter(tamu =>
      tamu.nama.toLowerCase().includes(query) ||
      tamu.jabatan.toLowerCase().includes(query) ||
      tamu.no_hp.toLowerCase().includes(query) ||
      tamu.departement_dikunjungi.toLowerCase().includes(query) ||
      tamu.org_dikunjungi.toLowerCase().includes(query) ||
      tamu.keperluan.toLowerCase().includes(query) ||
      getNamaCabang(tamu.cabang).toLowerCase().includes(query)
    );
  }

  if (cabang) {
    filtered = filtered.filter(tamu => tamu.cabang === cabang);
  }

  if (departemen) {
    filtered = filtered.filter(tamu => tamu.departement_dikunjungi === departemen);
  }

  return filtered;
});

const saveNewTamu = async () => {
  try {
    await api.post('/api/tamu', addFormData.value);
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
    showAddModal.value = false;
    fetchDataBukuTamu();
    generateNewBtId();
  } catch (error) {
    console.error('Error saving new tamu:', error);
  }
};

const fetchDataPegawai = async () => {
  try {
    const response = await api.get('/api/pegawai');
    pegawaiList.value = response.data.data.data;
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

const generateNewBtId = async () => {
  try {
    const response = await api.get('/api/tamuall');
    const bukuTamu = response.data.data;

    if (bukuTamu.length === 0) {
      addFormData.value.id_tamu = "TM001";
    } else {
      const existingIds = bukuTamu.map(bt => parseInt(bt.id_tamu.slice(3)));
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

      addFormData.value.id_tamu = `TM${String(newId).padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating new Tamu ID:', error);
  }
};

onMounted(() => {
  generateNewBtId();
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
                    <select id="departemenFilter" v-model="departemenFilter" class="form-cari" style="margin-right: 10px; width: 190px;">
                      <option value="">Semua Departemen</option>
                      <option v-for="dep in departementList" :value="dep.id_departement" :key="dep.id_departement">{{ dep.nama_departement }}</option>
                    </select>
                    <select id="cabangFilter" v-model="cabangFilter" class="form-cari" style="margin-right: 10px; width: 155px;">
                      <option value="">Semua Cabang</option>
                      <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
                    </select>
                    <div class="search-container" style="margin-right: -10px; width: 275px;">
                      <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari tamu" style="width: 100%; padding-right: 40px;" />
                      <SearchIcon class="search-icon" />
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
