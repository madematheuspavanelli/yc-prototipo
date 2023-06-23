<template>
  <div>
    <div class="title">
      <span class="required">{{ $t(title) }}</span>
    </div>
    <div class="input-group" :class="{ 'justify-start': justifyStart }">
      <div class="radio-group">
        <input
          type="radio"
          :id="symptomn + '-yes'"
          value="1"
          :checked="value && value !== null"
          @click="toggleChecked"
        />
        <label :for="symptomn + '-yes'">{{ $t("message.yes") }}</label>
      </div>
      <div class="radio-group">
        <input
          type="radio"
          :id="symptomn + '-no'"
          value=""
          :checked="!value && value !== null"
          @click="toggleChecked"
        />
        <label :for="symptomn + '-no'">{{ $t("message.no") }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RadioGroup",
  props: {
    title: {
      type: String
    },
    symptomn: {
      type: String
    },
    size: {
      type: String,
      default: "large"
    },
    value: {
      type: Boolean
    },
    justifyStart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    toggleChecked(event) {
      const params = { symptomn: this.$props.symptomn, value: !!event.target.value };
      this.$emit("onChange", params);
    }
  }
};
</script>

<style lang="scss" scoped>
.border-top {
  border-top: 2px solid $yckLightGrey;
}

.small {
  display: flex;

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
  }

  .title {
    margin-top: 6px;

    span {
      font-size: 14px;
      text-align: center;
    }
  }

  .input-group {
    .radio-group {
      input {
        vertical-align: middle;
      }

      input:checked {
        background-color: $yckLightGrey;
      }

      label {
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }
}

.title {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  max-width: 700px;
  display: flex;

  span {
    font-size: 1.6rem;
    text-align: center;
  }
}

.input-group {
  display: flex;
  justify-content: space-around;

  &.justify-start {
    justify-content: flex-start;

    .radio-group:first-child {
      margin-right: 30px;
      margin-left: 0;
    }
  }

  .radio-group {
    display: flex;
    align-items: center;
    margin-left: 10px;

    input {
      vertical-align: middle;
      margin-bottom: 10px;
      margin-top: 10px;
      padding: 0px 8px;
    }

    input:checked {
      background-color: $yckLightGrey;
    }

    label {
      margin-left: 5px;
      font-size: 1.6rem;
      margin-bottom: 0;
    }
  }
}
</style>
