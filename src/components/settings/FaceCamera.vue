<template>
  <div class="face-camera">
    <WebcamModal
      storageProperty="faceCamera"
      title="message.faceCameraTitle"
      @toggleLoader="toggleLoader"
    />
  </div>
</template>
<script>
import WebcamModal from "@/components/settings/WebcamModal";
export default {
  name: "FaceCamera",
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
