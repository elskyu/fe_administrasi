<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Assuming you're using Vue Toastification
import axios from 'axios';
import '../style/login.css'; // Import specific CSS file for the login component
import '../style/font.css';

import imageSrc from '../images/login_icon.svg';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter(); // Initialize the router
const toast = useToast();

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value,
    });
    const userType = response.data.userType;
    const token = response.data.token; // Sesuaikan dengan respon API Anda
    
    console.log(response.data);
    // Handle successful login (e.g., store token)
    // Show success toast and then reload the page
    localStorage.setItem('token', token); // Simpan token di localStorage
    localStorage.setItem('userType', userType);
    
    toast.success(`Login berhasil sebagai ${userType}`);
    
    setTimeout(() => {
      router.push({ name: 'dashboard.dashboard' }).then(() => {
        window.location.reload();
      });
    }, 1500); // Adjust the delay as needed
    
  } catch (error) {
    console.error(error);
    toast.error('Login gagal, periksa kembali email dan password Anda');
    // Handle error (e.g., show0error message to the user)
  }
};
</script>

<template>
    <div class="login-container mt-5">
        <div class="row justify-content-center" style="margin-left: 75px; margin-top: 25px;">
            <div class="col-md-6">              
                    <div class="card-body-login">
                        <div class="login-card-title text-center mb-4">
                            <div class="image">
                                <img :src="imageSrc" alt="Profile Image" />
                            </div>
                        </div>
                        <form @submit.prevent="login">
                        <div class="mb-3 input-container">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="input-icon">
                            <g>
	                            <circle cx="256" cy="128" r="128"></circle>
	                            <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z"></path>
                            </g>
                          </svg>
                            <input type="email" placeholder="username" class="form-control" id="email" v-model="email" autocomplete="email" required>
                        </div>
                        <div class="mb-3 input-container">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
                            <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd" />
                          </svg>

                            <input type="password" placeholder="password" class="form-control" id="password" v-model="password" autocomplete="current-password" required>
                        </div>
                            <button type="submit" class="btn login-button" style="width: 535px;">LOGIN</button>
                        </form>
                    </div>
            </div>
        </div>
        <svg class="background-svg" width="451" height="383" viewBox="0 0 501 433" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M167.764 53.3929C79.2472 61.7489 19.0394 -4.05405 0 -38L564 -35.7152V433H501.007C305.957 408.193 338.792 309.293 379.59 262.944C403.417 230.412 446.5 152.032 428.222 98.763C405.375 32.1767 278.41 42.948 167.764 53.3929Z"/>
      </svg>
      <svg class="background-svg2" width="195" height="195" viewBox="0 0 195 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="-0.5" cy="195.5" r="195.5"/>
      </svg>
      <svg class="background-svg3" width="161" height="161" viewBox="0 0 161 161" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="-0.5" cy="161.5" r="161.5"/>
      </svg>
    </div>
</template>

<style scoped>
  

  .login-container {
    width: 100%;
    padding: 2rem;
    border-radius: 1rem;
    animation: fadeIn 1s ease-in-out;
  }  
  

</style>
