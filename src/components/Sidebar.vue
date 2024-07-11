<template>
    <div class="d-flex">
      <nav class="sidebar custom-sidebar">
        <ul class="navbar-nav">
          <li class="nav-item">
          <router-link :to="{ name: 'pegawai.dasboard' }" class="nav-link active" style="font-weight: bold; margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            <span>Dashboard</span>
          </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'posts.index' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
              <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
              </svg>  
              <span>BUKU TAMU</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span>INVENTARIS</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span>SURAT MASUK</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
              </svg>
              <span>SURAT KELUAR</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>RESERVASI</span>
            </router-link>
          </li>
        </ul>
      </nav>
  
      <!-- Main content area -->
      <div class="content-area">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  
  <style scoped>
    .d-flex {
      display: flex;
    }
    
    .custom-sidebar {
      width: 200px; /* Lebar sidebar */
      height: 100vh; /* Tinggi penuh */
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgb(14, 199, 106); /* Warna sidebar */
      padding-top: 20px;
      z-index: 1000;
    }
    
    .content-area {
      margin-left: 215px; /* Sesuaikan dengan lebar sidebar */
      padding: 0px;
      width: calc(100% - 250px); /* Kurangi lebar sidebar */
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      font-size: small;
      font-weight: bold;
      margin-left: 50px;
      color: rgb(255, 255, 255);
      padding: 10px; /* Atur padding untuk ruang hover */
      transition: background-color 0.5s ease;
    }
    
    .nav-link.active {
      color: rgb(255, 255, 255);
    }
    
    .nav-link:hover {
      background-color: rgba(2, 77, 29, 0.2); /* Warna hover untuk teks dan ikon */
    }
    
    .icon {
      width: 24px; /* Atur lebar ikon */
      height: 24px; /* Atur tinggi ikon */
      margin-right: 8px; /* Sesuaikan jarak antara ikon dan teks */
    }
    
    </style>