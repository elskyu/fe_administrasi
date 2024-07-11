<script setup>
import { ref } from 'vue';
import axios from 'axios';
import '../style/login.css';
import '../style/font.css';
import InputText from 'primevue/inputtext';
import imageSrc from '../images/login_icon.svg';

const email = ref('');
const password = ref('');
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.success) {
      alert('Login successful');
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
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon" >
                            <path d="M18.5,0H5.5A5.506,5.506,0,0,0,0,5.5v13A5.506,5.506,0,0,0,5.5,24h13A5.506,5.506,0,0,0,24,18.5V5.5A5.506,5.506,0,0,0,18.5,0ZM21,18.5A2.5,2.5,0,0,1,18.5,21H18V20A6,6,0,0,0,6,20v1H5.5A2.5,2.5,0,0,1,3,18.5V5.5A2.5,2.5,0,0,1,5.5,3h13A2.5,2.5,0,0,1,21,5.5Z"></path>
                            <circle cx="12" cy="8.5" r="3.5"></circle>
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
    </div>
</template>
