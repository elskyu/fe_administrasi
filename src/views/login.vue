<script setup>
import { ref } from 'vue';
import axios from 'axios';
import '../style/login.css'; // Import specific CSS file for the login component

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
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <h4 class="login-card-title text-center mb-4">LOGIN</h4>
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" v-model="email" autocomplete="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="password" autocomplete="current-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">LOGIN</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
