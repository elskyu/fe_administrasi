<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import '/src/style/font.css';
import '/src/style/background_color.css';
import '/src/style/modal.css';
import '/src/style/dasboard.css';
import '/src/style/table.css';
import '/src/style/loading.css';
import '/src/style/surat_masuk.css';

const showProfileModal = ref(false);

</script>

<template>
    <div v-if="showProfileModal" class="modal card-profil">
        <div class="modal-profil">

            <div class="upper">
                <img src="" class="img-fluid">
            </div>
            <div class="user text-center">
                <div class="profile">
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="rounded-circle" width="180">
                </div>
            </div>
            <div class="text-center" style="margin-top: 65px;">
                <h5 class="mb-0">Pegawai 1</h5>
                <span class="text-profil">Back End Developer, Sidoarjo</span>
                <span class="text-profil d-block mb-2">Nip. 9876543</span>
                <div class="button-group-vertical">
                    <button class="btn-ubah-password">Ubah Password</button>
                    <button @click="showProfileModal = false" class="btn-batal-ubah-password">Batal</button>
                </div>
            </div>
        </div>
    </div>
</template>