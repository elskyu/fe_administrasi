import { createRouter, createWebHistory } from 'vue-router';
import { isTokenExpired } from '../utils/auth';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '../views/error404.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard.dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/dashboard.vue')
  },
  {
    path: '/buku',
    name: 'buku.buku',
    component: () => import(/* webpackChunkName: "buku" */ '../views/buku/buku.vue')
  },
  {
    path: '/inventaris',
    name: 'inventaris.inventaris',
    component: () => import(/* webpackChunkName: "inventaris" */ '../views/inventaris/inventaris.vue')
  },
  {
    path: '/keluar',
    name: 'keluar.keluar',
    component: () => import(/* webpackChunkName: "keluar" */ '../views/keluar/keluar.vue')
  },
  {
    path: '/masuk',
    name: 'masuk.masuk',
    component: () => import(/* webpackChunkName: "masuk" */ '../views/masuk/masuk.vue')
  },
  {
    path: '/reservasi',
    name: 'reservasi.reservasi',
    component: () => import(/* webpackChunkName: "reservasi" */ '../views/reservasi/reservasi.vue')
  },
  {
    path: '/peminjaman',
    name: 'peminjaman.peminjaman',
    component: () => import(/* webpackChunkName: "peminjaman" */ '../views/peminjaman/peminjaman.vue')
  },
  {
    path: '/tambahadmin', 
    name: 'admin.tambahadmin',
    component: () => import(/* webpackChunkName: "tambahadmin" */ '../views/master/admin/tambahadmin.vue')
  },
  {
    path: '/tambahpegawai', 
    name: 'pegawai.tambahpegawai',
    component: () => import(/* webpackChunkName: "tambahpegawai" */ '../views/master/pegawai/tambahpegawai.vue')
  },
  {
    path: '/tambahdepartemen',
    name: 'departemen.tambahdepartemen',
    component: () => import(/* webpackChunkName: "tambahdepartemen" */ '../views/master/departemen/tambahdepartemen.vue')
  },
  {
    path: '/tambahsurat', 
    name: 'surat.tambahsurat',
    component: () => import(/* webpackChunkName: "tambahsurat" */ '../views/master/surat/tambahsurat.vue')
  },
  {
    path: '/tambahruang', 
    name: 'ruang.tambahruang',
    component: () => import(/* webpackChunkName: "tambahruang" */ '../views/master/ruang/tambahruang.vue')
  },
  {
    path: '/tambahcabang', 
    name: 'cabang.tambahcabang',
    component: () => import(/* webpackChunkName: "tambahcabang" */ '../views/master/cabang/tambahcabang.vue')
  },
  {
    path: '/inventaris_pegawai',
    name: 'inventaris_pegawai.inventaris',
    component: () => import(/* webpackChunkName: "inventarisp" */ '../views/pegawai/inventaris/inventaris.vue')
  },
  {
    path: '/ruang_pegawai',
    name: 'ruang_pegawai.ruang',
    component: () => import(/* webpackChunkName: "ruangp" */ '../views/pegawai/ruang/ruang.vue')
  },
  {
    path: '/lihat_inventaris_pegawai/:id',
    name: 'inventaris_pegawai.lihat_inventaris',
    component: () => import(/* webpackChunkName: "inventarisp" */ '../views/pegawai/inventaris/lihat_inventaris.vue')
  },
  {
    path: '/lihat_ruang_pegawai/:id',
    name: 'ruang_pegawai.lihat_ruang',
    component: () => import(/* webpackChunkName: "ruangp" */ '../views/pegawai/ruang/lihat_ruang.vue')
  },
  {
    path: '/dashboard_pegawai',
    name: 'dashboard_pegawai.dashboard',
    component: () => import(/* webpackChunkName: "dashboardp" */ '../views/pegawai/dashboard/dashboard.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name !== 'login' && to.name !== 'error' && isTokenExpired(token)) {
    next({ name: 'error' });
  } else {
    next();
  }
});

export default router;
