<template>
  <app-page :pageTitle="$t('message.invoice')" :isLoading="isLoading" variant="top" lg>
    <div class="content" ref="invoice">
      <div class="form-header">
        <div class="header-col">
          <div class="span-group">
            <span> {{ $t("message.invoiceName") }} </span>
            <span> {{ invoiceName }} </span>
          </div>
          <div class="span-group">
            <span> {{ $t("message.invoiceDoc") }} </span>
            <span> {{ invoiceDoc }} </span>
          </div>
          <div class="span-group">
            <span> {{ $t("message.invoiceAddress") }} </span>
            <span> {{ invoiceAddress }} </span>
          </div>
        </div>
        <div class="header-col">
          <div class="span-group">
            <span> {{ $t("message.invoiceReservation") }} </span>
            <span> {{ invoiceReservation }} </span>
          </div>
          <div class="span-group">
            <span> {{ $t("message.invoiceUH") }} </span>
            <span> {{ invoiceUH }} </span>
          </div>
          <div class="span-group">
            <span> {{ $t("message.invoiceArrival") }} </span>
            <span> {{ dateFormat(invoiceArrival) }} </span>
          </div>
          <div class="span-group">
            <span> {{ $t("message.invoiceEmission") }} </span>
            <span> {{ invoiceEmission }} </span>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{{ $t("message.invoiceName") }}</th>
            <th>{{ $t("message.tableDate") }}</th>
            <th>{{ $t("message.tableDescription") }}</th>
            <!-- <th>{{ $t("message.tableUH") }}</th> -->
            <th>{{ $t("message.tableValueCredit") }}</th>
            <th>{{ $t("message.tableValueDebit") }}</th>
            <!-- <th>{{ $t("message.tablePaid") }}</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <!-- <td>{{ dateFilter(item.date) }}</td> -->
            <td>{{ item.guestName }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.description }}</td>
            <!-- <td>{{ bookingData.roomNumber }}</td> -->
            <!-- <td>R$ {{ item.value }}</td> -->
            <td>{{ showValue(item.value, "CREDIT") }}</td>
            <td>{{ showValue(item.value, "DEBIT") }}</td>
            <!-- <td>{{ item.isPaid ? $t("message.yes") : $t("message.no") }}</td> -->
          </tr>
        </tbody>
      </table>
      <div class="row total-line">
        <!-- <div class="value-group">
          <span> {{ $t("message.tableTotal") }}: {{ formatPrice(totalValue) }}</span>
        </div> -->
        <div class="value-group">
          <span> {{ $t("message.totalToPay") }}: {{ formatPrice(totalValueToPay) }}</span>
        </div>
      </div>
    </div>
      <div class="row">
        <div class="terms">
          <span> {{ $t("message.invoiceTerms") }}</span>
        </div>
      </div>
    <div v-if="actionsEnabled" class="btn-container">
      <b-button @click="disagreeHandler">{{ $t("message.btnDisagree") }}</b-button>
      <b-button @click="agreeHandler" variant="primary">{{ $t("message.btnAgree") }}</b-button>
    </div>
  </app-page>
