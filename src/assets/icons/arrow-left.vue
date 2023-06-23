<template>
  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24.3332 10H1.6665"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10.1665 18.5L1.6665 10L10.1665 1.5"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: "ArrowLeft",
  props: {
    color: {
      type: String,
      default: "#2A2C2E"
    }
  }
};
</script>
