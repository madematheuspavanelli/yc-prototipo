<template>
  <div class="cam-modal">
    <Modal>
      <span class="title" slot="title">{{ $t(title) }}</span>
      <video src="#" ref="video" id="video" slot="center"></video>
      <div class="select-button" slot="bottom">
        <v-select
          :options="cameraOptions"
          label="name"
          class="custom-select-vs settings"
          :reduce="device => device.id"
          v-model="activeCameraId"
          :clearable="false"
        ></v-select>
        <button @click="submitCamera()">{{ $t("message.select") }}</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal";

export default {
  name: "WebcamModal",
  components: {
    Modal
  },
  props: {
    storageProperty: {
      required: true
    },
    title: {
      required: true
    }
  },
  data() {
    return {
      cameraOptions: [],
      activeCameraId: null,
      isMounting: true,
      stream: null
    };
  },
  mounted() {
    this.toggleLoader();

    this.enumarateDevices();
    if (localStorage.getItem(this.storageProperty)) {
      this.activeCameraId = localStorage.getItem(this.storageProperty);
      new Promise(resolve => {
        this.startStreaming(resolve);
      });
      return;
    }
    this.isMounting = !this.isMounting;
    this.toggleLoader();
  },
  beforeDestroy() {
    if (this.stream != null) {
      this.stream.getTracks()[0].stop();
    }
  },
  watch: {
    activeCameraId() {
      if (this.isMounting) {
        return;
      }
      this.startStreaming();
    }
  },
  methods: {
    async enumarateDevices() {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices
        .filter(device => device.kind === "videoinput")
        .filter(device => device.deviceId);

      if (videoDevices.length === 0) {
        return;
      }

      this.cameraOptions = videoDevices.map(device => ({
        id: device.deviceId,
        name: device.label
      }));
    },
    startStreaming(resolve) {
      let mediaParams = {
        video: true
      };

      const hasActiveCameraID = this.activeCameraId;

      if (hasActiveCameraID) {
        mediaParams = {
          video: {
            deviceId: {
              exact: this.activeCameraId
            }
          }
        };
      }

      navigator.mediaDevices.getUserMedia(mediaParams).then(async data => {
        await this.gotStream(data);
        if (resolve) {
          this.isMounting = !this.isMounting;
          this.toggleLoader();
          resolve();
        }
      });
    },
    gotStream(stream) {
      this.stream = stream;
      this.$refs.video.srcObject = stream;
      this.$refs.video.play();
    },
    submitCamera() {
      if (this.activeCameraId == null) {
        this.$alert("warning", this.$t("alert.selectADevice"));
      } else {
        localStorage.setItem(this.storageProperty, this.activeCameraId);
        this.$toast.success(this.$i18n.t("message.successSave"));
      }
    },
    toggleLoader() {
      this.$emit("toggleLoader");
    }
  }
};
</script>
<style lang="scss" scoped>
.cam-modal {
  display: flex;
  justify-content: center;
  min-width: 40rem;

  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  #video {
    max-width: 48rem;
    margin-bottom: 2.5rem;
    max-height: 27rem;
    transform: scaleX(-1);
  }

  .select-button {
    display: flex;
    margin-bottom: 1.5rem;
    justify-content: center;

    button {
      background-color: transparent;
      padding: 0.5rem 2rem;
      border: 0.1rem solid $yckLightGrey;
      border-radius: 0.4rem;
    }
  }
}
</style>
