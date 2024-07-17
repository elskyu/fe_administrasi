<script setup>
import '../style/sidebar.css';
import { ref } from 'vue';

const showDropdown = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  console.log('Dropdown state:', showDropdown.value); // Debugging log
};
const logoutAndReload = () => {
      router.push({ name: 'login' }).then(() => {
        window.location.reload();
      });
    };
</script>

<template>
    <div class="d-flex">
      <nav class="sidebar custom-sidebar" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
        <ul class="navbar-nav">
            <li class="header-sidebar" style="margin-top: 10px; margin-bottom: 10px; text-align: center;">
                <span style="font-weight: bold; font-size: 18px;">Teman Kantor</span>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'dashboard.dashboard' }" class="nav-link active" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                    <span span>Dashboard</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'buku.buku' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                    </svg>
                    <span>Buku Tamu</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'inventaris.inventaris' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M4.78 10.34L5.87 5.75C6.26 4.18 7.69 3 9.3 3h5.4c1.61 0 3.04 1.18 3.43 2.75l1.09 4.59c.92.27 1.6 1.12 1.6 2.14v3c0 1.11-.89 2-2 2v1c0 .55-.45 1-1 1s-1-.45-1-1v-1H6v1c0 .55-.45 1-1 1s-1-.45-1-1v-1c-1.11 0-2-.89-2-2v-3c0-1.02.68-1.87 1.6-2.14zM16.28 5.75C16.04 4.84 15.21 4 14.3 4h-5.4c-.91 0-1.74.84-1.98 1.75L5.81 10h12.38l-1.91-4.25zM6 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm12 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                    </svg>
                    <span>Inventaris</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'peminjaman.peminjaman' }" class="nav-link active" aria-current="page" style=" margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
                    </svg>
                  <span>Pemakaian</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'masuk.masuk' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                    <span>Surat Masuk</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'keluar.keluar' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
                        <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
                    </svg>
                    <span>Surat Keluar</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'reservasi.reservasi' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z"></path>
                    </svg>
                <span>Reservasi</span>
                </router-link>
            </li>
            <li class="nav-item">
                <div @click="toggleDropdown" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px; cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="icon">
                        <g>
	                        <path d="M480,224H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,224,480,224z"></path>
	                        <path d="M32,138.667h448c17.673,0,32-14.327,32-32s-14.327-32-32-32H32c-17.673,0-32,14.327-32,32S14.327,138.667,32,138.667z"></path>
	                        <path d="M480,373.333H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,373.333,480,373.333z"></path>
                        </g>
                    </svg>
                <span>Master</span>
                </div>
                <ul v-if="showDropdown" class="dropdown-menu" style="margin-left: 45px; border: none;">
                    
                    <li><router-link :to="{ name: 'surat.tambahsurat' }" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>Surat</router-link></li>
                    <li><router-link :to="{ name: 'admin.tambahadmin' }" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="icon">
                            <g>
	                            <circle cx="256" cy="128" r="128"></circle>
	                            <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z"></path>
                            </g>
                          </svg>Admin</router-link></li>
                    <li><router-link :to="{ name: 'ruang.tambahruang' }" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z"></path>
                    </svg>Ruang</router-link></li>
                    <li><router-link :to="{ name: 'cabang.tambahcabang' }" class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path d="M14.081,11.41l-3-2.349c-1.814-1.418-4.348-1.419-6.162,0l-3,2.348c-1.22,.955-1.919,2.39-1.919,3.938v4.152c0,2.481,2.019,4.5,4.5,4.5h7c2.481,0,4.5-2.019,4.5-4.5v-4.152c0-1.548-.699-2.982-1.919-3.938Zm-4.081,6.59c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1v-2c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1v2ZM19,0h-4c-2.757,0-5,2.243-5,5v1.306c.819,.245,1.606,.627,2.312,1.179l3.002,2.351c1.707,1.336,2.686,3.346,2.686,5.512v2.652c0-.553,.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1h-1c-.553,0-1-.447-1-1v1.5c0,1.746-.696,3.331-1.821,4.5h2.821c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-4,7h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm5,8h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm0-4h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Zm0-4h-1c-.553,0-1-.447-1-1s.447-1,1-1h1c.553,0,1,.447,1,1s-.447,1-1,1Z"></path>
                    </svg>Cabang</router-link></li>
                    <li><router-link :to="{ name: 'pegawai.tambahpegawai' }" class="dropdown-item"><svg viewBox="0 0 24 24" fill="currentColor" class="icon" xmlns="http://www.w3.org/2000/svg"><path d="m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm7.5 7a5.006 5.006 0 0 0 -5-5h-5a5.006 5.006 0 0 0 -5 5v4h15zm2.5-11a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm1.5 2h-5a4.793 4.793 0 0 0 -.524.053 6.514 6.514 0 0 1 -1.576 2.216 7.008 7.008 0 0 1 5.1 6.731h7v-4a5.006 5.006 0 0 0 -5-5z"></path>
                    </svg>Pegawai</router-link></li>
                    <li><router-link :to="{ name: 'departemen.tambahdepartemen' }" class="dropdown-item"><svg  viewBox="0 0 24 24" fill="currentColor" class="icon" xmlns="http://www.w3.org/2000/svg"><path d="m11 0h-8a3 3 0 0 0 -3 3v21h14v-21a3 3 0 0 0 -3-3zm-5 19h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm5 12h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm10-2h-5v19h8v-16a3 3 0 0 0 -3-3zm0 14h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2z"></path>
                    </svg>Departemen</router-link></li>
                </ul>
            </li>
            <li class="nav-item" style="position: absolute; bottom: 20px; width: 100%;">
                <router-link :to="{ name: 'login' }" class="nav-link active" aria-current="page" style="margin-left: 15px; margin-right: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                        <path d="m23.473,16.247l-2.862,2.863-1.414-1.414,1.696-1.696h-6.892v-2h6.956l-1.76-1.761,1.414-1.414,2.862,2.862c.706.706.706,1.854,0,2.56Zm-9.473,1.753h2v5.999H0V4.199C0,2.775,1.014,1.538,2.411,1.258L8.412.057c.886-.174,1.793.051,2.491.622.428.351.728.812.908,1.319h1.19c1.654,0,3,1.346,3,3v7.001h-2v-7.001c0-.552-.449-1-1-1h-1v18h2v-3.999Zm-4.999-5.501c0-.829-.672-1.501-1.501-1.501s-1.501.672-1.501,1.501.672,1.501,1.501,1.501,1.501-.672,1.501-1.501Z"></path>
                    </svg>
                <span>Logout</span>
                </router-link>
            </li>
        </ul>
      </nav>
    </div>
  </template>