<template>
  <Layout :title="$t('pages.invoice.title')" :footerButtonAction="openConfirmationModal">
    <h2 class="flex justify-between font-semibold text-[26px] mb-2">
      Dados da hospedagem
      <small class="text-base font-normal">Emissão: {{ issuance }}</small>
    </h2>
    <table>
      <thead>
        <tr>
          <th class="w-[180px]">Reserva</th>
          <th class="w-[180px]">UH (Quarto)</th>
          <th class="flex-1">Nome</th>
          <th class="w-[200px]">Documento</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>123412</td>
          <td>406E</td>
          <td class="flex-1">Eduardo Silva</td>
          <td>43.771.831-1</td>
        </tr>
      </tbody>
    </table>
    <table class="mb-4">
      <thead>
        <tr>
          <th>Endereço</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Estrada do Campo Limpo, 2645 - São Paulo - SP</td>
        </tr>
      </tbody>
    </table>

    <h3 class="pt-[18px] pb-3 px-2.5 bg-youcheckin-gray/60 font-bold text-xl leading-3">Fatura</h3>
    <table>
      <thead>
        <tr>
          <th class="w-[180px]">Data</th>
          <th>Descrição</th>
          <th class="w-[180px]">UH</th>
          <th class="w-[180px]">Pago</th>
          <th class="w-[180px]">Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>31/06/2022</td>
          <td>Consumo do frigobar</td>
          <td>408E</td>
          <td class="text-youcheckin-red">Não</td>
          <td>R$ 25,00</td>
        </tr>
        <tr>
          <td>31/06/2022</td>
          <td>Hospedagem</td>
          <td>408E</td>
          <td class="text-youcheckin-blue">Sim</td>
          <td>R$ 1.500,00</td>
        </tr>
      </tbody>
    </table>

    <div
      class="bg-[#f5f5f5] border-b-2 border-youcheckin-gray font-semibold absolute bottom-0 left-0 h-16 w-[964px] flex flex-col items-end justify-end px-6 leading-7"
    >
      <strong class="font-medium text-[26px]">Total a pagar: R$ 25,00</strong>
      <p class="text-base font-normal">Já pagos: R$ 1.500,00</p>
    </div>

    <BillingConfirmationModal
      :showModal="showBillingConfirmationModal"
      @agree="handleAgree"
      @notAgree="closeConfirmationModal"
    />
  </Layout>
</template>

<script>
import Layout from "@/components/widgets/layouts/Default.vue";
import BillingConfirmationModal from "@/components/widgets/molecules/BillingConfirmationModal.vue";

export default {
  name: "InvoicePage",
  components: {
    Layout,
    BillingConfirmationModal
  },
  data() {
    return {
      showBillingConfirmationModal: false
    };
  },
  computed: {
    issuance() {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "medium"
      }).format(new Date());
    }
  },
  methods: {
    openConfirmationModal() {
      this.showBillingConfirmationModal = true;
    },
    closeConfirmationModal() {
      this.showBillingConfirmationModal = false;
    },
    handleAgree() {
      this.showBillingConfirmationModal = false;
      this.$router.push({ name: "Signature" });
    }
  }
};
</script>

<style scoped>
table {
  @apply w-full text-xl leading-5;
}
table thead {
  @apply bg-[#f5f5f5] border-b-2 border-youcheckin-gray font-semibold;
}
th,
td {
  @apply pt-3.5 pb-3 px-2.5;
}
tr + tr {
  @apply border-t border-youcheckin-gray-light;
}
</style>
