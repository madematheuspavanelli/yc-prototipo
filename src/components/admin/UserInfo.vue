<template>
  <div>
    <div class="details-box">
      <div class="print-images" data-purpose="print">
        <div class="img-holder" :data-ignore-on-print="!hasPhoto">
          <span>Foto do hóspede</span>
          <img :src="data.photo || placeholder" :alt="data.name" />
        </div>
        <div class="img-holder" :data-ignore-on-print="!hasDocumentImage">
          <span>Foto do documento</span>
          <img :src="data.documentImage || documentPlaceholder" :alt="$t('message.invoiceDoc')" />
        </div>
      </div>
      <div class="guest-photo" data-ignore-on-print="true">
        <img :src="data.photo || placeholder" :alt="data.name" />
      </div>
      <div class="guest-info">
        <div class="info-item">
          <label>CPF:</label>
          <span>{{ data.cpfFormated }}</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>{{ data.email }}</span>
        </div>
        <div class="info-item">
          <label>{{ $t("message.phone") }}:</label>
          <span>{{ data.phone | formatReadonlyPhone }}</span>
        </div>
        <div class="info-item">
          <label>{{ $t("message.birthDate") }}:</label>
          <span>{{ dateFilter(data.birthdate) }}</span>
        </div>
        <div class="info-item address">
          <label>{{ $t("message.address") }}</label>
          <span>{{ fullAddress }}</span>
        </div>
      </div>
    </div>
    <div class="attachment-list">
      <div class="attachment" data-ignore-on-print="true">
        <h2 class="title">
          {{ $t("message.invoice") }}
        </h2>
        <div v-if="data.invoiceImage" class="details-box document">
          <img :src="data.invoiceImage" :alt="$t('message.invoice')" />
        </div>
        <div v-else class="details-box">
          <img :src="invoicePlaceholder" :alt="$t('message.invoice')" />
        </div>
      </div>

      <div class="attachment" data-ignore-on-print="true">
        <h2 class="title">
          {{ $t("message.invoiceDoc") }}
        </h2>
        <div v-if="data.documentImage" class="details-box document">
          <img :src="data.documentImage" :alt="$t('message.invoiceDoc')" />
        </div>
        <div v-else class="details-box">
          <img :src="documentPlaceholder" :alt="$t('message.invoiceDoc')" />
        </div>
      </div>

      <div class="attachment" :data-ignore-on-print="!hasSignature">
        <h2 class="title">
          {{ $t("message.signature") }}
        </h2>
        <div class="details-box bg-white">
          <img :src="data.signatureImage || signaturePlaceholder" :alt="$t('message.signature')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatReadonlyPhone } from "@/scripts/commonScripts";

export default {
  name: "UserInfo",
  props: {
    data: {
      required: true,
      default: {}
    }
  },
  computed: {
    fullAddress() {
      const {
        street = "",
        number = "",
        complement = "",
        neighborhood = "",
        city = "",
        state = "",
        cep = ""
      } = (this.data || {}).address || {};
      let fullAddress = street;

      if (typeof number !== "undefined" && number !== null) {
        fullAddress = `${fullAddress}, ${number}`;
      }

      if (typeof complement !== "undefined" && complement !== null) {
        fullAddress = `${fullAddress}, ${complement}`;
      }

      if (typeof neighborhood !== "undefined" && neighborhood !== null) {
        fullAddress = `${fullAddress}, ${neighborhood}`;
      }

      if (typeof city !== "undefined" && city !== null) {
        fullAddress = `${fullAddress}, ${city}`;
      }

      if (typeof state !== "undefined" && state !== null) {
        fullAddress = `${fullAddress} - ${state}`;
      }

      if (typeof cep !== "undefined" && cep !== null) {
        fullAddress = `${fullAddress} - ${cep}`;
      }
      return fullAddress || "-";
    },
    placeholder() {
      return require("@/assets/defaultImages/user.svg");
    },
    documentPlaceholder() {
      return require("@/assets/defaultImages/id_card.svg");
    },
    invoicePlaceholder() {
      return require("@/assets/defaultImages/invoice.svg");
    },
    signaturePlaceholder() {
      return require("@/assets/defaultImages/signature.svg");
    },
    hasSignature() {
      return this.data.signatureImage !== null;
    },
    hasPhoto() {
      return this.data.photo !== null;
    },
    hasDocumentImage() {
      return this.data.documentImage !== null;
    }
  },
  methods: {
    dateFilter(value) {
      if (!value) {
        return "-";
      }
      return this.$d(new Date(value), "short");
    },
    downloadSignature() {
      const link = document.createElement("a");
      link.href = this.data.signatureImage;
      link.target = "_blank";
      link.download = "Signature";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  filters: {
    formatReadonlyPhone
  }
};
</script>

<style lang="scss" scoped>
.details-box {
  padding: 20px 25px 0 25px;
  background-color: $yckLightGrey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  .guest-info {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 20px;

    label {
      font-size: 1.4rem;
      color: $background;
      margin-bottom: 0.5rem;
    }

    span {
      font-size: 1.6rem;
      color: $background;
      margin-bottom: 0;
      word-break: break-word;
    }
  }

  .guest-photo {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.document {
    img {
      transform: rotate(180deg);
    }
  }

  img {
    width: 100%;
    min-width: 100%;
  }
}

.attachment {
  .title {
    color: $white;
    font-size: 2rem;
    margin: 20px 0;
  }

  .details-box {
    padding: 20px 25px 20px 25px;
    position: relative;
    height: 300px;

    button {
      position: absolute;
      right: 5px;
      top: 10px;
    }

    img {
      width: auto;
      min-width: unset;
      height: 100%;
      margin: 0 auto;
    }

    &.bg-white {
      background: $white;
    }
  }
}

[data-purpose="print"] {
  display: none;
}

@media screen and (min-width: 992px) {
  .details-box {
    flex-direction: row;

    .info-item {
      width: calc((100% - 10px) / 2);
      margin-right: 10px;

      &:nth-child(2n) {
        margin-right: 0;
      }

      &.address {
        width: 100%;
        margin-right: 0;
      }
    }

    .guest-photo {
      width: 250px;
      margin-right: 20px;
    }
  }

  .attachment-list {
    display: flex;

    .attachment {
      width: calc((100% - 20px) / 2);

      &:first-child {
        margin-right: 20px;
      }
    }
  }
}

@media screen and (min-width: 1200px) {
}

@media screen and (min-width: 1600px) {
  .details-box {
    .info-item {
      width: calc((100% - 30px) / 4);
      margin-right: 10px;

      &:nth-child(2n) {
        margin-right: 10px;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }

    .guest-photo {
      width: 300px;
    }
  }
}

@media print {
  .details-box {
    padding: 0;
    margin-top: 50px;

    .print-images {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 50px;

      .img-holder {
        width: calc((100% - 50px) / 2);
        display: flex;
        flex-direction: column;

        &:first-child {
          margin-right: 50px;
        }

        span {
          font-size: 20px;
          margin-bottom: 30px;
          color: $black;
        }

        img {
          min-width: unset;
          width: auto;
          max-width: 100%;
          margin: 0;
        }
      }
    }

    .info-item {
      label {
        font-size: 16px;
        color: $black;
      }

      span {
        font-size: 18px;
        color: $black;
      }
    }
  }
  .attachment {
    margin-top: 50px;

    .title {
      color: $black;
      font-size: 20px;
      margin-bottom: 30px;
      margin-top: 0;
    }
  }
}
</style>
