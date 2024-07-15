<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import '/src/style/font.css';
import '/src/style/table.css';
import '/src/style/surat_masuk.css';
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
  nomorSurat: '',
  tanggalSurat: '',
  tanggalterima: '',
  asal: '',
  perihal: '',
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


// Function to delete a post
const deletePost = async (nomor_surat) => {
  if (confirm("Apakah anda ingin menghapus data ini?")) {
    try {
      await api.delete(`/api/arsip/${nomor_surat}`);
      // Remove the deleted post from the posts array
      posts.value = posts.value.filter(post => post.nomor_surat !== nomor_surat);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};

// Function to download a PDF file
const downloadPDF = async (nomor_surat) => {
  try {
    const timestamp = new Date().getTime(); // Generate a timestamp
    const response = await api.get(`/api/arsip/${nomor_surat}/download?timestamp=${timestamp}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${nomor_surat}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};


// Computed property to filter posts based on search query
const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return posts.value;
  }
  return posts.value.filter(post => 
    post.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Method to handle the search button click
const handleSearch = () => {
  searchQuery.value = tempSearchQuery.value;
};

// Function to handle form submission
const saveData = async () => {
  try {
    // Send the form data to the API
    await api.post('/api/arsip', formData.value);
    // Reset form data
    formData.value = { id: '', nomorSurat: '', tanggalSurat: '' };
    // Close the modal
    showModal.value = false;
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// // Run hook "onMounted"
// onMounted(() => {
//   fetchDataPosts();
// });

</script>

<template>
    <div class="background-container">
      <div class="content">
        <div class="container mt-5 mb-5">
            <div class="row">
                <div class="card2" style="">
                    <h2>SURAT MASUK</h2>
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
                      <th scope="col" style="width:10%">ID</th>
                      <th scope="col" style="width:10%">NOMOR SURAT</th>
                      <th scope="col" style="width:15%">TANGGAL SURAT</th>
                      <th scope="col" style="width:15%">TANGGAL TERIMA</th>
                      <th scope="col" style="width:15%">ASAL</th>
                      <th scope="col" style="width:25%">PERIHAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredPosts.length === 0">
                      <td colspan="6" class="text-center">
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
                        <button @click="deletePost(post.nomor_surat)" class="btn btn-sm btn-danger rounded-sm shadow border-0" style="margin-right: 7px;">HAPUS</button>
                        <button @click="downloadPDF(post.nomor_surat)" class="btn btn-sm btn-secondary rounded-sm shadow border-0">DOWNLOAD</button>
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
        <h4 style="text-align: center; color: #28a745; font-weight: bolder;">TAMBAH SURAT MASUK</h4>
        <div class="form-group">
          <label for="id">ID</label>
          <input type="text" id="id" v-model="formData.id" />
        </div>
        <div class="form-group">
          <label for="nomorSurat">Nomor Surat</label>
          <input type="text" id="nomorSurat" v-model="formData.nomorSurat" />
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label for="tanggalSurat" style="width: 195px;">Tanggal Surat</label>
            <input type="date" id="tanggalSurat" v-model="formData.tanggalSurat" />
          </div>
          <div class="form-group">
            <label for="tanggalTerima" style="width: 195px;">Tanggal Terima</label>
            <input type="date" id="tanggalTerima" v-model="formData.tanggalTerima" />
          </div>
        </div>
        <div class="form-group">
          <label for="asal">Asal</label>
          <input type="text" id="asal" v-model="formData.asal" />
        </div>
        <div class="form-group">
          <label for="perihal">Perihal</label>
          <input type="text" id="perihal" v-model="formData.perihal" />
        </div>
        <div class="form-actions">
          <button class="btn btn-sm btn-save rounded-sm shadow border-0" @click="saveData">Simpan</button>
          <button class="btn btn-sm btn-batal rounded-sm shadow border-0" @click="showModal = false">Batal</button>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* Tambahkan gaya kustom Anda di sini jika diperlukan */
</style>
