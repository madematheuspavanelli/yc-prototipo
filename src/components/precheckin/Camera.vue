<template>
  <div class="camera-holder">
    <BackButton :isWhite="true" useCustomClick @click="closeHandler" />
    <img ref="capture" class="capture" :class="{ doc: isDoc }" :src="imageData" v-if="hasCapture" />
    <video autoplay="true" ref="video" :class="{ doc: isDoc, 'd-none': hasCapture }"></video>
    <div class="hud" :class="{ person: isPerson, doc: isDoc, selected: hasCapture }">
      <div class="controls confirm btn-container" v-if="hasCapture">
        <div class="fade-holder">
          <h2>{{ $t("message.pictureClear") }}</h2>
        </div>
        <button type="button" class="squared" @click="showCamera">
          {{ $t("message.anotherPicture") }}
        </button>
        <button type="button" class="squared" @click="confirmPicture">
          {{ $t("message.yes") }}
        </button>
      </div>

      <div class="controls" v-else>
        <div class="instructions" :class="{ blur: isLoading }">
          <span class="instructions-intro">{{ title }}</span>
          <div
            v-for="(instruction, index) in instructions"
            :key="index"
            class="instruction-wrapper"
          >
            <div class="instruction-index">{{ index + 1 }}</div>
            <span class="instruction">{{ $t(instruction) }}</span>
          </div>
        </div>

        <button class="btn primary send photo" type="button" ref="capturePicture" @click="snapshot">
          <img class="take-photo" src="@/assets/ic_photo.svg" alt="Camera icon" />
        </button>
      </div>
      <p v-if="camFailed" class="cam-failed">{{ $t("message.cameraNotFound") }}</p>
    </div>
    <app-loader v-if="isLoading"></app-loader>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  props: ["instructions", "title", "isPerson", "isDoc"],
  data() {
    return {
      hasCapture: false,
      imageData: null,
      camFailed: false,
      stream: null,
      isSafari: false,
      isLoading: false
    };
  },
  components: {
    BackButton
  },
  methods: {
    snapshot() {
      const data = this.createImage();
      this.imageData = data;
      this.hasCapture = true;
    },
    createImage() {
      const $video = this.$refs.video;
      const canvas = document.createElement("canvas");
      canvas.width = $video.videoWidth;
      canvas.height = $video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage($video, 0, 0, canvas.width, canvas.height);
      // valor em base64
      const dataURI = canvas.toDataURL();
      return dataURI;
    },
    confirmPicture() {
      this.isLoading = true;
      const data = this.b64toBlob(this.imageData);
      this.$emit("confirm-picture", data);
    },
    showCamera() {
      this.imageData = null;
      this.hasCapture = false;
    },
    startSafariCamera($video, mode) {
      const config = mode === "user" ? true : { facingMode: { ideal: mode } };
      if (typeof navigator.mediaDevices.getUserMedia !== "undefined") {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: config
          })
          .then(stream => {
            $video.srcObject = stream;
            this.stream = stream;
            this.$refs.capturePicture.focus();
          })
          .catch(() => {
            this.camFailed = true;
          });
      } else {
        this.camFailed = true;
      }
    },
    startCamera($video, mode) {
      navigator.getMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      if (typeof navigator.getMedia !== "undefined") {
        navigator.getMedia(
          { audio: false, video: { facingMode: { ideal: mode } } },
          stream => {
            $video.srcObject = stream;
            this.stream = stream;
            this.$refs.capturePicture.focus();
          },
          () => {
            this.camFailed = true;
          }
        );
      } else {
        this.camFailed = true;
      }
    },
    closeHandler() {
      this.$emit("close");
    },
    b64toBlob(b64Data, contentType = "image/png", sliceSize = 512) {
      const byteCharacters = atob(b64Data.split(",")[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
  },
  created() {
    this.isSafari = /^((?!chrome|android|CriOS).)*safari/i.test(navigator.userAgent);
  },
  mounted() {
    const $video = this.$refs.video;
    const mode = this.isDoc ? "environment" : "user";

    $video.setAttribute("autoplay", "");
    $video.setAttribute("muted", "");
    $video.setAttribute("playsinline", "");

    if (this.isSafari) {
      this.startSafariCamera($video, mode);
    } else {
      this.startCamera($video, mode);
    }
  },
  destroyed() {
    this.stream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.stream = null;
  }
};
</script>

<style lang="scss">
.camera-holder {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 1;

  video {
    min-height: 100%;
    position: relative;
    left: 50%;
    transform: translateX(-50%) scaleX(-1);
  }

  .capture {
    position: absolute;
    min-height: 100%;
    left: 50%;
    transform: translateX(-50%) scaleX(-1);
  }

  .hud {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-size: 100%;

    &:not(.selected) {
      &.person {
        background: url("../../assets/faceMask.svg") no-repeat center;
        background-size: cover;
      }

      &.doc {
        background: url("../..//assets/docMask.svg") no-repeat center;
        background-size: cover;
      }
    }

    .controls {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 5%;

      &.confirm {
        .fade-holder {
          position: absolute;
          top: 0;
          width: 100%;
          height: 30%;
          text-align: center;
          padding-top: 3rem;

          background: $fade-fallback;
          background: $fade;

          h2 {
            font-size: 4.5rem;
            color: $white;
          }
        }

        .squared {
          width: 400px;
          padding: 0.5rem;
          font-size: 3rem;
          &:first-of-type {
            margin-right: 3rem;
          }
        }
      }

      .take-photo {
        width: 7rem;
      }
    }

    ul {
      color: $white;
      font-size: 1.6rem;
      list-style: none;
      position: absolute;
      transform: translateX(calc(-100% - 5rem));

      li {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;

        &::before {
          content: ("");
          width: 1rem;
          height: 1rem;
          margin-right: 1rem;
          border-radius: 0.5rem;
          background-color: $white;
        }
      }
    }
  }

  .cam-failed {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
    transform: translateY(-50%);
    font-size: 2rem;
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
      font-size: 1.4rem;
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
        font-size: 1.3rem;
      }
    }
  }
}

@media screen and (max-width: 991px) {
  .camera-holder {
    height: auto;
    min-height: 100vh;

    video {
      min-height: unset;
      margin-top: 100px;
      width: calc(100% - 40px);
    }

    .capture {
      min-height: unset;
      top: 100px;
      width: calc(100% - 40px);
    }

    .hud {
      &:not(.selected) {
        &.person {
          background: none;
        }

        &.doc {
          background: none;
        }
      }

      .controls {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-bottom: 20px;

        .send.photo {
          font-size: 0;
          border-radius: 3.5rem;
          padding: 0;

          span {
            &::before {
              margin-top: 0;
              margin-right: 0;
            }
          }
        }

        &.confirm {
          .fade-holder {
            h2 {
              margin-top: 4rem;
              font-size: 2.5rem;
            }
          }

          .squared {
            width: calc(100% - 40px);
            margin: 0 20px;
            font-size: 1.5rem;

            &:first-of-type {
              margin-bottom: 20px;
            }
          }
        }
      }

      ul {
        padding: 0;
        position: static;
        transform: translateX(0);
        margin-bottom: 20px;
      }
    }

    .instructions {
      bottom: 0;
      left: 0;
      position: relative;
      margin: 0 20px 20px 20px;
      width: calc(100% - 40px);
      z-index: 2;

      .instruction-wrapper {
        .instruction-index {
          min-width: 30px;
        }
      }
    }
  }
}
</style>
