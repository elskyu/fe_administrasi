<template>
  <div class="error-container">
    <div class="error-card">
      <p style="color: blue;">Sesi Anda telah berakhir, silakan login kembali.</p>
      <button @click="redirectToLogin">Login</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();

const redirectToLogin = async () => {
  
  try {
    router.push({ name: 'login' }).then(() => {
      window.location.reload();
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>


<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-card p {
  font-size: 18px;
  margin-bottom: 15px;
}

.error-card button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.error-card button:hover {
  background-color: #0056b3;
}
</style>
