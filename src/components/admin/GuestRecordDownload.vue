<template>
  <b-card bg-variant="dark" class="container">
    <h2>Download da Ficha de Hóspede</h2>

    <div class="options">
      <strong>Período</strong>
      <date-range-picker
        ref="picker"
        opens="left"
        :locale-data="localeData"
        :minDate="minDate"
        :maxDate="maxDate"
        :ranges="false"
        singleDatePicker="range"
        :timePicker="false"
        v-model="dateRange"
        @toggle="logEvent('event: open', $event)"
        @start-selection="logEvent('event: startSelection', $event)"
        @finish-selection="logEvent('event: finishSelection', $event)"
      >
        <template v-slot:input="picker">
          {{ picker.startDate | date }} - {{ picker.endDate | date }}
        </template>
      </date-range-picker>
      <b-button variant="primary" :disabled="!hasRange" @click="handleDownload"
        >Baixar FNRH</b-button
      >
    </div>
    <Modal>hello</Modal>
  </b-card>
</template>

<script>
import moment from "moment";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import Modal from "@/components/Modal";

export default {
  name: "GuestRecordDownload",
  components: {
    DateRangePicker,
    Modal
  },
  data() {
    return {
      dateRange: {
        startDate: null,
        endDate: null
      },
      selectedDate: null,
      localeData: {
        direction: "ltr",
        format: "dd/mm/yyyy",
        separator: " - ",
        applyLabel: "Confirmar",
        cancelLabel: "Cancelar",
        weekLabel: "Semana",
        customRangeLabel: "Custom Range",
        daysOfWeek: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro"
        ],
        firstDay: 0
      }
    };
  },
  computed: {
    minDate() {
      return new Date(moment(this.selectedDate, "DD-MM-YYYY").subtract(31, "days"));
    },
    maxDate() {
      const today = new Date();
      const maxFutureRange = new Date(moment(this.selectedDate, "DD-MM-YYYY").add(31, "days"));

      const isInvalidDate = isNaN(Date.parse(maxFutureRange));

      if (isInvalidDate || today.getTime() < maxFutureRange.getTime()) {
        return today;
      }

      return maxFutureRange;
    },
    hasRange() {
      return this.dateRange.startDate && this.dateRange.endDate;
    }
  },
  filters: {
    date: function(value) {
      if (!value) return "";

      return moment(value).format("DD/MM/YYYY");
    }
  },
  methods: {
    async handleDownload() {
      const { startDate, endDate } = this.dateRange;
      const start = moment(startDate).format("DD/MM/YYYY");
      const end = moment(endDate).format("DD/MM/YYYY");

      const successMessage = `Baixando fichas de ${start} a ${end}`;
      const errorMessage = "Não há dados disponíveis para o período selecionado";

      const isOK = true;
      const message = isOK ? successMessage : errorMessage;

      this.$swal.fire({
        title: message,
        icon: "info",
        width: 500,
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        allowOutsideClick: true,
        confirmButtonText: `OK`,
        cancelButtonText: `cancel`,
        cancelButtonColor: "black",
        confirmButtonColor: "black",
        iconColor: "black",
        background: "#ffd400"
      });
    },
    logEvent(name, date) {
      this.selectedDate = date;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
}
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
}
h2 {
  color: $white;
}
.options {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 350px;
}
.options strong {
  color: $white;
  font-size: 11px;
}
.vue-daterange-picker {
  flex: 1;
  min-width: 118px;
}
.vue-daterange-picker div {
  background: black !important;
}
</style>
