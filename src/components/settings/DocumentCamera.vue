<template>
  <div class="face-camera">
    <WebcamModal
      storageProperty="documentCamera"
      title="message.documentCameraTitle"
      @toggleLoader="toggleLoader"
    />
  </div>
</template>
<script>
import WebcamModal from "@/components/settings/WebcamModal";
export default {
  name: "DocumentCamera",
  components: {
    WebcamModal
  },
  methods: {
    toggleLoader() {
      this.$emit("toggleLoader");
    }
  }
};
</script>
<style lang="scss" scoped></style>
