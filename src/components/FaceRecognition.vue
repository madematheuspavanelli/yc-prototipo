<template>
  <div class="face-recognition pos-r">
    <BackButton :isWhite="true" />
    <video
      id="video"
      :class="isLoading || openModal ? 'blur' : ''"
      ref="video"
      src="#"
      autoplay
      muted
      playsinline
    ></video>
    <div class="image-preview">
      <canvas ref="canvas"></canvas>
    </div>
    <FaceMask class="face-mask" :class="{ blur: isLoading }" v-if="this.doFacialRecognition" />
    <div :class="[isLoading || openModal ? 'blur' : '', 'instructions']" v-show="!openModal">
      <span class="instructions-intro">{{ $t("message.letsTakeAPhoto") }}</span>
      <div v-for="(instruction, index) in instructions" :key="index" class="instruction-wrapper">
        <div class="instruction-index">{{ index + 1 }}</div>
        <span class="instruction">{{ $t(instruction) }}</span>
      </div>
    </div>
    <img
      v-show="!openModal"
      v-if="this.doFacialRecognition"
      :class="[isLoading || openModal ? 'blur' : '', 'take-photo']"
      src="@/assets/ic_photo.svg"
      alt="Camera icon"
      @click="takeScreenShot"
    />
    <transition name="fade">
      <Loader v-show="isLoading" />
    </transition>
    <CheckinModal
      v-show="openModal && checkinModal"
      class="modal"
      @startCheckin="checkinSearchHandler"
    />
    <CheckoutModal
      v-show="openModal && checkoutModal"
      class="modal"
      @startCheckout="checkoutSearchHandler"
    />
    <CheckoutReserve
      v-show="openModal && checkoutReserve"
      :photoUrl="photoUrl"
      :showImage="doFacialRecognition"
      class="modal"
      @closeCheckoutReserve="closeCheckoutReserve"
      @startCheckout="startCheckout"
    />
    <SearchByDateModal
      v-show="openModal && checkinDateModal"
      class="modal"
      @retry-search="retryCheckinSearch"
      @close-date-modal="closeSearchDateModal"
    />
    <SelectBookingModal
      v-show="openModal && checkinBookingModal"
      class="modal"
      :bookingList="bookingList"
      @booking-selected="bookingSelectedHandler"
      @close="closeBookingModal"
    />
    <SelectCheckoutModal
      v-show="openModal && checkoutGuestModal"
      class="modal"
      :guestList="guestList"
      @guest-selected="checkoutSearchHandler"
      @close="closeCheckoutModal"
    />
  </div>
</template>
<script>
import BackButton from "@/components/BackButton.vue";
import CheckinModal from "@/components/checkin/CheckinModal.vue";
import CheckoutModal from "@/components/checkout/CheckoutModal.vue";
import CheckoutReserve from "@/components/checkout/CheckoutReserve.vue";
import FaceMask from "@/components/FaceMask.vue";
import Loader from "@/components/Loader";
import SearchByDateModal from "@/components/checkin/SearchByDateModal.vue";
import SelectBookingModal from "@/components/checkin/SelectBookingModal.vue";
import SelectCheckoutModal from "@/components/checkout/SelectCheckoutModal.vue";
import { getRecognitionErrorMessage } from "@/scripts/commonScripts";

