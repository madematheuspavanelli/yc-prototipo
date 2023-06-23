<template>
  <div class="message-safe">
    <div>
      <img src="@/assets/icons/security.svg" class="security-icon" />
      <strong>{{ $t("message.safeEnvironment") }} </strong>
    </div>
    <div class="custom">
      <p>Fique tranquilo, pois seus dados não serão armazenados.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-safe {
  width: 275px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  margin-left: -5px;
}

.security-icon {
  width: 25px;
  height: 30px;
}

strong {
  font-size: 14px;
  font-weight: normal;
}

.custom {
  margin-left: 5px;

  p {
    font-weight: 500;
    font-size: 11px;
  }
}
</style>
