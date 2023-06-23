<template>
  <b-card no-body bg-variant="dark">
    <b-form-group id="search-group" label="Buscar:" label-for="search">
      <b-form-input
        id="search"
        type="text"
        v-model="searchString"
        :placeholder="placeholder"
        @input="updateSearchHandler"
      ></b-form-input>
    </b-form-group>
  </b-card>
</template>

<script>
export default {
  name: "ListFilter",
  props: ["placeholder"],
  data() {
    return {
      searchString: "",
      searchTimer: null
    };
  },
  methods: {
    updateSearchHandler() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        clearTimeout(this.searchTimer);
        this.$emit("update-search", this.searchString);
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 10px 20px 20px 20px;

  .form-group {
    margin-bottom: 0;
  }
}
</style>
