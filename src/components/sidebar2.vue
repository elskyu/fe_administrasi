<script setup>
import axios from 'axios';
import api from '../api'; // Pastikan api ini digunakan jika diperlukan
import '../style/sidebar.css';
import '../style/modal.css';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter(); // Initialize the router
const route = useRoute(); // Get the current route

const showProfileModal = ref(false);
const showModalPassword = ref(false);
const showModalUbahProfil = ref(false);

const userName = ref(''); // Default name
const userDepartemen = ref('');
const userCabang = ref('');
const userNIP = ref('');
const userId = ref('');
const userPhoto = ref(''); // Default photo

const cabangList = ref([]);
const departementList = ref([]);

const oldPassword = ref('');
const newPassword = ref('');

const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const [userResponse, cabangResponse, departementResponse] = await Promise.all([
                api.get('/api/userpegawai', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/cp', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/dp', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const user = userResponse.data;
            cabangList.value = cabangResponse.data.data.data;
            departementList.value = departementResponse.data.data.data;

            if (user) {
                userName.value = user.nama || 'Nama tidak ditemukan';
                userDepartemen.value = getNamaDepartemen(user.departement) || 'Departemen tidak ditemukan';
                userCabang.value = getNamaCabang(user.cabang) || 'Cabang tidak ditemukan';
                userPhoto.value = user.foto || 'https://bootdey.com/img/Content/avatar/avatar7.png'; // Default image if no photo
                userId.value = user.id_pegawai || '';
                userNIP.value = user.nip || '';
            } else {
                console.error('Data pengguna tidak ditemukan dalam respons');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.error('Token tidak ditemukan');
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

const logoutAndReload = () => {
    router.push({ name: 'login' }).then(() => {
        window.location.reload();
    });
};

const isActive = (name) => {
    return route.name === name ? 'active' : '';
};

const newProfilePhoto = ref(null);

// Fungsi untuk menangani perubahan foto profil
const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        newProfilePhoto.value = file;
    }
};

// Fungsi untuk menyimpan foto profil
const saveFotoProfil = async () => {
    const token = localStorage.getItem('token');

    if (newProfilePhoto.value) {
        const formData = new FormData();
        formData.append('foto', newProfilePhoto.value);
        formData.append('_method', 'PUT'); // Simulasi PUT request

        try {
            const response = await api.post(`/api/updatep/${userId.value}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                userPhoto.value = response.data.data.foto; // Update foto di front-end
                showModalUbahProfil.value = false; // Tutup modal
                fetchAllData();
            } else {
                console.error('Error updating profile photo:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile photo:', error);
        }
    } else {
        console.log('No new photo to update');
        showModalUbahProfil.value = false; // Tutup modal jika tidak ada foto baru
    }
};

const saveUbahPassword = async () => {
    const token = localStorage.getItem('token');

    if (oldPassword.value && newPassword.value) {
        const formData = new FormData();
        formData.append('password_lama', oldPassword.value);
        formData.append('password', newPassword.value);
        formData.append('_method', 'PUT'); // Simulasi PUT request

        try {
            const response = await api.post(`/api/updatep/${userId.value}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                console.log('Password updated successfully');
                oldPassword.value = '';
                newPassword.value = '';
                showModalPassword.value = false; // Tutup modal
                await fetchAllData(); // Fetch data terbaru
            } else {
                console.error('Error updating password:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    } else {
        console.log('Please enter both old and new passwords');
    }
};


onMounted(async () => {
    fetchAllData();
});
</script>



<template>
    <div class="d-flex">
        <nav class="sidebar custom-sidebar" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
            <ul class="navbar-nav">

                <div class="profil" style="flex: 0 0 20%;">
                    <div class="form-group-row" style="display: flex; align-items: center; margin-right: 35px;">
                        <div>
                            <img :src="userPhoto" @click="showProfileModal = true" width="28" height="28"
                                style="border-radius: 50%; cursor: pointer; margin-left: 25px;" />
                        </div>
                        <p class="text-profil" style="margin: 0 auto; font-size: 15px;">Halo {{ userName }}</p>
                    </div>
                </div>

                <li class="nav-item">
                    <router-link :to="{ name: 'dashboard_pegawai.dashboard' }"
                        :class="['nav-link', isActive('dashboard_pegawai.dashboard')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path
                                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        <span span>Dashboard</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'inventaris_pegawai.inventaris' }"
                        :class="['nav-link', isActive('inventaris_pegawai.inventaris')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M4.78 10.34L5.87 5.75C6.26 4.18 7.69 3 9.3 3h5.4c1.61 0 3.04 1.18 3.43 2.75l1.09 4.59c.92.27 1.6 1.12 1.6 2.14v3c0 1.11-.89 2-2 2v1c0 .55-.45 1-1 1s-1-.45-1-1v-1H6v1c0 .55-.45 1-1 1s-1-.45-1-1v-1c-1.11 0-2-.89-2-2v-3c0-1.02.68-1.87 1.6-2.14zM16.28 5.75C16.04 4.84 15.21 4 14.3 4h-5.4c-.91 0-1.74.84-1.98 1.75L5.81 10h12.38l-1.91-4.25zM6 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm12 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                        </svg>
                        <span>Inventaris</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'ruang_pegawai.ruang' }"
                        :class="['nav-link', isActive('ruang_pegawai.ruang')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z">
                            </path>
                        </svg>
                        <span>Ruang</span>
                    </router-link>
                </li>

                <li class="nav-item" style="position: absolute; bottom: 20px; width: 100%;">
                    <a href="javascript:void(0)" @click="logoutAndReload" class="nav-link" aria-current="page"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="m23.473,16.247l-2.862,2.863-1.414-1.414,1.696-1.696h-6.892v-2h6.956l-1.76-1.761,1.414-1.414,2.862,2.862c.706.706.706,1.854,0,2.56Zm-9.473,1.753h2v5.999H0V4.199C0,2.775,1.014,1.538,2.411,1.258L8.412.057c.886-.174,1.793.051,2.491.622.428.351.728.812.908,1.319h1.19c1.654,0,3,1.346,3,3v7.001h-2v-7.001c0-.552-.449-1-1-1h-1v18h2v-3.999Zm-4.999-5.501c0-.829-.672-1.501-1.501-1.501s-1.501.672-1.501,1.501.672,1.501,1.501,1.501,1.501-.672,1.501-1.501Z">
                            </path>
                        </svg>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Profil modal -->
        <div v-if="showProfileModal" class="modal card-profil">
            <div class="modal-profil">
                <div class="upper">
                    <img src="" class="img-fluid">
                </div>
                <div class="user text-center">
                    <div class="profile">
                        <!-- Foto Profil -->
                        <img :src="userPhoto" class="rounded-circle profile-photo" width="180">
                        <!-- SVG di depan foto profil -->
                        <svg style="cursor: pointer;" @click="showModalUbahProfil = true" class="profile-icon"
                            width="24" height="24" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="29" cy="29" r="29" fill="#A3A3A3" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M22.9837 13.5546C22.5555 13.8087 22.2036 14.1735 21.9652 14.6107L20.3597 17.5525L15.7316 17.7742C14.6137 17.8271 13.559 18.3084 12.7866 19.1183C12.0141 19.9282 11.5832 21.0044 11.5833 22.1236V40.4792C11.5833 41.634 12.042 42.7415 12.8586 43.558C13.6751 44.3746 14.7826 44.8333 15.9374 44.8333H42.0624C43.2172 44.8333 44.3247 44.3746 45.1413 43.558C45.9578 42.7415 46.4166 41.634 46.4166 40.4792V22.122C46.4158 21.0036 45.9848 19.9284 45.2127 19.1193C44.4407 18.3101 43.3869 17.829 42.2698 17.7758L37.6402 17.5541L36.0347 14.6107C35.5486 13.7208 34.6144 13.1667 33.6011 13.1667H24.3988C23.9008 13.1665 23.412 13.3005 22.9837 13.5546ZM28.9999 37.7083C32.4977 37.7083 35.3333 34.8728 35.3333 31.375C35.3333 27.8772 32.4977 25.0417 28.9999 25.0417C25.5021 25.0417 22.6666 27.8772 22.6666 31.375C22.6666 34.8728 25.5021 37.7083 28.9999 37.7083Z"
                                fill="white" />
                        </svg>

                    </div>
                </div>
                <div class="text-center" style="margin-top: 65px;">
                    <h5 class="mb-0">{{ userName }}</h5>
                    <span class="text-profil" style="font-size: 16px;">{{ userDepartemen }}, {{ userCabang }}</span>
                    <span class="text-profil d-block mb-2" style="font-size: 14px;">Nip. {{ userNIP }}</span>
                    <div class="button-group-vertical">
                        <button style="margin-top: 15px;" @click="showModalPassword = true"
                            class="btn-ubah-password">Ubah Password</button>
                        <button @click="showProfileModal = false" class="btn-batal-ubah-password">Batal</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Ubah Password -->
        <div v-if="showModalPassword" class="modal card-profil">
            <div class="modal-profil">
                <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Ubah Password
                </h4>
                <div class="form-group" style="margin-left: 0px;">
                    <label for="password_lama">Password Lama</label>
                    <input type="password" id="password_lama" v-model="oldPassword" />
                </div>
                <div class="form-group" style="margin-left: 0px;">
                    <label for="password">Password Baru</label>
                    <input type="password" id="password" v-model="newPassword" />
                </div>
                <button class="btn-simpan-ubah-profil" @click="saveUbahPassword"
                    style="margin: 20px 10px 10px 10px;">Simpan
                    Perubahan</button>
                <button @click="showModalPassword = false" class="btn-batal-ubah-password"
                    style="margin: 10px 10px 10px 10px;">Batal</button>
            </div>
        </div>


        <!-- Modal Ubah foto -->
        <div v-if="showModalUbahProfil" class="modal card-profil">
            <div class="modal-profil">
                <h4 style="text-align: center; color: #28a745; font-weight: bolder; margin-bottom: 15px;">Ubah Profil
                </h4>
                <div style="width: 275px; margin: 0px 10px 20px 10px;">
                    <label for="foto">Upload Foto Anda</label>
                    <input style="margin-top: 7px;" type="file" @change="handleProfilePhotoChange" class="form-control">
                </div>
                <button class="btn-simpan-ubah-profil" @click="saveFotoProfil"
                    style="margin: 20px 10px 10px 10px;">Simpan
                    Perubahan</button>
                <button @click="showModalUbahProfil = false" class="btn-batal-ubah-profil"
                    style="margin: 10px 10px 10px 10px;">Batal</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-photo {
    z-index: 1;
    /* Foto profil berada di bawah SVG */
}

.profile-icon {
    position: absolute;
    bottom: 1px;
    /* Jarak dari bawah */
    right: 5px;
    /* Jarak dari kanan */
    z-index: 2;
    /* SVG berada di atas foto profil */
}
</style>