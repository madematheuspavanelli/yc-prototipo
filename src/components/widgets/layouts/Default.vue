<template>
  <div class="h-screen flex flex-col py-9 px-11 font-sans max-h-screen">
    <header class="flex justify-between items-center mb-9 bg-white z-10">
      <button
        class="bg-youcheckin-yellow flex items-center active:scale-110 transition justify-center w-[100px] h-[60px] rounded"
        @click="goToPreviousPage"
      >
        <ArrowLeft />
      </button>
      <h2
        class="font-bold relative text-3xl after:w-[30px] after:h-0.5 after:bg-youcheckin-yellow after:absolute after:mx-auto after:inset-0 after:top-8"
      >
        {{ title }}
      </h2>
      <LanguageSelector color="#000" />
    </header>

    <main class="flex-1 transition" :style="{ transform: `translateY(-${verticalOffset}px)` }">
      <slot></slot>
    </main>

    <AppVirtualKeyboard />

    <footer class="flex justify-end fixed bottom-0 right-0 w-fit p-9">
      <button
        class="bg-youcheckin-yellow text-[26px] h-16 flex gap-5 items-center active:scale-110 transition justify-center py-[20px] px-[30px] leading-4 rounded font-medium disabled:bg-youcheckin-gray-light disabled:text-youcheckin-gray"
        @click="footerButtonAction"
        :disabled="!footerButtonEnabled"
      >
        {{ footerButtonLabel || $t("message.next") }}
        <ArrowLeft
          class="rotate-180 w-5 h-auto"
          :color="footerButtonEnabled ? '#2A2C2E' : '#979797'"
        />
      </button>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArrowLeft from "@/assets/icons/arrow-left.vue";
import LanguageSelector from "@/components/widgets/molecules/LanguageSelector.vue";
import AppVirtualKeyboard from "@/components/Base/AppVirtualKeyboard.vue";

export default {
  name: "DefaultLayout",
  components: {
    ArrowLeft,
    LanguageSelector,
    AppVirtualKeyboard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    footerButtonLabel: {
      type: String,
      required: false
    },
    footerButtonAction: {
      type: Function,
      default: () => {}
    },
    footerButtonEnabled: {
      type: Boolean,
      default: true
    },
    previousPageName: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapGetters(["verticalOffset"])
  },
  methods: {
    goToPreviousPage() {
      if (!this.previousPageName) return;

      this.$router.push({ name: this.previousPageName });
    }
  }
};
</script>
