<script setup>
import { ref } from 'vue';
import axios from 'axios';
import '../style/login.css'; // Import specific CSS file for the login component
import '../style/font.css';


import imageSrc from '../images/login_icon.svg';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
//   if (password.value !== confirmPassword.value) {
//     alert('Passwords do not match');
//     return;
//   }

  try {
    const response = await axios.post('http://localhost:8000/api/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });

    if (response.data.success) {
      alert('Registration successful');
      // Handle redirection to login or any other page upon successful registration
    } else {
      alert(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>

<template>
    <div class="login-container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">              
                    <div class="card-body">
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
                            <button type="submit" class="btn btn-primary">LOGIN</button>
                        </form>
                    </div>
            </div>
        </div>
        <svg class="background-svg" width="501" height="433" viewBox="0 0 501 433" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M167.764 53.3929C79.2472 61.7489 19.0394 -4.05405 0 -38L564 -35.7152V433H501.007C305.957 408.193 338.792 309.293 379.59 262.944C403.417 230.412 446.5 152.032 428.222 98.763C405.375 32.1767 278.41 42.948 167.764 53.3929Z" fill="#F6DCAC"/>
      </svg>
      <svg class="background-svg2" width="182" height="181" viewBox="0 0 204 203" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M204 205C204 91.7816 112.442 0 -0.5 0C-113.442 0 -205 91.7816 -205 205C-205 318.218 -113.442 410 -0.5 410C112.442 410 204 318.218 204 205Z" fill="#F6DCAC"/>
        <path d="M164 205C164 292.261 89.9031 363 -1.5 363C-92.9031 363 -167 292.261 -167 205C-167 117.739 -92.9031 47 -1.5 47C89.9031 47 164 117.739 164 205Z" fill="#FEAE6F"/>
        </svg>

    </div>
</template>