export default {
  name: "FaceRecognition",
  components: {
    BackButton,
    CheckinModal,
    CheckoutModal,
    CheckoutReserve,
    FaceMask,
    Loader,
    SearchByDateModal,
    SelectBookingModal,
    SelectCheckoutModal
  },
  data() {
    return {
      instructions: ["message.removeAccessories", "message.frameFace"],
      faceCameraId: null,
      intervalId: null,
      photoUrl: null,
      isLoading: false,
      openModal: false,
      checkinModal: false,
      checkoutModal: false,
      checkoutReserve: false,
      checkinDateModal: false,
      checkinBookingModal: false,
      checkoutGuestModal: false,
      currentName: null,
      bookingList: [],
      guestList: [],
      loadGuestTries: 0,
      selectBookingTries: 0,
      guestExistsDocuments: false
    };
  },
  computed: {
    doFacialRecognition() {
      return this.$store.getters.hotelSettingFaceRekognition;
      // return localStorage.getItem("settings.doFacialRecognition") != 0 ? true : false;
    },
    shouldGetUserDocument() {
      return this.$store.getters.hotelSettingUseDocumentPhoto;
    },
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    shouldVerifyCheckinTime() {
      return localStorage.getItem("settings.blockedCheckin") === "1";
    },
    shouldVerifyCheckoutTime() {
      return localStorage.getItem("settings.blockedCheckout") === "1";
    },
    checkinTimeLimit() {
      return JSON.parse(localStorage.getItem("settings.checkinTime"));
    },
    checkoutTimeLimit() {
      return JSON.parse(localStorage.getItem("settings.checkoutTime"));
    },
    checkinTimeString() {
      const { HH, mm } = this.checkinTimeLimit;
      return `${HH}:${mm}`;
    },
    checkoutTimeString() {
      const { HH, mm } = this.checkoutTimeLimit;
      return `${HH}:${mm}`;
    },
    userId() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    startStreaming() {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: this.faceCameraId
            },
            width: 720,
            height: 480
          }
        })
        .then(async data => {
          await this.gotStream(data);
        })
        .catch(() => {});
    },
    gotStream(stream) {
      this.stream = stream;
      this.$refs.video.srcObject = stream;
      this.$refs.video.play();
    },
    takeScreenShot() {
      this.isLoading = true;
      this.photoUrl = null;
      this.$refs.video.pause();
      this.$store.dispatch("CLEAR_PHOTO_ID");

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

      const form = new FormData();

      this.dataURItoBlob(this.$refs.canvas.toDataURL("image/png")).then(file => {
        form.append("file", file);
        this.requestUserRecognition(form);
      });
    },
    requestUserRecognition(form) {
      this.$store.dispatch("SET_USER_PROFILE", { value: null });
      this.$store.dispatch("SET_USER_ADDRESS", { value: null });
      this.shouldGetExpensesFromUserDocument = false;
      this.currentDoc = null;
      this.$API.users
        .userRecognition(form)
        .then(response => {
          const { photoUrl, photoId } = response.data;
          const user = response.data.user;

          this.photoUrl = photoUrl;
          this.$store.dispatch("SET_PHOTO_ID", { value: photoId });

          if (user != null && typeof user.id !== "undefined") {
            this.setUserInfo(user);
          } else {
            this.selectFlow();
          }
        })
        .catch(this.faceNotFoundHandler);
    },
    setUserInfo(user) {
      const { id, lastStep, bookingId, name, checkoutDate } = user || {};
      this.$store.dispatch("SET_USER_ID", { value: id });
      this.loadBooking(bookingId, name)
        .catch(() => {})
        .finally(() => {
          this.$API.users
            .getUser(id)
            .then(response => {
              const { profile, address, guestId } = response.data || {};
              this.$store.dispatch("SET_USER_PROFILE", { value: profile });
              this.$store.dispatch("SET_USER_ADDRESS", { value: address });
              this.$store.dispatch("SET_GUEST_ID", { value: guestId });

              this.currentDoc = profile.document;

              if (lastStep == 1) {
                this.continueCheckin();
              } else if (lastStep == 2 && !this.verifyIfCheckoutIsExpiredHandler(checkoutDate)) {
                this.shouldGetExpensesFromUserDocument = true;
                this.continueCheckout();
              } else {
                this.selectFlow();
              }
            })
            .catch(() => {
              this.selectFlow();
            });
        });
    },
    continueCheckin() {
      this.verifyIfCanCheckinHandler()
        .then(() => {
          this.startCheckin();
        })
        .catch(this.checkinBlockedHandler);
    },
    checkinSearchHandler(name) {
      this.isLoading = true;
      this.currentName = name;
      this.loadBooking(null, name)
        .then(this.startCheckin)
        .catch(data => {
          if (!Array.isArray(data) && data === "This Booking is not enabled for Totem") {
            this.stepErrorHandler(this.$t("alert.notEnabledForTotem"));
            this.isLoading = false;
            this.currentName = "";
            return;
          }
          if (!Array.isArray(data) && data === "No available room found.") {
            this.stepErrorHandler(this.$t("alert.noRoom"));
            this.isLoading = false;
            this.currentName = "";
            return;
          }
          if ((data.retryWithFields || []).length > 0) {
            this.showSearchByDateModal();
          } else {
            this.stepErrorHandler(this.$t("alert.noBookingTryAgainName", { name }));
          }
          this.isLoading = false;
        });
    },
    loadBooking(savedBookingId, name, checkoutDate, savedGuestId = null) {
      return new Promise((resolve, reject) => {
        if (savedBookingId == null) {
          const params = { name, checkoutDate };
          this.$API.booking
            .searchGuest(params)
            .then(response => {
              const guestList = (response.data || {}).bookingGuests || [];
              if (!guestList.length) {
                reject(response.data);
                return;
              }
              if (guestList.length > 1) {
                reject(guestList);
              }
              const { bookingId = null, guestId = null } = guestList[0];
              if (bookingId !== null && guestId !== null) {
                this.$store.dispatch("SET_BOOKING_ID", { value: bookingId });
                this.$store.dispatch("SET_GUEST_ID", { value: guestId });
                resolve();
              } else {
                reject(response.data);
              }
            })
            .catch(data => {
              reject(data);
            });
        } else {
          this.$store.dispatch("SET_BOOKING_ID", { value: savedBookingId });
          if (savedGuestId !== null) {
            this.$store.dispatch("SET_GUEST_ID", { value: savedGuestId });
          }
          resolve();
        }
      });
    },
    retryCheckinSearch(checkout) {
      this.isLoading = true;
      const str = this.parseDateString(checkout);
      this.loadBooking(null, this.currentName, str)
        .then(this.startCheckin)
        .catch(bookingList => {
          if ((bookingList || []).length > 1) {
            this.showBookingListModalHandler(bookingList);
          } else {
            this.stepErrorHandler(this.$t("alert.noBookingTryAgainCheckout", { checkout }));
          }
          this.isLoading = false;
        });
    },
    bookingSelectedHandler(booking) {
      this.loadBooking(booking.bookingId, null, null, booking.guestId)
        .then(this.startCheckin)
        .catch(() => {
          if (this.selectBookingTries < 3) {
            this.selectBookingTries += 1;
            this.bookingSelectedHandler(booking);
            return;
          }
          this.stepErrorHandler(this.$t("alert.bookingRegisterError"));
        });
    },
    startCheckin() {
      this.$store.dispatch("SET_CURRENT_PROCESS", "checkin");
      this.loadGuestTries = 0;
      this.loadBookingData();
      //this.loadGuestList();
    },
    loadBookingData() {
      this.isLoading = true;
      this.$API.booking
        .getBooking(this.bookingId, this.$store.getters.currentProcess)
        .then(response => {
          const data = response.data || {};
          const {
            checkinDate,
            checkoutDate,
            roomNumber,
            roomType,
            hasChild,
            guestEnabledFor
          } = data;

          if (roomNumber === null) {
            this.roomNotFoundHandler(roomType);
            return;
          }

          // if (hasChild) {
          //   this.childFound(hasChild);
          //   return;
          // }

          if (!guestEnabledFor.includes("CHECKIN")) {
            this.$alert("error", this.$t("alert.notEnabledForTotem")).then(() => {
              this.$router.push({ name: "Home" });
            });
            return;
          }

          this.startDate = checkinDate;
          this.endDate = checkoutDate;
          this.roomNumber = roomNumber;
          this.roomType = roomType;
          this.hasChild = hasChild;
          this.storeBookingData(data);
          this.isLoading = false;
          this.loadGuestList();
        })
        .catch(() => {
          this.retryHandler();
        });
    },
    async verifyDocument() {
      if (this.userId !== null) {
        await this.$API.users
          .documentExist(this.userId)
          .then(response => {
            this.guestExistsDocuments = response.data;
          })
          .catch(() => {
            this.guestExistsDocuments = false;
          });
      }
    },
    loadGuestList() {
      this.isLoading = true;
      this.$API.booking
        .getBookingGuestList(this.bookingId, this.$store.getters.currentProcess)
        .then(response => {
          const guestList = (response.data || {}).guests || [];
          if (guestList.length > 1) {
            this.$store.dispatch("SET_BOOKING_GUEST_LIST", { value: guestList });
            this.$router.push({ name: "SelectGuestPage" });
          } else {
            const guest = (guestList[0] || {}).profile || {};
            const { userId, guestId, firstName, lastName } = guest;

            if (typeof guestId === "undefined") {
              this.stepErrorHandler(this.$t("alert.bookingRegisterError"));
              return;
            }
            if (this.userId === null) {
              const fullName = `${firstName} ${lastName}`;
              this.$store.dispatch("SET_NEW_USER_NAME", { value: fullName });
            }
            this.$store.dispatch("SET_USER_ID", { value: userId });
            this.$store.dispatch("SET_GUEST_ID", { value: guestId });

            if (this.$store.getters.currentProcess == "checkin") {
              if (!this.shouldGetUserDocument) {
                this.$router.push({
                  name: "PersonalForm"
                });
              } else {
                if (this.guestExistsDocuments) {
                  this.$router.push({
                    name: "PersonalForm"
                  });
                } else {
                  this.$router.push({
                    name: "DocumentPage"
                  });
                }
              }
            }
            // this.showCheckinConfirmation();
          }
        })
        .catch(() => {
          if (this.loadGuestTries < 3) {
            this.loadGuestTries += 1;
            setTimeout(this.loadGuestList, 5000);
            return;
          }
          this.isLoading = false;
          this.stepErrorHandler(this.$t("alert.bookingRegisterError"));
        });
    },
    showCheckinConfirmation() {
      this.$alert(
        "success",
        this.$t("alert.checkinConfirmation", null, { confirmButtonText: this.$t("message.next") })
      ).then(() => {
        if (!this.shouldGetUserDocument) {
          this.$router.push({
            name: "PersonalForm"
          });
        } else {
          this.$router.push({
            name: "DocumentPage"
          });
        }
      });
    },
    continueCheckout() {
      this.verifyIfCanCheckoutHandler()
        .then(() => {
          this.showCheckoutConfirmation();
        })
        .catch(this.checkoutBlockedHandler);
    },
    checkoutSearchHandler(type, doc) {
      this.isLoading = true;
      // this.currentDoc = doc;
      this.$API.booking
        // .searchGuestDoc(this.currentDoc)
        .searchGuestDoc(type, doc)
        .then(response => {
          const guestList = (response || {}).data;
          if (guestList.length > 1) {
            this.isLoading = false;
            this.showGuestListModalHandler(guestList);
          } else {
            const id = ((guestList[0] || {}).guest || {}).userId || null;
            const bookingId = guestList[0].bookingId;
            const transactionId = guestList[0].transactionId;

            if (bookingId === null) {
              this.noBookingErrorHandler();
              return;
            }

            this.$store.dispatch("SET_USER_ID", { value: id });
            this.$store.dispatch("SET_BOOKING_ID", { value: bookingId });
            this.$store.dispatch("SET_BOOKING_TRANSACTION_ID", { value: transactionId });

            this.storeBookingData(guestList[0]);
            this.loadCheckoutUserInfo(id);
          }
        })
        .catch(() => {
          this.stepErrorHandler(this.$t("alert.noBookingTryAgain"));
          this.isLoading = false;
        });
    },
    storeBookingData(data) {
      this.$store.dispatch("SET_BOOKING_DATA", { value: data });
    },
    loadCheckoutUserInfo(id) {
      this.$API.users
        .getUser(id)
        .then(response => {
          const { profile, address } = response.data || {};
          this.$store.dispatch("SET_USER_PROFILE", { value: profile });
          this.$store.dispatch("SET_USER_ADDRESS", { value: address });
          this.checkoutModal = false;
          this.showCheckoutConfirmation();
          this.isLoading = false;
        })
        .catch(this.$t("alert.noBookingTryAgain"));
    },
    showCheckoutConfirmation() {
      this.isLoading = false;
      this.openModal = true;
      this.checkoutReserve = true;
    },
    closeCheckoutReserve() {
      this.checkoutReserve = false;
      this.checkoutModal = true;
    },
    async doYouHadExtraExpenses(route) {
      const result = await this.$swal.fire({
        title: "Houve algum consumo extra em sua hospedagem?",
        icon: "info",
        width: 500,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.yes"
        )}</label>`,
        cancelButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.no"
        )}</label>`,
        cancelButtonColor: "black",
        confirmButtonColor: "black",
        iconColor: "black",
        background: "#ffd400"
      });

      const { isConfirmed } = result;

      if (isConfirmed) {
        this.$alert("error", this.$t("alert.hadExtraExpenses")).then(() => {
          this.$router.push({ name: "Home" });
        });
      } else {
        this.$router.push({ name: route });
      }
    },
    startCheckout() {
      this.isLoading = true;
      this.$store.dispatch("SET_CURRENT_PROCESS", "checkout");
      this.loadBookingData("check-out");
      this.loadCheckoutBookingData().then(() => {
        // this.$router.push({ name: "SavedCard" });
        // console.log("this.bookingId => ", this.bookingId);
        // this.$API.booking
        //   .getBooking(this.bookingId)
        //   .then(response => {
        //     const {
        //       guestType,
        //       origem,
        //       veiculo,
        //       shouldPayOnCheckin,
        //       requirePrimaryPayment
        //     } = response.data;
        //     if (
        //       (guestType == "PART" ||
        //         (guestType == "AGEN" && origem == "2G" && veiculo == "OTA")) &&
        //       shouldPayOnCheckin &&
        //       requirePrimaryPayment
        //     ) {
        this.doYouHadExtraExpenses("InvoicePage");
        // this.$router.push({ name: "InvoicePage" });
        //   } else {
        //     if (this.hasACard) {
        //       this.$router.push({ name: "SavedCard" });
        //     } else {
        //       this.$router.push({ name: "CardRegistration" });
        //     }
        //   }
        // })
        // .catch(() => {});
      });
    },
    loadCheckoutBookingData() {
      return new Promise(resolve => {
        if (!this.shouldGetExpensesFromUserDocument) {
          resolve();
          return;
        }
        this.$API.booking
          .searchGuestDoc("cpf", this.currentDoc)
          .then(response => {
            const { data } = response || {};
            this.storeBookingData(data);
            resolve();
          })
          .catch(() => {
            this.stepErrorHandler(this.$t("alert.bookingRegisterError"));
          });
      });
    },
    parseDateString(str) {
      return str
        .split("/")
        .reverse()
        .join("-");
    },
    showSearchByDateModal() {
      this.checkinModal = false;
      this.checkinDateModal = true;
    },
    closeSearchDateModal() {
      this.checkinDateModal = false;
      this.checkinModal = true;
    },
    closeBookingModal() {
      this.checkinBookingModal = false;
      this.checkinDateModal = true;
    },
    closeCheckoutModal() {
      this.checkoutGuestModal = false;
      this.checkoutModal = true;
    },
    async selectFlow() {
      this.openModal = true;
      this.isLoading = false;

      try {
        const result = await this.$swal.fire({
          title: this.$t("message.beforeStart"),
          icon: "info",
          width: 500,
          showCloseButton: false,
          showCancelButton: true,
          focusConfirm: false,
          allowOutsideClick: false,
          confirmButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
            "message.doCheckin"
          )}</label>`,
          cancelButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
            "message.doCheckout"
          )}</label>`,
          cancelButtonColor: "black",
          confirmButtonColor: "black",
          iconColor: "black",
          background: "#ffd400"
        });

        const { isConfirmed } = result;
        var name = null;

        if (this.$store.getters.userProfile != null) {
          name = this.$store.getters.userProfile.name;
        }
        if (isConfirmed) {
          this.searchBookingId(name).then(resolve => {
            resolve();
          });

          if (this.bookingId === null) {
            this.checkinModal = true;
            this.checkoutModal = false;
          } else {
            this.startCheckin();
          }
        } else {
          if (this.bookingId === null) {
            this.checkoutModal = true;
            this.checkinModal = false;
          } else {
            const hasBookingInvoiceValue = this.$store.state.booking.bookingInvoiceValue;
            if (hasBookingInvoiceValue) {
              this.startCheckout();
            } else {
              this.$router.push({ name: "ReturnKeys" });
            }
          }
        }
      } catch (error) {
        this.checkoutBlockedHandler;
      }
    },
    searchBookingId(name) {
      var checkoutDate = null;
      return new Promise(resolve => {
        const params = { name, checkoutDate };
        this.$API.booking.searchGuest(params).then(response => {
          const guestList = (response.data || {}).bookingGuests || [];

          const { bookingId = null } = guestList[0];
          if (bookingId !== null) {
            this.$store.dispatch("SET_BOOKING_ID", { value: bookingId });
            resolve();
          }
        });
        resolve();
      });
    },
    closeSelectFlowModal() {
      this.$swal.close();
      if (this.openModal && !this.checkoutModal && !this.checkinModal) {
        this.$router.push({ name: "Home" });
        return;
      }
      if (this.checkoutModal || this.checkinModal) {
        this.selectFlow();
        this.checkoutModal = false;
        this.checkinModal = false;
      }
    },
    stepErrorHandler(message) {
      this.$alert("error", message);
    },
    showBookingListModalHandler(bookingList) {
      this.bookingList = bookingList;
      this.checkinBookingModal = true;
    },
    showGuestListModalHandler(guestList) {
      this.guestList = guestList;
      this.checkoutGuestModal = true;
    },
    roomNotFoundHandler(roomType) {
      this.$alert("error", this.$t("alert.noRoom", { roomType })).then(() => {
        this.$router.push({ name: "Home" });
      });
    },

    childFound(hasChild) {
      this.$alert("error", this.$t("alert.hasChild", { hasChild })).then(() => {
        this.$router.push({ name: "Home" });
      });
    },

    faceNotFoundHandler(err) {
      this.$store.dispatch("CLEAR_PHOTO_ID");
      let errMsg;

      errMsg = this.$t(getRecognitionErrorMessage(err));

      this.$alert("error", errMsg).then(() => {
        this.photoUrl = null;
        this.isLoading = false;
        this.$refs.video.play();
      });
    },
    dataURItoBlob(dataURI) {
      return fetch(dataURI)
        .then(res => {
          return res.arrayBuffer();
        })
        .then(buf => {
          return new File([buf], `${new Date()}.png`, { type: "image/png" });
        });
    },
    verifyIfCanCheckinHandler() {
      return new Promise((resolve, reject) => {
        if (!this.shouldVerifyCheckinTime) {
          resolve();
          return;
        }
        const currentTime = new Date();
        const limitTime = new Date();
        const { HH, mm } = this.checkinTimeLimit;
        limitTime.setHours(HH);
        limitTime.setMinutes(mm);

        if (currentTime < limitTime) {
          reject();
        } else {
          resolve();
        }
      });
    },
    checkinBlockedHandler() {
      this.$alert(
        "error",
        this.$t("message.variableCheckinMessage", { time: this.checkinTimeString })
      ).then(() => {
        this.$router.push({ name: "Home" });
      });
    },
    verifyIfCanCheckoutHandler() {
      return new Promise((resolve, reject) => {
        if (!this.shouldVerifyCheckoutTime) {
          resolve();
          return;
        }
        const currentTime = new Date();
        const limitTime = new Date();
        const { HH, mm } = this.checkoutTimeLimit;
        limitTime.setHours(HH);
        limitTime.setMinutes(mm);

        if (currentTime > limitTime) {
          reject();
        } else {
          resolve();
        }
      });
    },
    checkoutBlockedHandler() {
      this.$alert(
        "error",
        this.$t("message.variableCheckoutMessage", { time: this.checkoutTimeString })
      ).then(() => {
        this.$router.push({ name: "Home" });
      });
    },
    verifyIfCheckoutIsExpiredHandler(checkoutDate) {
      const today = new Date();
      const limitDate = new Date(checkoutDate);
      return today > limitDate;
    },
    resetData() {
      this.$store.dispatch("SET_USER_PROFILE", { value: null });
      this.$store.dispatch("SET_USER_ADDRESS", { value: null });
      this.$store.dispatch("SET_BOOKING_ID", { value: null });
    }
  },
  mounted() {
    if (this.doFacialRecognition) {
      if (!localStorage.getItem("faceCamera")) {
        this.$router.push({ name: "ErrorConfig" });
        return;
      } else {
        this.faceCameraId = localStorage.getItem("faceCamera");
        this.resetData();
        this.startStreaming();
      }
    } else {
      this.selectFlow();
    }
  },
  beforeDestroy() {
    this.$swal.close();

    clearInterval(this.intervalId);
    if (this.stream != null) {
      this.stream.getTracks()[0].stop();
    }
  }
};
</script>
<style lang="scss" scoped>
.blur {
  filter: blur(8px);
}

.face-recognition {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: black;

  .modal {
    position: absolute;
  }

  .face-mask,
  .instructions,
  .take-photo,
  .count-down {
    position: absolute;
  }

  .image-preview {
    display: none;
  }

  .count-down {
    font-size: 20rem;
    left: 65%;
    top: 10%;
    transform: translateX(50%);
    z-index: 2;
    color: #fafafa;
  }

  #video {
    height: 115%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50.1%) scaleX(-1);
  }

  .take-photo {
    width: 7rem;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    cursor: pointer;
  }

  .face-mask {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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
</style>
