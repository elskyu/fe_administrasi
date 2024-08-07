<script setup>
import axios from 'axios';
import '../style/sidebar.css';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter(); // Initialize the router
const route = useRoute(); // Get the current route
const userName = ref(''); // Default name
const showProfileModal = ref(false);

const fetchUserName = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get('http://localhost:8000/api/userpegawai', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data;
            if (user && user.nama) {
                userName.value = user.nama;
            } else {
                console.error('Data pengguna tidak ditemukan dalam respons');
            }
        } catch (error) {
            console.error('Gagal mengambil data pengguna:', error);
        }
    } else {
        console.error('Token tidak ditemukan');
    }
};

const logoutAndReload = () => {
    router.push({ name: 'login' }).then(() => {
        window.location.reload();
    });
};

const isActive = (name) => {
    return route.name === name ? 'active' : '';
};

onMounted(async () => {
    fetchUserName();
});
</script>

<template>
    <div class="d-flex">
        <nav class="sidebar custom-sidebar" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
            <ul class="navbar-nav">

                <div class="profil" style="flex: 0 0 20%;">
                    <div class="form-group-row" style="display: flex; align-items: center; margin-right: 35px;">
                        <svg @click="showProfileModal = true" width="24" height="24" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg" style=" margin-left: 25px; cursor: pointer;">
                            <path
                                d="M10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0
                                 10 0ZM4.023 13.416C5.491 15.606 7.695 17 10.16 17C12.624 17 14.829 15.607 16.296 13.416C14.6317 
                                 11.8606 12.4379 10.9968 10.16 11C7.88171 10.9966 5.68751 11.8604 4.023 13.416V13.416ZM10 9C10.7956 9 11.5587 
                                 8.68393 12.1213 8.12132C12.6839 7.55871 13 6.79565 13 6C13 5.20435 12.6839 4.44129 12.1213 3.87868C11.5587 3.31607 10.7956 3 
                                 10 3C9.20435 3 8.44129 3.31607 7.87868 3.87868C7.31607 4.44129 7 5.20435 7 6C7 6.79565 7.31607 7.55871 7.87868 8.12132C8.44129 8.68393 9.20435 9 10 9V9Z"
                                fill="#44d569" />
                        </svg>
                        <p class="text-profil" style="margin: 0 auto;">Halo {{ userName }}</p>
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
                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="rounded-circle"
                            width="180">
                    </div>
                </div>
                <div class="text-center" style="margin-top: 65px;">
                    <h5 class="mb-0">Pegawai 1</h5>
                    <span class="text-profil">Back End Developer, Sidoarjo</span>
                    <span class="text-profil d-block mb-2">Nip. 9876543</span>
                    <div class="button-group-vertical">
                        <button class="btn-ubah-password">Ubah Password</button>
                        <button @click="showProfileModal = false" class="btn-batal-ubah-password">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>