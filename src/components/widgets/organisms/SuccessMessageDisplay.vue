<template>
  <div
    class="bg-youcheckin-green flex-col justify-center items-center flex absolute w-screen h-screen inset-0 z-20"
  >
    <Check />
    <p class="text-white mt-8 text-4xl">Reserva encontrada!</p>
  </div>
</template>

<script>
import Check from "@/assets/icons/check.vue";

export default {
  name: "SuccessMessage",
  components: {
    Check
  }
};
</script>
