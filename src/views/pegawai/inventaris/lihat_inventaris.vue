<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import api from '../../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

const inventarisList = ref([]);
const cabangList = ref([]);
const currentInventarisId = ref(null);
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
    const response = await api.get('/api/ip/INV001');
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

onBeforeMount(() => {
  fetchDataInventaris();
});

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
                <div class="card-body">
                  <h3 class="card-title">Detail Inventaris</h3>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">ID Inventaris :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].id_inventaris }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Nopol :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].nopol }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Merek :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].merek }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Kategori :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].kategori }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Tahun :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].tahun }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Pajak :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].pajak }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Masa Pajak :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].masa_pajak }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Harga Beli :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].harga_beli }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label">Tanggal Beli :</label>
                    <div class="col-sm-9">
                      <p class="form-control-plaintext">{{ inventarisList[0].tanggal_beli }}</p>
                    </div>
                  </div>
                </div>
                <h3 class="card-title">Detail Peminjaman</h3>
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <button @click="showAddModal = true" class="btn btn-md btn-success border-0">Pinjam Inventaris</button>
                </div>
                <div class="col-md-6 mb-3" style="margin-top: 5px;">
                  <router-link :to="{ name: 'ruang_pegawai.ruang' }" class="btn btn-md btn-warning rounded-sm" style="right: 0;">Kembali</router-link>
                </div>
              <table class="table table-bordered">
                <thead class="bg-dark text-white text-center">
                  <tr>
                    <th scope="col">ID Pinjam</th>
                    <th scope="col">Inventaris</th>
                    <th scope="col">pinjam</th>
                    <th scope="col">kembali</th>
                    <th scope="col">Durasi Pinjam</th>
                    <th scope="col">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pinventaris in inventarisList[0].pemakaian_inventaris" :key="pinventaris.id_pinjam">
                    <td class="text-center">{{ pinventaris.id_pinjam }}</td>
                    <td>{{ pinventaris.inventaris }}</td>
                    <td>{{ pinventaris.tanggal_pinjam }}</td>
                    <td>{{ pinventaris.tanggal_kembali }}</td>
                    <td>{{ pinventaris.durasi_pinjam }}</td>
                    <td>{{ pinventaris.keterangan }}</td>
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
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveEditPegawai">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showEditModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
