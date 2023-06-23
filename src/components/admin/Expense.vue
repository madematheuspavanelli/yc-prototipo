<template>
  <div class="expense-wrapper">
    <div class="expense-form">
      <div class="expense-form-group">
        <label for="">{{ this.$t("message.newExpense") }}</label>
        <input v-model="description" placeholder="Digite" type="text" />
      </div>
      <div class="expense-form-group-amount">
        <label for="">{{ this.$t("message.tableValue") }}</label>
        <div class="monetary-field">
          <input
            :value="amount"
            @blur="event => floatToBRL(event.target.value)"
            placeholder="00,00"
            type="text"
          />
        </div>
      </div>

      <button @click="createExpense" class="add-value">
        {{ this.$t("message.confirmCharge") }}
      </button>
    </div>
    <b-card bg-variant="dark" no-body class="table-holder">
      <b-table
        :fields="tableLabels"
        :items="expenses"
        responsive
        striped
        borderless
        dark
        sticky-header="400px"
        table-variant="dark"
      ></b-table>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Expense",
  data() {
    return {
      amount: "",
      description: "",
      tableLabels: [
        {
          key: "description",
          label: this.$t("message.history"),
          sortable: false
        },
        {
          key: "amount",
          label: this.$t("message.tableValue"),
          sortable: false
        }
      ],
      expenses: []
    };
  },
  props: {
    bookingId: {
      type: Number,
      required: true
    },
    guestId: {
      type: Number,
      required: true
    }
  },
  methods: {
    async createExpense() {
      if (this.description.trim() === "" || this.amount.trim() === "") {
        return;
      }
      const description = this.description;
      const amount = this.formattedAmount;
      const result = await this.$swal.fire({
        title: this.$t("alert.chargeExtra", { amount, description }),
        icon: "info",
        width: 500,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.collect"
        )}</label>`,
        cancelButtonText: `<label style="font-size:18px; color: white; cursor: pointer;">${this.$t(
          "message.cancel"
        )}</label>`,
        cancelButtonColor: "black",
        confirmButtonColor: "black",
        iconColor: "black",
        background: "#ffd400"
      });

      const { isConfirmed } = result;
      if (isConfirmed) {
        this.$API.admin
          .createExpense({
            bookingId: this.bookingId,
            userId: this.guestId,
            amount: parseInt(this.amount.replace(".", "").replace(",", "")),
            description: this.description
          })
          .then(data => {
            console.log(data);
            this.pushOnExpenseArray(this.amount, this.description);
            this.amount = "";
            this.description = "";
          })
          .catch(error => {
            console.log(error);
            this.amount = "";
            this.description = "";
          });
      }
    },
    formatMoney(value) {
      return parseFloat(
        value
          .replace(".", "")
          .replace(",", ".")
          .replace("R$", "")
      ).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    floatToBRL(value) {
      this.amount = parseFloat(value.replace(".", "").replace(",", ".")).toLocaleString("pt-br", {
        minimumFractionDigits: 2
      });
    },
    centsToBRL(value) {
      let parsedValue = String(value)
        .replace(".", "")
        .replace(",", "");
      const newAmount = parseInt(parsedValue) / 100;

      return newAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    pushOnExpenseArray(amount, description) {
      const newAmount = this.centsToBRL(amount);
      console.log(amount, description);
      this.expenses.push({ description: description, amount: newAmount });
    },
    async getExpensesList() {
      this.$API.admin.listExpense(this.guestId, this.bookingId).then(response => {
        console.log(response);
        response.forEach(item => {
          const { amount, description } = item;
          this.pushOnExpenseArray(amount, description);
        });
      });
    }
  },
  computed: {
    formattedAmount() {
      return this.formatMoney(this.amount);
    }
  },
  mounted() {
    this.getExpensesList();
  }
};
</script>

<style lang="scss" scoped>
.expense-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;

  .expense-form {
    display: flex;
    padding: 10px 0.75rem 20px 0.75rem;
    background-color: $yckLightGrey;
    justify-content: flex-end;
    align-items: flex-end;

    .expense-form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-right: 15px;

      label {
        font-size: 11px;
        color: #fff;
      }

      input {
        height: 30px;
        background-color: unset;
        border: 0.3px solid #7c7c7c;
        border-radius: 5px;
        color: #7c7c7c;
        font-size: 11px;
        padding: 8px 11px;
        text-transform: none;

        &:focus {
          outline: none;
        }
      }
    }

    .expense-form-group-amount {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-right: 15px;

      .monetary-field {
        width: 100%;
        height: 30px;
        border: 0.3px solid #7c7c7c;
        border-radius: 5px;
        color: #7c7c7c;
        padding-left: 11px;
        display: flex;

        &::before {
          content: "R$";
          margin-top: 6px;
          margin-right: 1px;
        }

        input {
          height: 100%;
          width: 100%;
          padding: 8px 11px 8px 0px;
          background-color: unset;
          border: unset;
          color: #7c7c7c;
          font-size: 11px;

          text-transform: none;

          &:focus {
            outline: none;
          }
        }
      }

      label {
        font-size: 11px;
        color: #fff;
        width: 100%;
      }
    }
  }

  .add-value {
    background-color: #ffd400;
    border-radius: 4px;
    width: 200px;
    height: 30px;
    font-weight: 900;
    font-size: 11px;
    color: #2a2c2e;
  }
}
</style>
