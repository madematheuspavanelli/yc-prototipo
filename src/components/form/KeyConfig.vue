<template>
  <app-page :pageTitle="$t('message.keyConfig')" variant="top-bottom" :isLoading="isLoading">
    <div class="content w-100">
      <img src="@/assets/youcheckin_logo_full.svg" height="80px" alt="" />
      <div class="span-group">
        <span> {{ $t("message.roomNumber") }} </span>
        <span> {{ roomNumber }} </span>
      </div>
      <div class="span-group">
        <span> {{ $t("message.numberNight") }} </span>
        <span> {{ numberNights }} </span>
      </div>
    </div>
    <div class="instructions-wrapper" v-show="showInstructions">
      <div class="modal-size instructions">
        <h2>{{ $t("message.keyRecordInstructions") }}</h2>
        <img src="@/assets/key_record_instructions.gif" />
      </div>
    </div>
    <div class="btn-container">
      <b-button @click="submit" variant="primary">{{ $t("message.next") }}</b-button>
    </div>
  </app-page>
</template>

<script>
import { getISOStringWithoutZoneDesignator } from "@/scripts/commonScripts";

export default {
  name: "KeyConfig",
  data() {
    return {
      isLoading: false,
      showInstructions: false,
      newCard: 0,
      magnetizeTries: 0,
      assaabloySettings: {
        credentials: {
          username: "sym",
          password: "sym"
        }
      }
    };
  },
  computed: {
    bookingData() {
      return this.$store.getters.getBookingData || {};
    },
    roomNumber() {
      return this.bookingData.roomNumber;
    },
    numberNights() {
      return this.bookingData.nightsCount;
    },
    startDate() {
      return this.bookingData.checkinDate;
    },
    endDate() {
      return this.bookingData.checkoutDate;
    },
    keyType() {
      return localStorage.getItem("settings.keyType");
    },
    initialInstructionsMessage() {
      return this.keyType === "rfid"
        ? this.$t("message.keyInstructions")
        : this.$t("message.keyInstructionsStripe");
    }
  },
  methods: {
    submit() {
      if (this.keyType === "magnetic" || this.keyType === "rfid") {
        this.showMagneticRecordInstructions();
      } else {
        this.isLoading = true;
      }
      setTimeout(() => {
        this.selectKeyFlow();
      }, 3000);
    },
    showMagneticRecordInstructions() {
      this.showInstructions = true;
    },
    selectKeyFlow() {
      switch (localStorage.getItem("settings.keySystem")) {
        case "dormakaba_atlas":
          this.dormakaba_atlas();
          break;
        case "assaabloy":
          this.assaabloy();
          break;
        case "onity":
          this.onity();
          break;
        case "saga":
          this.saga();
          break;
        case "orbita":
          this.orbita();
          break;
        case "omnitec":
          this.omnitec();
          break;
        default:
          this.isLoading = false;
      }
    },
    dormakaba_atlas() {
      let dataForKey = {
        room: this.roomNumber,
        startDate: this.formatDormakabaAtlasDate(this.startDate),
        endDate: this.formatDormakabaAtlasDate(this.endDate)
      };

      dataForKey = JSON.stringify(dataForKey);

      this.$API.key
        .dormakaba_atlas(dataForKey)
        .then(this.finishCheckin)
        .catch(this.handleMagnetizeError);
    },
    assaabloy() {
      this.createAssaabloiSession()
        .then(session => {
          const dataForKey = {
            doorOperations: [
              {
                doors: [this.roomNumber],
                operation: "guest"
              }
            ],
            expireTime: getISOStringWithoutZoneDesignator(this.endDate),
            format: "rfid48"
          };

          this.$API.key
            .assaabloy(dataForKey, session)
            .then(this.finishCheckin)
            .catch(this.handleMagnetizeError);
        })
        .catch(this.handleMagnetizeError);
    },
    createAssaabloiSession() {
      return new Promise((resolve, reject) => {
        this.$API.key
          .assaabloySession(this.assaabloySettings.credentials)
          .then(session => {
            resolve(session);
          })
          .catch(() => {
            reject();
          });
      });
    },
    onity() {
      let dataForKey = {
        cardQuantity: 1,
        encoderId: 1,
        rooms: [this.roomNumber],
        initialDate: this.formatOnityDate(this.startDate),
        expirationDate: this.formatOnityDate(this.endDate)
      };

      dataForKey = JSON.stringify(dataForKey);

      this.$API.key
        .onity(dataForKey)
        .then(this.finishCheckin)
        .catch(this.handleMagnetizeError);
    },
    formatOnityDate(date) {
      date = new Date(date);

      let hour =
        date.getHours().toString().length === 2
          ? date.getHours().toString()
          : "0" + date.getHours();
      let day =
        date.getDate().toString().length === 2 ? date.getDate().toString() : "0" + date.getDate();
      let month =
        (date.getMonth() + 1).toString() === 2
          ? (date.getMonth() + 1).toString()
          : "0" + (date.getMonth() + 1);
      let year = date
        .getFullYear()
        .toString()
        .substr(-2);

      return hour + day + month + year;
    },
    saga() {
      let dataForKey = {
        quantity: this.numberNights,
        room: this.roomNumber,
        startDate: this.startDate,
        endDate: this.endDate
      };

      dataForKey = JSON.stringify(dataForKey);

      this.$API.key
        .saga(dataForKey)
        .then(this.finishCheckin)
        .catch(this.handleMagnetizeError);
    },
    orbita() {
      let dataForKey = {
        room: this.roomNumber,
        startDate: this.formatOrbitaDate(this.startDate),
        endDate: this.formatOrbitaDate(this.endDate)
      };

      dataForKey = JSON.stringify(dataForKey);

      this.$API.key
        .orbita(dataForKey)
        .then(this.finishCheckin)
        .catch(this.handleMagnetizeError);
    },
    formatDormakabaAtlasDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${this.zeroPad(date.getMonth() + 1)}-${this.zeroPad(
        date.getDate()
      )}T${this.zeroPad(date.getHours())}:${this.zeroPad(date.getMinutes())}:00`;
    },
    formatOrbitaDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${this.zeroPad(date.getMonth() + 1)}-${this.zeroPad(
        date.getDate()
      )}T${this.zeroPad(date.getHours())}:${this.zeroPad(date.getMinutes())}:00`;
    },
    formatOmnitecDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${this.zeroPad(date.getMonth() + 1)}-${this.zeroPad(
        date.getDate()
      )}T${this.zeroPad(date.getHours())}:${this.zeroPad(date.getMinutes())}:00`;
    },
    omnitec() {
      let dataForKey = {
        quantity: 1,
        room: this.roomNumber,
        startDate: this.formatOmnitecDate(this.startDate),
        endDate: this.formatOmnitecDate(this.endDate)
      };

      dataForKey = JSON.stringify(dataForKey);

      this.$API.key
        .omnitec(dataForKey)
        .then(this.finishCheckin)
        .catch(this.handleMagnetizeError);
    },
    zeroPad(d, length = 2) {
      return ("" + d).padStart(length, "0");
    },
    displayInstructions() {
      this.$alert(
        "",
        this.$t("message.keyRecord"),
        this.initialInstructionsMessage,
        "",
        require("@/assets/key_record_new.gif")
      );
    },
    displayInsertInstructions() {
      this.$alert(
        "",
        this.$t("message.keyRecord"),
        this.initialInstructionsMessage,
        "",
        require("@/assets/key_record_new.gif")
      );
    },
    finishCheckin() {
      this.$router.push({ name: "EndCheckin" });  
    },
    handleMagnetizeError() {
      if (this.magnetizeTries < 3) {
        this.magnetizeTries += 1;
        if (this.keyType === "magnetic") {
          this.$alert("warning", this.$t("alert.tryAgain")).then(this.submit);
        } else {
          setTimeout(this.submit, 5000);
        }
        return;
      }
      this.showInstructions = false;
      this.isLoading = false;
      this.$alert("warning", this.$t("alert.magnetizeFail"), "", "", "").then(this.finishCheckin);
    }
  },
  mounted() {
    this.displayInstructions();
  }
};
</script>
<style lang="scss" scoped>
.content {
  border: 2px solid $yckLightGrey;
  border-radius: 20px;
  padding: 20px 40px 40px 40px;

  img {
    width: 50%;
    margin: 0 auto;
  }

  .span-group {
    width: 50%;
    margin: 0 auto;

    &:first-of-type {
      margin-bottom: 20px;
    }

    span {
      display: block;
      font-size: 14px;

      &:last-child {
        border-bottom: 1px solid $yckLightGrey;
        padding: 5px 20px;
      }
    }
  }
}

.instructions-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;
  z-index: 6;

  .modal-size {
    max-width: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .instructions {
    background-color: $yckYellow;
    padding: 20px;
    border-radius: 10px;

    h2 {
      color: $black;
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }

    img {
      width: 300px;
    }
  }
}
</style>
