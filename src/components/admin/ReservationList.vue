<template>
  <div class="custom-list">
    <div class="header">
      <h1>{{ $t("message.reservationListTitle") }}</h1>
      <b-button variant="primary" @click="sendPrecheckin">{{
        $t("message.sendPrecheckin")
      }}</b-button>
    </div>
    <ListFilter @update-search="filterChangedHandler" :placeholder="searchPlaceholder" />
    <b-card bg-variant="dark" no-body class="table-holder">
      <b-table
        :items="items"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive
        striped
        borderless
        dark
        sticky-header="calc(100vh - 380px)"
        table-variant="dark"
        @scroll.native="scrollHandler"
        @row-clicked="openReservationHandler"
      ></b-table>
      <transition name="fade">
        <app-loader v-if="isLoading" :isAdmin="true" />
      </transition>
    </b-card>
  </div>
</template>

<script>
import ListFilter from "@/components/admin/ListFilter.vue";

export default {
  name: "ReservationList",
  components: {
    ListFilter
  },
  data() {
    return {
      searchPlaceholder: this.$t("message.reservationSearchPlaceholder"),
      sortBy: "reservationNumber",
      sortDesc: true,
      fields: [
        {
          key: "reservationNumber",
          label: this.$t("message.reservationNumber"),
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
          key: "paymentStatus",
          label: this.$t("message.paymentStatus"),
          sortable: true
        }
      ],
      items: [],
      hasReachedEnd: false,
      isLoading: false,
      page: 1,
      pageSize: 20,
      searchString: ""
    };
  },
  methods: {
    filterChangedHandler(value) {
      this.searchString = value;
      this.loadItems();
    },
    scrollHandler(event) {
      if (this.hasReachedEnd) {
        return;
      }

      const list = event.target;
      if (list.offsetHeight + list.scrollTop >= list.scrollHeight - 100) {
        this.nextPage();
      }
    },
    nextPage() {
      if (this.isLoading) {
        return;
      }
      this.page += 1;
      this.loadItems(false);
    },
    loadItems(reload = true) {
      if (this.isLoading) {
        return;
      }
      if (reload) {
        this.items = [];
        this.page = 1;
      }
      this.isLoading = true;
      const params = this.getListParams();
      this.$API.admin
        .listReservations(params)
        .then(data => {
          data.data.forEach(item => {
            this.items.push(item);
          });
          this.hasReachedEnd = !data.hasNextPage;
          this.isLoading = false;
        })
        .catch(() => {
          this.hasReachedEnd = true;
          this.isLoading = false;
        });
    },
    getListParams() {
      const value = {
        page: this.page,
        pageSize: this.pageSize,
        search: this.searchString
      };
      return value;
    },
    openReservationHandler(item) {
      this.$router.push({
        name: "Reservation",
        params: { reservationId: item.id }
      });
    },
    sendPrecheckin() {
      this.$alert("warning", this.$t("alert.sendPrecheckin"), null, {
        showCancelButton: true,
        cancelButtonText: this.$t("message.cancel"),
        confirmButtonText: this.$t("message.send")
      }).then(data => {
        if (data.isConfirmed) {
          this.$API.hotel.sendPrecheckin();
        }
      });
    }
  },
  mounted() {
    this.loadItems();
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  .btn {
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 992px) {
  .header {
    flex-direction: row;

    .btn {
      margin-bottom: 0;
    }
  }
}
</style>
