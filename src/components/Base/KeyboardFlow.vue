<template>
  <div>
    <slot v-bind:nextFieldHandler="nextFieldHandler"></slot>
  </div>
</template>
<script>
export default {
  name: "KeyboardFlow",
  methods: {
    nextFieldHandler($nextFieldRef) {
      if (!$nextFieldRef) {
        this.$emit("done");
        return;
      }
      const $popperRef = $nextFieldRef.$refs.popper;

      if (typeof $popperRef !== "undefined") {
        // this case was handled like that because the component API did not provided a way
        // of opening the popped element programmatically. Feel free to check a
        // new version was published that enables it,
        // or you can also get the source and add the feature yourself
        $popperRef.doShow();
        $popperRef.setFlowLock();
        return;
      }

      const $flowRef = $nextFieldRef.$refs.flow_target;

      if (typeof $flowRef !== "undefined") {
        this.$nextTick(() => {
          $flowRef.$refs.toggle.dispatchEvent(new Event("mousedown"));
        });
      }
    }
  }
};
</script>
