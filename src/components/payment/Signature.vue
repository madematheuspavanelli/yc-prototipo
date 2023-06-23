<template>
  <app-page
    :pageTitle="$t('message.signature')"
    variant="top-bottom"
    :showRequired="false"
    :isLoading="isLoading"
  >
    <div class="content w-100">
      <canvas
        ref="canvas"
        @mousedown="startDrawingHandler"
        @mousemove="drawHandler"
        @mouseout="stopDrawingHandler"
        @mouseup="stopDrawingHandler"
        @touchstart="touchStartHandler"
        @touchmove="touchHandler"
        @touchend="touchStopHandler"
      ></canvas>
      <hr class="guide-line" />
    </div>
    <div class="btn-container">
      <b-button class="btn-border" @click="resetCanvas">{{ $t("message.cleanBtn") }}</b-button>
      <b-button @click="confirmSignatureHandler" variant="primary">{{
        $t("message.next")
      }}</b-button>
    </div>
  </app-page>
</template>

<script>
export default {
  name: "Signature",
  data() {
    return {
      isLoading: false,
      hasCard: false,
      isDrawing: false,
      ctx: null,
      lastX: 0,
      lastY: 0
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    totalValueToPay() {
      return this.$store.getters.bookingInvoiceValue;
    },
    shouldPayOnCheckin() {
      return (this.$store.getters.getBookingData || {}).shouldPayOnCheckin || false;
    },
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    }
  },
  methods: {
    setupCanvas() {
      this.ctx = this.$refs.canvas.getContext("2d");
      this.$refs.canvas.width = 800;
      this.$refs.canvas.height = 180;
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = "#000";
    },
    startDrawingHandler(e) {
      this.isDrawing = true;
      [this.lastX, this.lastY] = [e.offsetX * 1, e.offsetY * 1];
    },
    drawHandler(e) {
      if (!this.isDrawing) {
        return;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(e.offsetX * 1, e.offsetY * 1);
      this.ctx.stroke();
      [this.lastX, this.lastY] = [e.offsetX * 1, e.offsetY * 1];
    },
    stopDrawingHandler() {
      this.isDrawing = false;
    },
    touchStartHandler(e) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.$refs.canvas.dispatchEvent(mouseEvent);
    },
    touchHandler(e) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.$refs.canvas.dispatchEvent(mouseEvent);
    },
    touchStopHandler() {
      const mouseEvent = new MouseEvent("mouseup");
      this.$refs.canvas.dispatchEvent(mouseEvent);
    },
    resetCanvas() {
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    },
    confirmSignatureHandler() {
      const warnMessage = this.isDoingCheckin
        ? "alert.signatureRequiredCheckin"
        : "alert.signatureRequiredCheckout";
      const canvas = this.$refs.canvas;
      const value = canvas.toDataURL("image/png");
      const params = {
        bookingId: this.bookingId,
        signature: value
      };

      if (this.isCanvasBlank(canvas)) {
        return this.$swal.fire({
          title: this.$t(warnMessage),
          icon: "info",
          width: 500,
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          allowOutsideClick: false,
          iconColor: "black",
          background: "#ffd400"
        });
      }

      this.isLoading = true;

      this.$API.users
        .registerSignature(this.userId, params)
        .then(() => {
          if (this.isDoingCheckin) {
            return this.$router.push({ name: "DataConfirmation" });
          }

          if (!this.totalValueToPay) {
            return this.$router.push({ name: "CheckoutPage" });
          }

          return this.$router.push({ name: this.hasACard ? "SavedCard" : "CardRegistration" });
        })
        .catch(() => {
          this.$alert("error", this.$t("alert.reserveNotFoundSub"));
          this.isLoading = false;
        });
    },
    isCanvasBlank(canvas) {
      const context = canvas.getContext("2d");

      const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
      );

      return !pixelBuffer.some(color => color !== 0);
    },
    async loadCard() {
      this.isLoading = true;

      await this.$API.users
        .getCard(this.userId)
        .then(() => {
          this.hasACard = true;
        })
        .catch(() => {
          this.hasACard = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.setupCanvas();

    if (!this.isDoingCheckin) {
      this.loadCard();
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  align-items: center;
  position: relative;
  justify-content: center;
}

.guide-line {
  width: 700px;
  border-top: 2px solid black;
  position: absolute;
  margin-top: 150px;
}

canvas {
  border: 1px solid lightgrey;
}
</style>
