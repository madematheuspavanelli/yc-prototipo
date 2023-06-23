module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData:
          '@import "@/scss/_variables.scss"; @import "vue-select/src/scss/vue-select.scss"; @import "toastr/toastr.scss";'
      }
    }
  }
};
