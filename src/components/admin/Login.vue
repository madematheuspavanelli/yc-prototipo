<template>
  <div>
    <div class="checks animation-two">
      <img src="@/assets/icons/you.svg" alt="you" class="you" />
      <img src="@/assets/icons/check-animation.svg" alt="check sign" class="check-one check" />
      <img
        src="@/assets/icons/check-animation.svg"
        alt="check sign"
        class="check-two check animation-one"
      />
      <img
        src="@/assets/icons/check-animation.svg"
        alt="check sign"
        class="check-three check animation-one"
      />
      <img src="@/assets/icons/checkin.svg" alt="checkin" class="checkin" />
    </div>
    <b-card class="form" bg-variant="dark" no-body>
      <h1>{{ $t("message.adminTitle") }}</h1>
      <b-form @submit.prevent="submitHandler">
        <b-form-group id="email-group" :label="`${$t('message.email')} :`" label-for="email">
          <b-form-input
            id="email"
            type="email"
            v-model="form.email"
            :placeholder="$t('message.email')"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="pwd-group" :label="`${$t('message.password')} :`" label-for="pwd">
          <b-form-input
            id="pwd"
            type="password"
            minlength="6"
            maxlength="20"
            required
            v-model="form.password"
            :placeholder="$t('message.password')"
          ></b-form-input>
        </b-form-group>
        <b-button variant="primary" type="submit">{{ $t("message.login") }}</b-button>
      </b-form>
    </b-card>
    <app-loader v-if="isLoading" />
  </div>
</template>
<script>
import { setToken } from "@/libs/axios";

export default {
  name: "Login",
  data() {
    return {
      isLoading: false,
      form: {
        email: null,
        password: null
      }
    };
  },
  methods: {
    submitHandler() {
      this.isLoading = true;
      const params = { ...this.form };
      params.refreshToken = null;
      this.$API.admin
        .login(params)
        .then(response => {
          const { jwtToken } = response.data;
          this.$store.dispatch("SET_TOKEN", { value: jwtToken });
          setToken(this, jwtToken);
          this.$router.push({ name: "AdminContent" });
        })
        .catch(() => {
          this.$alert("error", this.$t("alert.tryAgain"));
          this.isLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  color: $white;
  font-size: 20px;
  margin-bottom: 20px;
  margin-top: 0;
}

.form {
  display: flex;
  flex-direction: column;
  width: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  animation-name: slide-up-form;
  animation-delay: 2.65s;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  transform: translate(-50%, -50%);
  opacity: 0;
  min-width: 215px;
  max-width: 400px;
  padding: 30px 40px 40px 40px;

  .btn {
    width: 100%;
    margin-top: 20px;
  }
}

.checks {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 50%;
  top: -60px;
  transform: translate(-50%);
  animation-fill-mode: forwards;
  max-width: 400px;

  &.animation-two {
    animation-name: start-decreasing;
    animation-duration: 1.2s;
    animation-delay: 0.9s;
    animation-fill-mode: forwards;
  }

  .check {
    position: absolute;
    width: 30%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation-fill-mode: forwards;

    &.check-one {
      z-index: 3;
    }

    &.check-two {
      z-index: 2;

      &.animation-one {
        animation-name: slide-up-check-two;
        animation-delay: 0.4s;
        animation-duration: 0.5s;
      }
    }

    &.check-three {
      z-index: 1;

      &.animation-one {
        animation-name: slide-up-check-three;
        animation-delay: 0.4s;
        animation-duration: 0.5s;
      }
    }
  }

  .you {
    position: absolute;
    transform: translate(97%, -52%) scale(2.3);
    opacity: 0;
    animation-fill-mode: forwards;
    animation-name: slide-you;
    animation-delay: 2s;
    animation-duration: 0.7s;
    top: 50%;
    left: 0;
  }

  .checkin {
    position: absolute;
    transform: translate(-95%, -52%) scale(2.3);
    animation-fill-mode: forwards;
    top: 50%;
    left: 0;
    animation-name: slide-checkin;
    animation-delay: 2.3s;
    animation-duration: 0.7s;
    opacity: 0;
  }
}

@keyframes slide-up-check-two {
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -70%);
  }
}

@keyframes slide-up-check-three {
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -90%);
  }
}

@keyframes start-decreasing {
  0% {
    transform: translateX(-50%) scale(1) translateY(0%);
  }
  50% {
    transform: translateX(-50%) scale(0.3) translateY(0%);
  }
  75% {
    transform: translateX(-50%) scale(0.3) translateY(-70%);
  }
  100% {
    transform: translateX(-60.5%) scale(0.3) translateY(-70%);
  }
}

@keyframes slide-you {
  0% {
    transform: translate(97%, -52%) scale(2.3);
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    transform: translate(35%, -52%) scale(2.3);
    opacity: 1;
  }
}

@keyframes slide-checkin {
  0% {
    transform: translate(-95%, -52%) scale(2.3);
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    transform: translate(35%, -52%) scale(2.3);
    opacity: 1;
  }
}

@keyframes slide-up-form {
  0% {
    transform: translate(-50%, -15%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -35%);
    opacity: 1;
  }
}

@media screen and (min-width: 768px) {
  .form {
    width: 50%;
  }
  .checks {
    max-width: 500px;
  }
}

@media screen and (min-width: 992px) {
  .checks {
    max-width: 600px;
  }
}

@media screen and (min-width: 1200px) {
  .checks {
    max-width: 800px;
  }
}
</style>
