//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//define a routes
const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import( /* webpackChunkName: "login" */ '../views/login.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import( /* webpackChunkName: "home" */ '../views/home.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard.dashboard',
        component: () => import( /* webpackChunkName: "dashboard" */ '../views/dashboard/dashboard.vue')
    },
    {
        path: '/buku',
        name: 'buku.buku',
        component: () => import( /* webpackChunkName: "buku" */ '../views/buku/buku.vue')
    },
    {
        path: '/inventaris',
        name: 'inventaris.inventaris',
        component: () => import( /* webpackChunkName: "inventaris" */ '../views/inventaris/inventaris.vue')
    },
    {
        path: '/keluar',
        name: 'keluar.keluar',
        component: () => import( /* webpackChunkName: "keluar" */ '../views/keluar/keluar.vue')
    },
    {
        path: '/masuk',
        name: 'masuk.masuk',
        component: () => import( /* webpackChunkName: "masuk" */ '../views/masuk/masuk.vue')
    },
    {
        path: '/reservasi',
        name: 'reservasi.reservasi',
        component: () => import( /* webpackChunkName: "reservasi" */ '../views/reservasi/reservasi.vue')
    },
    {
        path: '/peminjaman',
        name: 'peminjaman.peminjaman',
        component: () => import( /* webpackChunkName: "peminjaman" */ '../views/peminjaman/peminjaman.vue')
    }
]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router