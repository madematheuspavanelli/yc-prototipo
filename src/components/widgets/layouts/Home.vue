<template>
  <div
    class="font-sans h-screen flex flex-col py-9 px-11 bg-black bg-[url(../assets/images/bg-hotel.png)] bg-cover bg-center"
  >
    <header class="flex justify-end items-center mb-9">
      <LanguageSelector color="#fff" />
    </header>

    <main class="flex-1">
      <slot></slot>
    </main>

    <footer class="flex flex-col items-center gap-6">
      <p class="text-white text-lg" v-text="$t('pages.home.footerMessage')"></p>
      <Youcheckin />
    </footer>
  </div>
</template>

<script>
import LanguageSelector from "@/components/widgets/molecules/LanguageSelector.vue";
import Youcheckin from "@/assets/icons/youcheckin-white.vue";

export default {
  name: "HomeLayout",
  components: {
    LanguageSelector,
    Youcheckin
  },
  data() {
    return {
      title: "Check-In"
    };
  }
};
</script>
