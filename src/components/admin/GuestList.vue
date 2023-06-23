<template>
  <div class="custom-list">
    <h1>{{ $t("message.guestListTitle") }}</h1>
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
        @row-clicked="openGuestHandler"
      ></b-table>
      <transition name="fade">
        <app-loader v-if="isLoading" :isAdmin="true" />
      </transition>
    </b-card>
    <GuestRecordDownload />
  </div>
</template>
<script>
import ListFilter from "@/components/admin/ListFilter.vue";
import GuestRecordDownload from "@/components/admin/GuestRecordDownload";

export default {
  name: "GuestList",
  components: {
    ListFilter,
    GuestRecordDownload
  },
  data() {
    return {
      searchPlaceholder: this.$t("message.guestSearchPlaceholder"),
      sortBy: "createdDate",
      sortDesc: true,
      fields: [
        {
          key: "name",
          label: this.$t("message.guestName"),
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
          label: this.$t("message.birth"),
          sortable: true,
          formatter: value => {
            if (value === null) {
              return "-";
            }
            return this.$d(new Date(value), "short");
          }
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
        .listGuests(params)
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
    openGuestHandler(item) {
      this.$router.push({
        name: "Guest",
        params: { guestId: item.id }
      });
    }
  },
  mounted() {
    this.loadItems();
  }
};
</script>
