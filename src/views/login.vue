<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import api from '../api';
import '../style/login.css';
import '../style/font.css';
import logo23 from '/src/style/logo2.vue';

const email = ref('');
const password = ref('');
const router = useRouter();
const toast = useToast();

const login = async () => {
  try {
    const response = await api.post('/api/login', {
      email: email.value,
      password: password.value,
    });
    const userType = response.data.userType;
    const token = response.data.token;
    console.log(response.data);
    localStorage.setItem('token', token)
    localStorage.setItem('userType', userType);
    toast.success(`Login berhasil sebagai ${userType}`);
    setTimeout(() => {
      if (userType === 'admin') {
        router.push({ name: 'dashboard.dashboard' }).then(() => {
          window.location.reload();
        });
      } else if (userType === 'pegawai') {
        router.push({ name: 'dashboard_pegawai.dashboard' }).then(() => {
          window.location.reload();
        });
      }
    }, 1500);

  } catch (error) {
    console.error(error);
    toast.error('Login gagal, periksa kembali email dan password Anda');
  }
};
</script>

<template>
  <div class="main-container">
    <div class="login-wrapper">
      <div class="col-left">
        <div class="image">
          <img src="@/images/ilustrasi.svg" alt="ilustrasi1">
          <img src="@/images/ilustrasii.svg" alt="ilustrasi2">
          <img src="@/images/ilustrasiii.svg" alt="ilustrasi3">
        </div>
        <div class="login-text">

        </div>
      </div>
      <div class="col-right">
        <div class="login-form">
          <logo23 class="logo">Login</logo23>
          <form @submit.prevent="login">
            <p>
              <label style="font-weight: bolder;">Email<span>*</span></label>
              <input type="email" placeholder="Masukkan Email" v-model="email" required>
            </p>
            <p>
              <label style="font-weight: bolder;">Password<span>*</span></label>
              <input type="password" placeholder="Masukkan Password" v-model="password" required>
            </p>
            <p>
              <label class=""><span></span></label>
              <input type="submit" value="Login">
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
