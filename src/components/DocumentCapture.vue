<template>
  <div class="document-capture pos-r">
    <BackButton :isWhite="true" />
    <video
      id="video"
      :class="{ blur: isLoading }"
      ref="video"
      src="#"
      autoplay
      muted
      playsinline
    ></video>
    <div class="image-preview">
      <canvas ref="canvas"></canvas>
    </div>
    <img src="@/assets/docMask.svg" class="mask " />
    <!-- <FaceMask class="face-mask" :class="{ blur: isLoading }" /> -->
    <div class="instructions" :class="{ blur: isLoading }">
      <span class="instructions-intro">{{ $t("message.takeDocumentPicture") }}</span>
      <div v-for="(instruction, index) in instructions" :key="index" class="instruction-wrapper">
        <div class="instruction-index">{{ index + 1 }}</div>
        <span class="instruction">{{ $t(instruction) }}</span>
      </div>
    </div>
    <img
      v-if="stream !== null"
      class="take-photo"
      :class="{ blur: isLoading }"
      src="@/assets/ic_photo.svg"
      alt="Camera icon"
      @click="takeScreenShot"
    />
    <transition name="fade">
      <Loader v-show="isLoading" />
    </transition>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "DocumentCapture",
  components: {
    BackButton,
    Loader
  },
  props: ["isLoading", "videoPlayStatus"],
  data() {
    return {
      instructions: ["message.faceSide", "message.frameDoc", "message.removePlastic"],
      cameraId: null,
      stream: null,
      photoUrl: null
    };
  },
  computed: {
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    }
  },
  methods: {
    initCamera() {
      // if (this.isDoingCheckin) {
      const cameraId = localStorage.getItem("documentCamera");
      if (!cameraId) {
        this.$router.push({ name: "ErrorConfig" });
        return;
      }
      this.cameraId = cameraId;
      this.getStream();
      // }
    },
    getStream() {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: this.cameraId
            },
            width: 720,
            height: 480
          }
        })
        .then(async data => {
          await this.streamConnectedHandler(data);
        })
        .catch(() => {});
    },
    streamConnectedHandler(stream) {
      this.stream = stream;
      this.$refs.video.srcObject = stream;
      this.$emit("stream-connected");
    },
    takeScreenShot() {
      this.startProcessingPicture();
    },
    startProcessingPicture() {
      this.$emit("start-processing");
      this.photoUrl = null;
      this.processPicture();
    },
    processPicture() {
      this.$refs.canvas.width = this.$refs.video.videoWidth;
      this.$refs.canvas.height = this.$refs.video.videoHeight;
      this.$refs.canvas
        .getContext("2d")
        .drawImage(
          this.$refs.video,
          this.$refs.canvas.width / 4,
          0,
          this.$refs.canvas.width / 2,
          this.$refs.canvas.height,
          this.$refs.canvas.width / 4,
          0,
          this.$refs.canvas.width / 2,
          this.$refs.canvas.height
        );
      this.finishProcessingPicture();
    },
    finishProcessingPicture() {
      const imageData = this.$refs.canvas.toDataURL("image/png");
      this.$emit("finish-processing", imageData);
    }
  },
  watch: {
    videoPlayStatus() {
      if (this.videoPlayStatus) {
        this.$refs.video.play();
      } else {
        this.$refs.video.pause();
      }
    }
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.stream !== null) {
      this.stream.getTracks()[0].stop();
    }
  }
};
</script>

<style lang="scss" scoped>
.blur {
  filter: blur(8px);
}

.document-capture {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: black;

  .modal {
    position: absolute;
  }

  .mask,
  .instructions,
  .take-photo {
    position: absolute;
  }

  .image-preview {
    display: none;
  }

  #video {
    height: 115%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50.1%) rotate(180deg);
  }

  .take-photo {
    width: 7rem;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    cursor: pointer;
  }

  .mask {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }

  .instructions {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: 2;

    .instructions-intro {
      font-size: 2.14rem;
      color: $white;
      margin-bottom: 1.5rem;
    }

    .instruction-wrapper {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }

      .instruction-index {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        width: 30px;
        height: 30px;
        border: 1px solid $white;
        font-size: 1.3rem;
        color: $white;
      }

      .instruction {
        color: white;
        margin-left: 1rem;
        font-size: 2rem;
      }
    }
  }
}
</style>
