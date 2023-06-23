<template>
  <div
    class="bg-youcheckin-gray-dark flex-col justify-center items-center flex absolute w-screen h-screen inset-0 z-20"
  >
    <Search />
    <p class="text-white mt-8 text-4xl">Procurando reserva...</p>
  </div>
</template>

<script>
import Search from "@/assets/icons/search.vue";

export default {
  name: "SuccessMessage",
  components: {
    Search
  }
};
</script>
