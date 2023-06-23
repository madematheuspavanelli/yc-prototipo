<template>
  <DocumentCapture
    :isLoading="isLoading"
    :videoPlayStatus="videoPlayStatus"
    @stream-connected="streamConnectedHandler"
    @start-processing="startProcessing"
    @finish-processing="submitDocumentHandler"
  />
</template>

<script>
import DocumentCapture from "@/components/DocumentCapture.vue";

export default {
  name: "DocumentPage",
  components: {
    DocumentCapture
  },
  data() {
    return {
      isLoading: false,
      videoPlayStatus: false
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    streamConnectedHandler() {
      this.videoPlayStatus = true;
    },
    startProcessing() {
      this.isLoading = true;
      this.videoPlayStatus = false;
    },
    submitDocumentHandler(data) {
      this.$store.dispatch("SET_DOCUMENT_DATA", { value: data });
      this.documentSubmittedHandler();
    },
    documentSubmittedHandler() {
      this.$router.push({ name: "PersonalForm" });
    }
  }
};
</script>
