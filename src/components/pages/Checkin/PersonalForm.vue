<template>
  <Layout title="Dados pessoais" :footerButtonAction="goToAddress">
    <div class="grid grid-cols-2 gap-[30px] mb-10">
      <TotemInput label="Nome e/ou Sobrenome" />
      <TotemInput label="Número do celular*" />
      <TotemInput label="Data de nascimento" />
      <TotemInput label="Gênero" />
      <TotemInput label="Tipo de documento" />
      <TotemInput label="Tipo de documento" />
      <TotemInput label="E-mail" />
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/widgets/layouts/Default.vue";

export default {
  name: "PersonalForm",
  components: {
    Layout
  },
  methods: {
    goToAddress() {
      this.$router.push({ name: "AddressForm" });
    }
  }
};
</script>
