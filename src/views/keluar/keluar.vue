<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/background_color.css';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/modal.css';
import '/src/style/admin.css';

const suratKeluar = ref([]);
const cabangList = ref([]);
const kodeSuratList = ref([]);
const searchQuery = ref('');
const showAddModal = ref(false);

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

const fetchDataSuratKeluar = async () => {
  try {
    const response = await api.get('/api/sk');
    suratKeluar.value = response.data.data.data;
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

const fetchDataKodeSurat = async () => {
  try {
    const response = await api.get('/api/surat');
    kodeSuratList.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching kode surat list:', error);
  }
};

const filteredSuratKeluar = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    return suratKeluar.value;
  }
  return suratKeluar.value.filter(s =>
    s.nomor_surat.toLowerCase().includes(query) ||
    s.perihal.toLowerCase().includes(query) ||
    s.tujuan_surat.toLowerCase().includes(query) ||
    getNamaCabang(s.cabang).toLowerCase().includes(query)
  );
});

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
  const monthNames = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const selectedKodeSurat = addFormData.value.kode_surat;
  const selectedCabang = addFormData.value.cabang;

  const response = await api.get(`/api/sk?cabang=${selectedCabang}&kode_surat=${selectedKodeSurat}`);
  const suratList = response.data.data.data;

  let newNumber = 1;
  if (suratList.length > 0) {
    const existingNumbers = suratList.map(s => parseInt(s.nomor_surat.split('.')[1]));
    newNumber = Math.max(...existingNumbers) + 1;
  }

  const formattedNumber = String(newNumber).padStart(3, '0');
  return `${selectedKodeSurat}.${formattedNumber}/HEXA/${currentMonth}/${currentYear}`;
};

const generateNewSkId = async () => {
  try {
    const response = await api.get('/api/sk');
    const suratKeluar = response.data.data.data;

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

onMounted(() => {
  generateNewSkId();
  fetchDataSuratKeluar();
  fetchDataCabang();
  fetchDataKodeSurat();
});
</script>

<template>
  <div class="background-container">
    <div class="content">
      <div class="container mt-5 mb-5">
        <div class="row">
          <div class="card2">
            <h2>SURAT KELUAR</h2>
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
                    <input type="text" class="form-cari" v-model="searchQuery" placeholder="cari surat" style="margin-right: 10px; width: 300px;">
                    <button class="btn btn-primary ml-2">FILTER</button>
                  </div>
                </div>

                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:13%">ID SURAT KELUAR</th>
                      <th scope="col" style="width:13%">NOMOR SURAT</th>
                      <th scope="col" style="width:13%">TANGGAL SURAT</th>
                      <th scope="col" style="width:13%">TANGGAL KIRIM</th>
                      <th scope="col" style="width:15%">TUJUAN SURAT</th>
                      <th scope="col" style="width:15%">PERIHAL</th>
                      <th scope="col" style="width:20%">CABANG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredSuratKeluar.length === 0">
                      <td colspan="8" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(s, index) in filteredSuratKeluar" :key="index">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal untuk menambah surat keluar baru -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-content">
      <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">TAMBAH SURAT KELUAR</h4>
      <div class="form-group">
        <label for="id_surat_keluar">ID Surat Keluar</label>
        <input type="text" id="id_surat_keluar" v-model="addFormData.id_surat_keluar" />
      </div>
      <div class="form-group">
        <label for="kode_surat">Jenis Surat</label>
        <select id="kode_surat" v-model="addFormData.kode_surat">
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
      <div class="form-group">
        <label for="cabang">Cabang</label>
        <select id="cabang" v-model="addFormData.cabang">
          <option v-for="c in cabangList" :value="c.id_cabang" :key="c.id_cabang">{{ c.nama_cabang }}</option>
        </select>
      </div>
      <div class="form-actions">
        <button class=" btn-modal-save rounded-sm shadow border-0" @click="saveNewSuratKeluar">Simpan Perubahan</button>
        <button class=" btn-modal-batal rounded-sm shadow border-0" @click="showAddModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
