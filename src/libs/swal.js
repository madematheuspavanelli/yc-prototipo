export function swal(type, title, subtitle, config = {}, imageUrl) {
  const settings = {
    icon: type,
    imageUrl: imageUrl,
    imageHeight: "150",
    title: title,
    cancelButtonColor: "black",
    confirmButtonColor: "black",
    iconColor: "black",
    background: "#ffd400"
  };

  if (subtitle) {
    settings.text = subtitle;
  }

  const completeSettings = { ...settings, ...config };

  // virtual keyboard fade time causes swal to close, the timeout stops this behavior, and its placed here globally due to the large use of the virtual keyboard in the application

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      this.$swal(completeSettings)
        .then(resolve)
        .catch(reject);
    }, 200);
  });
}
