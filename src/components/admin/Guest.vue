<template>
  <div class="content">
    <h1 class="title">
      {{ guestData.name || "-" }}
      <b-button variant="primary" @click="print" data-ignore-on-print="true">Imprimir</b-button>
    </h1>
    <UserInfo :data="guestData" />
    <h2 class="title" data-ignore-on-print="true">
      {{ $t("message.reservationListTitle") }}
    </h2>
    <b-card bg-variant="dark" no-body class="table-holder" data-ignore-on-print="true">
      <b-table
        :items="guestData.reservations"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive
        striped
        borderless
        dark
        sticky-header="400px"
        table-variant="dark"
        @row-clicked="openReservationHandler"
      ></b-table>
    </b-card>
  </div>
</template>
<script>
import UserInfo from "@/components/admin/UserInfo";

export default {
  name: "Guest",
  components: {
    UserInfo
  },
  computed: {
    guestId() {
      return this.$route.params.guestId;
    }
  },
  data() {
    return {
      guestData: {},
      fields: [
        {
          key: "reservationNumber",
          label: this.$t("message.reservationNumber"),
          sortable: true
        },
        {
          key: "status",
          label: this.$t("message.reservationStatus"),
          sortable: true
        },
        {
          key: "name",
          label: this.$t("message.guestName"),
          sortable: true
        },
        {
          key: "reservationCheckinDate",
          label: this.$t("message.scheduledCheckin"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        },
        {
          key: "checkinDate",
          label: this.$t("message.checkinMade"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        },
        {
          key: "reservationCheckoutDate",
          label: this.$t("message.scheduledCheckout"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        },
        {
          key: "checkoutDate",
          label: this.$t("message.checkoutMade"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        },
        {
          key: "preCheckinDate",
          label: this.$t("message.wasPreCheckinMade"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
        }
      ],
      sortBy: "reservationNumber",
      sortDesc: true
    };
  },
  methods: {
    loadData() {
      this.$API.admin.getGuest(this.guestId).then(data => {
        this.guestData = data || {};
      });
    },
    openReservationHandler(item) {
      this.$router.push({
        name: "Reservation",
        params: { reservationId: item.id }
      });
    },
    print() {
      window.print();
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
    display: flex;
    color: $white;
    font-size: 2.5rem;
    margin: 20px 0;
    justify-content: space-between;

    .btn {
      padding: 0 2rem;
    }
  }

  h2.title {
    font-size: 2rem;
  }
}

@media print {
  .content {
    .title {
      color: $black;
      margin-top: 50px;
      margin-bottom: 0;
    }
  }
}
</style>
