<template>
  <div class="content">
    <h1 class="title">
      {{ `${$t("message.reservation")} ${reservationData.reservationNumber || "-"}` }}
    </h1>
    <ReservationInfo class="reservation-info" v-bind="reservationData" />
    <h2 class="title">
      {{ $t("message.expense") }}
    </h2>
    <Expense
      :guest-id="parseInt(reservationData.guests[0].id)"
      :booking-id="parseInt(reservationId)"
    />
    <h2 class="title">
      {{ $t("message.cards") }}
    </h2>
    <b-card bg-variant="dark" no-body class="table-holder">
      <b-table
        :items="reservationData.transactions"
        :fields="transactionFields"
        :sort-by.sync="transactionSortBy"
        :sort-desc.sync="transactionSortDesc"
        responsive
        striped
        borderless
        dark
        sticky-header="400px"
        table-variant="dark"
      ></b-table>
    </b-card>
    <h2 class="title">
      {{ $t("message.guestListTitle") }}
    </h2>
    <b-card bg-variant="dark" no-body class="table-holder">
      <b-table
        :items="reservationData.guests"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive
        striped
        borderless
        dark
        sticky-header="400px"
        table-variant="dark"
        @row-clicked="openGuestHandler"
      ></b-table>
    </b-card>
  </div>
</template>
<script>
import ReservationInfo from "@/components/admin/ReservationInfo";
import Expense from "@/components/admin/Expense";
import { formatReadonlyPhone } from "@/scripts/commonScripts";

export default {
  name: "Guest",
  components: {
    ReservationInfo,
    Expense
  },
  computed: {
    reservationId() {
      return this.$route.params.reservationId;
    }
  },
  data() {
    return {
      reservationData: {},
      transactionFields: [
        {
          key: "cardBrand",
          label: this.$t("message.cardFlag"),
          sortable: true,
          formatter: value => {
            if (value == "Unknown") {
              return (value = "Crédito");
            }
            return value;
          }
        },
        {
          key: "cardLastNumbers",
          label: this.$t("message.cardDigits"),
          sortable: true,
          formatter: value => {
            var numString = String(value);
            while (numString.length < 4) {
              numString = "0" + numString;
            }
            return numString;
          }
        },
        {
          key: "amount",
          label: this.$t("message.tableValue"),
          sortable: true,
          formatter: value => {
            return "R$" + (value / 100).toFixed(2).replace(".", ",");
          }
        },
        {
          key: "payOnCheckin",
          label: this.$t("message.invoicePayment"),
          sortable: false,
          formatter: value => {
            if (value === true) {
              return (value = "Checkin");
            } else return (value = "Checkout");
          }
        },
        {
          key: "paymentDate",
          label: this.$t("message.tableDate"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        }
      ],
      fields: [
        {
          key: "name",
          label: this.$t("message.name"),
          sortable: true
        },
        {
          key: "email",
          label: this.$t("message.email"),
          sortable: true
        },
        {
          key: "cpfFormated",
          label: this.$t("message.cpf"),
          sortable: true
        },
        {
          key: "birthdate",
          label: this.$t("message.birthDate"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        },
        {
          key: "phone",
          label: this.$t("message.phone"),
          sortable: true,
          formatter: formatReadonlyPhone
        },
        {
          key: "createdDate",
          label: this.$t("message.registerDate"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        }
      ],
      sortBy: "createdDate",
      sortDesc: true,
      transactionSortBy: "cardBrand",
      transactionSortDesc: true
    };
  },
  methods: {
    loadData() {
      this.$API.admin.getReservation(this.reservationId).then(data => {
        this.reservationData = data;
      });
    },
    openGuestHandler(item) {
      this.$router.push({
        name: "Guest",
        params: { guestId: item.id }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.content {
  .title {
    color: $white;
    font-size: 2.5rem;
    margin: 20px 0;
  }

  h2.title {
    font-size: 2rem;
  }

  .reservation-info {
    margin-bottom: 20px;
  }

  .guest-info {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .table-holder {
    margin-bottom: 20px;
  }
}
</style>
