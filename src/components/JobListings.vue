<script setup>
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import jobListing from "./jobListing.vue";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from "axios";
defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});
const state = ref({
  jobs: [],
  isLoading: true,
});

onMounted(async () => {
  try {
    //json-server local -check package.json -
    const response = await axios.get("/api/jobs");
    state.value.jobs = response.data;
  } catch (error) {
    console.error("error fetching jobs", error);
  } finally {
    state.value.isLoading = false;
  }
});
</script>


<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Gallery
      </h2>
      <!-- loading -->
      <div v-if="state.isLoading" class="text-center text-gray-600 py-6 "> <PulseLoader /> 
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <jobListing
          v-for="job in state.jobs.slice(0, limit || state.jobs.length)"
          :key="job.id"
         
          :job="job"
        />
      </div>
      <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
        <RouterLink
          to="/jobs"
          class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
          >View All Masterpieces
        </RouterLink>
      </section>
    </div>
  </section>
</template>
