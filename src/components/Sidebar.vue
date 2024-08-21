<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import api from '../api';
import '../style/sidebar.css';
import '../style/modal.css';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // Get the current route
const userName = ref(''); // Default name
const showProfileModal = ref(false);
const userPhoto = ref(''); // Default photo

const showDropdown = ref(false);
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
    console.log('Dropdown state:', showDropdown.value); // Debugging log
};

const fetchUserName = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await api.get('/api/useradmin', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("nama : ", response.data); // Tambahkan log ini
            const user = response.data;
            if (user && user.nama) {
                userName.value = user.nama;
                userPhoto.value = user.foto
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

const logoutAndReload = async () => {
    try {
        const response = await api.post('/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.data.success) {
            router.push({ name: 'login' }).then(() => {
                window.location.reload();
            });
        } else {
            console.error('Logout failed:', response.data.message);
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
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
                        <div>
                            <img :src="userPhoto" @click="showProfileModal = true" width="28" height="28"
                                style="border-radius: 50%; cursor: pointer; margin-left: 25px;" />
                        </div>
                        <p class="text-profil" style="margin: 0 auto;">Halo {{ userName }}</p>
                    </div>
                </div>

                <li class="nav-item">
                    <router-link :to="{ name: 'dashboard.dashboard' }"
                        :class="['nav-link', isActive('dashboard.dashboard')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path
                                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        <span>Dashboard</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'buku.buku' }" :class="['nav-link', isActive('buku.buku')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg fill="#000000" class="icon" viewBox="0 0 32 32" version="1.1"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z">
                            </path>
                        </svg>
                        <span>Buku Tamu</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'inventaris.inventaris' }"
                        :class="['nav-link', isActive('inventaris.inventaris')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg fill="#000000" class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2 14.803v6.447c0 .414.336.75.75.75h1.614a.75.75 0 0 0 .74-.627L5.5 19h13l.395 2.373a.75.75 0 0 0 .74.627h1.615a.75.75 0 0 0 .75-.75v-6.447a5.954 5.954 0 0 0-1-3.303l-.78-1.17a1.994 1.994 0 0 1-.178-.33h.994a.75.75 0 0 0 .671-.415l.25-.5A.75.75 0 0 0 21.287 8H19.6l-.31-1.546a2.5 2.5 0 0 0-1.885-1.944C15.943 4.17 14.141 4 12 4c-2.142 0-3.943.17-5.405.51a2.5 2.5 0 0 0-1.886 1.944L4.399 8H2.714a.75.75 0 0 0-.67 1.085l.25.5a.75.75 0 0 0 .67.415h.995a1.999 1.999 0 0 1-.178.33L3 11.5c-.652.978-1 2.127-1 3.303zm15.961-4.799a4 4 0 0 0 .34.997H5.699c.157-.315.271-.65.34-.997l.632-3.157a.5.5 0 0 1 .377-.39C8.346 6.157 10 6 12 6c2 0 3.654.156 4.952.458a.5.5 0 0 1 .378.389l.631 3.157zM5.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM20 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
                            </path>
                        </svg>
                        <span>Inventaris</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'peminjaman.peminjaman' }"
                        :class="['nav-link', isActive('peminjaman.peminjaman')]"
                        style=" margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path fill-rule="evenodd"
                                d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Peminjaman</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'masuk.masuk' }" :class="['nav-link', isActive('masuk.masuk')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path
                                d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </svg>
                        <span>Surat Masuk</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'keluar.keluar' }" :class="['nav-link', isActive('keluar.keluar')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
                            <path
                                d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
                        </svg>
                        <span>Surat Keluar</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link :to="{ name: 'reservasi.reservasi' }"
                        :class="['nav-link', isActive('reservasi.reservasi')]"
                        style="margin-left: 15px; margin-right: 15px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                            <path
                                d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z">
                            </path>
                        </svg>
                        <span>Reservasi</span>
                    </router-link>
                </li>

                <li class="nav-item">
                    <div @click="toggleDropdown" class="nav-link" aria-current="page"
                        style="margin-left: 15px; margin-right: 15px; cursor: pointer;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                            id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"
                            xml:space="preserve" class="icon">
                            <g>
                                <path
                                    d="M480,224H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,224,480,224z">
                                </path>
                                <path
                                    d="M32,138.667h448c17.673,0,32-14.327,32-32s-14.327-32-32-32H32c-17.673,0-32,14.327-32,32S14.327,138.667,32,138.667z">
                                </path>
                                <path
                                    d="M480,373.333H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,373.333,480,373.333z">
                                </path>
                            </g>
                        </svg>
                        <span>Master</span>
                    </div>
                    <ul v-if="showDropdown" class="dropdown-menu" style="margin-left: 45px; border: none;">
                        <li><router-link :to="{ name: 'surat.tambahsurat' }"
                                :class="['dropdown-item', isActive('surat.tambahsurat')]"><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="icon">
                                    <path
                                        d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                    <path
                                        d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                </svg>Surat</router-link></li>

                        <li><router-link :to="{ name: 'admin.tambahadmin' }"
                                :class="['dropdown-item', isActive('admin.tambahadmin')]"><svg
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"
                                    style="enable-background:new 0 0 512 512;" xml:space="preserve" class="icon">
                                    <g>
                                        <circle cx="256" cy="128" r="128"></circle>
                                        <path
                                            d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z">
                                        </path>
                                    </g>
                                </svg>Admin</router-link></li>

                        <li><router-link :to="{ name: 'ruang.tambahruang' }"
                                :class="['dropdown-item', isActive('ruang.tambahruang')]"><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="icon">
                                    <path
                                        d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z">
                                    </path>
                                </svg>Ruang</router-link></li>

                        <li><router-link :to="{ name: 'cabang.tambahcabang' }"
                                :class="['dropdown-item', isActive('cabang.tambahcabang')]"><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="icon">
                                    <path
                                        d="M14.081,11.41l-3-2.349c-1.814-1.418-4.348-1.419-6.162,0l-3,2.348c-1.22,.955-1.919,2.39-1.919,3.938v4.152c0,2.481,2.019,4.5,4.5,4.5h7c2.481,0,4.5-2.019,4.5-4.5v-4.152c0-1.548-.699-2.982-1.919-3.938Zm-4.081,6.59c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1v-2c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1v2ZM19,0h-4c-2.757,0-5,2.243-5,5v1.306c.819,.245,1.606,.627,2.312,1.179l3.002,2.351c1.707,1.336,2.686,3.346,2.686,5.512v2.652c0-.553,.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1h-1c-.553,0-1-.447-1-1v1.5c0,1.746-.696,3.331-1.821,4.5h2.821c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-4,7h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm5,8h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm0-4h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm0-4h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Z">
                                    </path>
                                </svg>Cabang</router-link></li>

                        <li><router-link :to="{ name: 'pegawai.tambahpegawai' }"
                                :class="['dropdown-item', isActive('pegawai.tambahpegawai')]"><svg viewBox="0 0 24 24"
                                    fill="currentColor" class="icon" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm7.5 7a5.006 5.006 0 0 0 -5-5h-5a5.006 5.006 0 0 0 -5 5v4h15zm2.5-11a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm1.5 2h-5a4.793 4.793 0 0 0 -.524.053 6.514 6.514 0 0 1 -1.576 2.216 7.008 7.008 0 0 1 5.1 6.731h7v-4a5.006 5.006 0 0 0 -5-5z">
                                    </path>
                                </svg>Pegawai</router-link></li>

                        <li><router-link :to="{ name: 'departemen.tambahdepartemen' }"
                                :class="['dropdown-item', isActive('departemen.tambahdepartemen')]"><svg
                                    viewBox="0 0 24 24" fill="currentColor" class="icon"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m11 0h-8a3 3 0 0 0 -3 3v21h14v-21a3 3 0 0 0 -3-3zm-5 19h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm5 12h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm10-2h-5v19h8v-16a3 3 0 0 0 -3-3zm0 14h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2z">
                                    </path>
                                </svg>Departemen</router-link></li>
                    </ul>
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
            <div class="modal-profil-admin">
                <div class="upper">
                    <img src="" class="img-fluid">
                </div>
                <div class="user text-center">
                    <div class="profile">
                        <!-- Foto Profil -->
                        <img :src="userPhoto" class="rounded-circle profile-photo" width="180">
                    </div>
                </div>
                <div class="text-center" style="margin-top: 65px;">
                    <h5 class="mb-0">{{ userName }}</h5>
                    <div class="button-group-vertical">
                        <button style="margin: 10px;" @click="showProfileModal = false"
                            class="btn-batal-ubah-password">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