</template>
<script>
export default {
  name: "InvoicePage",
  props: {
    actionsEnabled: {
      required: false,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      imgInvoice: null
    };
  },
  computed: {
    bookingData() {
      return this.$store.getters.getBookingData || {};
    },
    profileData() {
      return this.$store.getters.userProfile || {};
    },
    addressData() {
      return this.$store.getters.getUserAddress || {};
    },
    invoiceName() {
      return `${this.profileData.name || this.profileData.firstName} ${this.profileData.lastName ||
        ""}`;
    },
    invoiceDoc() {
      return this.profileData.document || this.profileData.documentNumber;
    },
    invoiceAddress() {
      const { address, street, number, city } = this.addressData;
      return `${street || address || ""}, ${number || ""} - ${city || ""}`;
    },
    invoiceArrival() {
      return this.bookingData.checkinDate || null;
    },
    invoiceEmission() {
      const baseDate = new Date();
      let month = baseDate.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = baseDate.getDate();
      day = day < 10 ? "0" + day : day;
      return day + "/" + month + "/" + baseDate.getFullYear();
    },
    invoiceUH() {
      return this.bookingData.roomNumber;
    },
    invoiceReservation() {
      return this.bookingData.reservationNumber;
    },
    tableData() {
      if (this.$store.getters.getPrincipal == "S") {
        return this.$store.getters.bookingExpenses;
      } else {
        return this.$store.getters.bookingExpenses.filter(f => f.guestId == this.guestId);
      }
    },
    totalValue() {
      return this.tableData
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);
    },
    totalValueToPay() {
      let totalValue = this.tableData
        .filter(item => !item.isPaid)
        .map(item => item.value)
        .reduce((total, currentExpense) => total + currentExpense, 0);

      return totalValue > 0 ? totalValue : 0.0;
    },
    userId() {
      return this.$store.getters.getUserId;
    },
    guestId() {
      return this.$store.getters.guestId;
    },
    bookingId() {
      return this.$store.getters.getBookingId;
    },
    isDoingCheckin() {
      return this.$store.getters.currentProcess === "checkin";
    }
  },
  methods: {
    disagreeHandler() {
      this.$router.push({ name: "DisagreeInvoice" });
    },
    showValue(value, type) {
      if ((type === "CREDIT" && value <= 0) || (type === "DEBIT" && value > 0)) {
        return this.formatPrice(Math.abs(value));
      }
      return "";
    },
    async agreeHandler() {
      this.isLoading = true;
      // Existem valores para reembolso, encaminha para recepcao
      if (this.totalValueToPay < 0) {
        this.$alert("error", this.$t("alert.hadExtraExpenses")).then(() => {
          this.$router.push({ name: "Home" });
        });
        return;
      }
      this.$store.dispatch("SET_BOOKING_INVOICE_VALUE", {
        value: this.totalValueToPay
      });

      // Salva imagem da Invoice
      let el = this.$refs.invoice;
      let options = { type: "dataURL" };
      this.imgInvoice = await this.$html2canvas(el, options);

      const params = {
        invoice: this.imgInvoice
      };

      this.$API.users.registerInvoice(this.userId, this.bookingId, this.$store.getters.currentProcess, params);

      if (this.totalValueToPay > 0 && this.isDoingCheckin) {
        this.$router.push({ name: "SavedCard" });
      } else {
        this.skipPaymentHandler();
      }
    },
    dateFormat(value) {
      const dataTest = value.substring(0, 10).split("-");
      return dataTest[2] + "/" + dataTest[1] + "/" + dataTest[0];
    },
    dateFilter(value) {
      // console.log("dateFilter => ", value);
      // console.log('this.$d(new Date(value), "short") => ', this.$d(new Date(value), "short"));
      return value !== null ? this.$d(new Date(value), "short") : "";
    },
    dateTimeFilter(value) {
      return value !== null ? this.$d(new Date(value), "long") : "";
    },
    skipPaymentHandler() {
      if (this.isDoingCheckin) {
        this.$router.push({ name: "CheckinPage" });
      } else {
        this.$router.push({ name: "Signature" });
      }
    },
    formatPrice(money) {
      let formatter = new Intl.NumberFormat("pr-BR", {
        style: "currency",
        currency: "BRL"
      });
      if (money === null || money === "") return formatter.format(0);
      return formatter.format(money);
    }
  }
};
</script>
<style lang="scss" scoped>
.form-header {
  display: flex;
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.content {
  justify-content: center;
  align-items: center;
}

.header-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-grow: 1;

  &:last-child {
    flex-grow: 0;
    width: 250px;
    padding-left: 35px;
  }

  .span-group {
    display: flex;
    height: 20px;
    margin-bottom: 10px;
    width: 100%;

    span {
      display: block;
      font-size: 14px;
      padding: 0px;
      width: 100px;
    }

    span:first-child {
      font-weight: 500;
    }

    span:last-child {
      text-transform: uppercase;
      flex-grow: 1;
    }
  }

  .value-group {
    margin: 0 auto;
    width: 800px;
    display: flex;
    justify-content: flex-end;

    span {
      display: block;
      margin-top: 5px;
      font-size: 12px;
      width: 100px;
    }
  }
}

.row {
  margin: 0;
}

.terms {
  margin: 20px auto;

  span {
    font-size: 14px;
    font-weight: 300;
  }
}

table {
  margin: 10px auto 0 auto;
  padding: 10px;
  font-size: 12px;

  thead {
    display: table;

    tr {
      width: 100%;
      display: table;
      display: flex;
      justify-content: space-evenly;
      border-top: solid 2px black;
      border-bottom: solid 2px black;

      th {
        padding: 0px 20px;
        width: calc(800px / 5);
        font-weight: bold;
        line-height: 25px;
        text-align: left;
        text-transform: uppercase;
      }
    }
  }

  tbody {
    display: block;
    max-height: 180px;
    overflow: auto;

    tr {
      width: 100%;
      display: table;

      td {
        padding: 0px 22px;
        width: calc(800px / 5);
        line-height: 25px;
        overflow: hidden;
        text-align: left;
        text-transform: uppercase;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    tr:last-child {
      width: 100%;
      display: table;
      border-bottom: solid 2px black;
    }
  }
}

.total-line {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;

  span {
    margin-left: 20px;
  }
}
</style>
