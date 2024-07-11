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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
                                <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd"/>
                            </svg>
                            <input type="email" placeholder="username" class="form-control" id="email" v-model="email" autocomplete="email" required>
                        </div>
                        <div class="mb-3 input-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
                                <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd"/>
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
