<template>
  <label class="switch">
    <input type="checkbox" :checked="checked" @change="toggle" />
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  name: "Slider",
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: false
    };
  },
  mounted() {
    this.status = this.checked;
  },
  methods: {
    toggle() {
      this.status = !this.status;
      this.$emit("change", this.status);
    }
  }
};
</script>

<style>
.switch {
  @apply relative inline-block w-12 h-6;
}

.switch input {
  @apply opacity-0 w-0 h-0;
}

.slider {
  @apply cursor-pointer absolute inset-0 bg-[#ccc];
}

.slider:before {
  content: "";
  @apply h-4 w-4 absolute left-1 bottom-1 bg-white transition-all duration-300;
}

input:checked + .slider {
  @apply bg-youcheckin-blue;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  @apply translate-x-6;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
