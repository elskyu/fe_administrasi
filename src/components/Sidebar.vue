<template>
    <div class="d-flex">
      <nav class="sidebar custom-sidebar">
        <ul class="navbar-nav">
          <li class="nav-item">
          <router-link :to="{ name: '' }" class="nav-link active" style="font-weight: bold; margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
              <span>Dashboard</span>
          </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: '' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
              <span>BUKU TAMU</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: '' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M4.78 10.34L5.87 5.75C6.26 4.18 7.69 3 9.3 3h5.4c1.61 0 3.04 1.18 3.43 2.75l1.09 4.59c.92.27 1.6 1.12 1.6 2.14v3c0 1.11-.89 2-2 2v1c0 .55-.45 1-1 1s-1-.45-1-1v-1H6v1c0 .55-.45 1-1 1s-1-.45-1-1v-1c-1.11 0-2-.89-2-2v-3c0-1.02.68-1.87 1.6-2.14zM16.28 5.75C16.04 4.84 15.21 4 14.3 4h-5.4c-.91 0-1.74.84-1.98 1.75L5.81 10h12.38l-1.91-4.25zM6 14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm12 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                </svg>
              <span>INVENTARIS</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: '' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              <span>SURAT MASUK</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: '' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
                <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
                </svg>
              <span>SURAT KELUAR</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: '' }" class="nav-link active" aria-current="page" style="font-weight: bold;  margin-left: 25px;">
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path d="M20,22V5c0-1.654-1.346-3-3-3h-1.19c-.18-.507-.48-.968-.908-1.319C14.205,.109,13.298-.115,12.412,.059L6.411,1.259c-1.397,.28-2.411,1.518-2.411,2.941V22H0v2H24v-2h-4Zm-7.5-8.75c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5,.672,1.5,1.5-.672,1.5-1.5,1.5Zm5.5,8.75h-2V4h1c.551,0,1,.448,1,1V22Z"></path>
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
      background: linear-gradient(to bottom, rgb(27, 71, 200), rgb(52, 209, 223)); /* Warna sidebar */
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