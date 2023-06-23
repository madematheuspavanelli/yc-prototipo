<template>
  <PreCheckinStructure :dotActive="'eight'" :backButton="false" :form="true">
    <div class="title" slot="title">
      <span>{{ $t("message.precheckinSuccess") }}</span>
      <span>{{ $t("message.seeyousoon") }}</span>
    </div>
  </PreCheckinStructure>
</template>
<script>
import PreCheckinStructure from "@/components/PreCheckinStructure";

export default {
  name: "EndPreCheckin",
  components: {
    PreCheckinStructure
  }
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  span {
    font-size: 18px;
    color: $white;
    font-weight: 500;
    text-align: center;
  }

  img {
    margin: 0 auto;
    margin-top: 20px;
  }
}

@media (min-width: 300px) {
  .title {
    span {
      font-size: 20px;
    }
  }
}
@media (min-width: 412px) {
  .title {
    span {
      font-size: 20px;
    }
  }
}
@media (min-width: 768px) {
  .title {
    span {
      font-size: 30px;
    }
  }
}

@media (min-width: 1400px) {
  .title {
    span {
      font-size: 40px;
    }
  }
}
</style>
