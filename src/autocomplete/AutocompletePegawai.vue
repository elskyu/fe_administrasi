<template>
    <div class="autocomplete">
      <input
        type="text"
        v-model="query"
        @input="onInput"
        @focus="isOpen = true"
        @blur="closeDropdown"
        placeholder="Search Pegawai"
      />
      <ul v-if="isOpen && filteredResults.length" class="autocomplete-results">
        <li
          v-for="(result, index) in filteredResults"
          :key="index"
          @mousedown.prevent="selectResult(result)"
        >
          {{ result.nama }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import api from '../../api';
  
  const props = defineProps({
    pegawaiList: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['select']);
  
  const query = ref('');
  const isOpen = ref(false);
  
  const filteredResults = computed(() => {
    if (!query.value) return [];
    return props.pegawaiList.filter((item) =>
      item.nama.toLowerCase().includes(query.value.toLowerCase())
    );
  });
  
  const onInput = () => {
    if (query.value) {
      isOpen.value = true;
    } else {
      isOpen.value = false;
    }
  };
  
  const selectResult = (result) => {
    query.value = result.nama;
    isOpen.value = false;
    emit('select', result);
  };
  
  const closeDropdown = () => {
    // Delay to allow the click event on the list item to be registered
    setTimeout(() => {
      isOpen.value = false;
    }, 200);
  };
  </script>
  
  <style scoped>
  .autocomplete {
    position: relative;
  }
  
  .autocomplete-results {
    position: absolute;
    border: 1px solid #ccc;
    background-color: white;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .autocomplete-results li {
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .autocomplete-results li:hover {
    background-color: #f0f0f0;
  }
  </style>
  