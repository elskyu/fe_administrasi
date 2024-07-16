<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/buku.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';

// State for storing posts
const posts = ref([]);
const categories = ref([]);
const searchQuery = ref(''); // State for search query
const tempSearchQuery = ref(''); // Temporary state for holding input value
const visible = ref(false); // State to control dialog visibility
const formData = ref({
  id: '',
  tanggalkunjungan: '',
  nama: '',
  jabatan: '',
  no_hp: '',
  departemen_dikunjungi: '',
  keperluan: '',
  cabang: '',
});
const showModal = ref(false); // State for controlling modal visibility

// Function to fetch posts from the API
// const fetchDataPosts = async () => {
//   try {
//     const response = await api.get('/api/arsip');
//     console.log(response); // Log the response to inspect its structure
//     posts.value = response.data.data.data; // Adjust based on the actual response structure
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//   }
// };


// Computed property to filter posts based on search query
const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return posts.value;
  }
  return posts.value.filter(post => 
    post.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
 <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
            <div class="row">
                <div class="card2" style="">
                    <h2>BUKU TAMU</h2>
                </div>
            </div>
    
          <div class="col-md-12" style="margin-left: -10px; width: auto;">
            <div class="card border-0">
              <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3" style="margin-top: 5px;">
                        <button @click="showModal = true" class="btn btn-md btn-success border-0">TAMBAH</button>
                    </div>
    
                    <div class="col-md-6 mb-3" style="margin-top: 5px; right: auto;">
                        <!-- Search Bar -->
                        <div class="d-flex justify-content-end">
                            <button @click="handleSearch" class="btn btn-primary">FILTER</button>
                        </div>
                </div>
                
                <table class="table table-bordered">
                  <thead class="bg-dark text-white text-center">
                    <tr>
                      <th scope="col" style="width:5%">ID</th>
                      <th scope="col" style="width:20%">TANGGAL KUNJUNGAN</th>
                      <th scope="col" style="width:10%">NAMA</th>
                      <th scope="col" style="width:12%">JABATAN</th>
                      <th scope="col" style="width:10%">NO HP</th>
                      <th scope="col" style="width:25%">DEPARTEMEN DIKUNJUNGI</th>
                      <th scope="col" style="width:25%">KEPERLUAN</th>
                      <th scope="col" style="width:25%">CABANG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredPosts.length === 0">
                      <td colspan="8" class="text-center">
                        <div class="alert alert-danger mb-0">
                          Data Belum Tersedia!
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="(post, index) in filteredPosts" :key="index">
                      <td class="text-center">{{ post.nomor_surat }}</td>
                      <td>{{ post.nama_kategori }}</td>
                      <td>{{ post.judul }}</td>
                      <td>{{ post.created_at }}</td>
                      <td class="text-center">
                        <router-link :to="{ name: '', params: { id: post.nomor_surat } }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">LIHAT</router-link>
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

    <!-- Simple Pop-up Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH BUKU TAMU</h4>
        <div class="form-group-row">
            <div class="form-group">
                <label for="id" style="width: 195px;">ID Tamu</label>
                <input type="text" id="id" v-model="formData.id" />
            </div>
            <div class="form-group">
                <label for="nama" style="width: 195px;">Nama</label>
                <input type="text" id="nama" v-model="formData.nama" />
            </div>
        </div>
        <div class="form-group-row">
            <div class="form-group">
                <label for="jabatan" style="width: 195px;">Jabatan</label>
                <input type="text" id="jabatan" v-model="formData.jabatan" />
            </div>
            <div class="form-group">
                <label for="no_hp" style="width: 195px;">No Hp</label>
                <input type="text" id="no_hp" v-model="formData.no_hp" />
            </div>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label for="tanggalkunjungan" style="width: 195px;">Tanggal Kunjungan</label>
            <input type="date" id="tanggalkunjungan" v-model="formData.Tanggalkunjungan" />
          </div>
          <div class="form-group">
            <label for="cabang" style="width: 195px;">Cabang</label>
            <input type="text" id="cabang" v-model="formData.cabang" />
          </div>
        </div>
        <div class="form-group">
          <label for="departemen_dikunjungi">Departemen Dikunjungi</label>
          <input type="text" id="departemen_dikunjungi" v-model="formData.departemen_dikunjungi" />
        </div>
        <div class="form-group">
          <label for="keperluan">Keperluan</label>
          <input type="text" id="keperluan" v-model="formData.keperluan" />
        </div>
        <div class="form-actions">
          <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveData">Simpan</button>
          <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showModal = false">Batal</button>
        </div>
      </div>
    </div>
</template>