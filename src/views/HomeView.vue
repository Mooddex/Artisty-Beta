<script setup>
import JobListings from '@/components/JobListings.vue';
import Hero from '@/components/Hero.vue';
import HomeCards from '@/components/HomeCards.vue';
</script>
<template>
 <Hero subName=' Find Masterpieces you like or Put on some of your own' title="Become the next Dafencii" />
  <HomeCards />
  <JobListings :limit="3" :showButton="true" />
</template>