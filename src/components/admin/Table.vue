<template>
  <div class="table">
    <div class="headers">
      <div
        class="header-wrapper"
        v-for="(header, index) in headers"
        :key="index"
        :class="{
          active: header.property === 'active',
          onlyEdit: header.onlyEdit
        }"
        :style="{
          'min-width': header.width + 'px',
          'max-width': header.width + 'px'
        }"
      >
        <span
          v-if="header.hasSorting"
          class="header order-by"
          @click="orderBy(header)"
          :class="{
            asc: orderByType === 'asc' && header.property === orderByProperty,
            desc: orderByType === 'desc' && header.property === orderByProperty,
            sortable: header.hasSorting
          }"
        >
          <span>{{ $t(header.name) }}</span>
          <div class="order">
            <div class="asc"></div>
            <div class="desc"></div>
          </div>
        </span>
        <span v-else class="header">
          {{ $t(header.name) }}
        </span>
        <input
          v-if="header.hasFilter"
          type="text"
          class="base-input"
          placeholder="Filter"
          @change="
            event => {
              filterList(event, index);
            }
          "
        />
      </div>
    </div>
    <div class="body" :style="{ maxHeight: maxHeight + 'px' }">
      <div class="table-row" v-for="row in data" :key="row.id">
        <div
          v-for="item in columns"
          :key="item.property"
          :style="{
            'min-width': item.width + 'px',
            'max-width': item.width + 'px'
          }"
        >
          <span>{{ row[item.property] }}</span>
        </div>
      </div>
      <transition name="fade">
        <TableLoader v-if="isLoading" />
      </transition>
    </div>
  </div>
</template>
<script>
import TableLoader from "@/components/admin/TableLoader";
export default {
  name: "Table",
  components: { TableLoader },
  props: {
    headers: {
      required: true,
      type: Array
    },
    columns: {
      required: true,
      type: Array
    },
    data: {
      required: true,
      type: Array
    },
    originalData: {
      required: true,
      type: Array
    },
    isLoading: {
      required: true
    },
    maxHeight: {
      required: false
    }
  },
  data() {
    return {
      list: [],
      filter: {},
      orderByProperty: null,
      orderByType: null
    };
  },
  methods: {
    filterList(event, index) {
      const columnProperty = this.columns[index].property;
      const val = event.srcElement.value.toLowerCase();

      if (val === "") {
        delete this.filter[columnProperty];
      } else {
        this.filter[columnProperty] = val;
      }

      const filteredList = this.originalData.filter(el => {
        return Object.keys(this.filter).every(
          columnName =>
            el[columnName] &&
            el[columnName]
              .toString()
              .toLowerCase()
              .indexOf(this.filter[columnName]) !== -1
        );
      });

      this.$emit("headerFiltering", filteredList);
    },
    orderBy(header) {
      let data = [...this.data];

      if (this.orderByProperty === header.property) {
        if (this.orderByType === "asc") {
          this.orderByType = "desc";
        } else {
          this.orderByType = "asc";
        }
        data = data.reverse();
        this.$emit("orderBy", data);
        return;
      }

      this.orderByProperty = header.property;
      this.orderByType = header.orderBy;

      switch (header.property) {
        case "active":
          data.sort((a, b) => {
            let comparison = 0;
            if (a[header.property] < b[header.property]) {
              comparison = 1;
            } else if (a[header.property] > b[header.property]) {
              comparison = -1;
            }
            //it has to return -1, 0 or 1
            return comparison;
          });
          break;

        default:
          data.sort((a, b) => {
            let comparison = 0;
            if (a[header.property] > b[header.property]) {
              comparison = 1;
            } else if (a[header.property] < b[header.property]) {
              comparison = -1;
            }
            //it has to return -1, 0 or 1
            return comparison;
          });
          break;
      }

      this.$emit("orderBy", data);
      return;
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  overflow: auto;
  .headers {
    display: flex;
    padding: 15px 5px;
    border-bottom: 1px solid $background;
    width: fit-content;
    align-items: flex-end;

    input {
      &[type="checkbox"] {
        align-self: center;
        margin-right: 30px;
      }
    }

    .header-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1 1;
      max-width: 300px;
      min-width: 300px;
      padding-right: 30px;

      &.onlyEdit {
        min-width: 50px;
        max-width: 50px;
      }

      &.active {
        flex: 0.5 0.5;
        text-align: left;
        max-width: 100px;
        min-width: 100px;
      }

      span.header {
        font-weight: 700;
        font-size: 1.65rem;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        span {
          font-weight: 700;
          font-size: 1.5rem;
          color: $background;
        }

        &.sortable:hover {
          cursor: pointer;
        }

        div.order {
          display: flex;
          margin-left: 10px;

          div.desc {
            display: flex;
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 6px solid $background;
            cursor: pointer;
            margin-left: 5px;
          }
          div.asc {
            content: "";
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 6px solid $background;
            cursor: pointer;
          }
        }

        &.desc {
          .order {
            div.desc {
              border-bottom: 6px solid $yckYellow;
            }
          }
        }
        &.asc {
          .order {
            div.asc {
              border-top: 6px solid $yckYellow;
            }
          }
        }
      }
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    width: fit-content;
    overflow-y: auto;

    .table-row {
      display: flex;
      align-items: flex-start;
      padding: 15px 5px;

      &:nth-child(odd) {
        background-color: $yckDarkGrey;
        border-radius: 8px;
      }
      span {
        color: $background;
        font-size: 1.4rem;
      }

      &:last-child {
        border-bottom: none;
      }

      input {
        margin-right: 30px;
        margin-top: 4px;
      }

      & > div {
        flex: 1 1;
        padding-right: 30px;
        max-width: 300px;
        min-width: 300px;

        ul {
          list-style-type: none;
        }
      }
      .switch-wrapper {
        flex: 0.5 0.5;
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
        max-width: 100px;
        min-width: 100px;

        .edit {
          width: 15px;
          margin-right: 15px;
          cursor: pointer;
        }

        &.onlyEdit {
          min-width: 50px;
          max-width: 50px;
        }
      }
    }
  }
}
@media (max-width: 767.98px) {
  .table {
    display: none;
  }
}
</style>
