<template>
  <div class="admin-settings">
    <h1>Configurações</h1>
    <b-card no-body bg-variant="dark">
      <b-nav class="navs">
        <b-nav-item>
          <router-link to="/admin/settings/precheckin">Configurações do pré checkin</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/admin/settings/totem">Configurações do totem</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/admin/settings/optionals">Configurações opcionais</router-link>
        </b-nav-item>
      </b-nav>
    </b-card>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "AdminSettings"
};
</script>

<style lang="scss" scoped>
.admin-settings {
  h1 {
    color: $white;
    margin: 20px 0;
  }

  .card {
    width: 100%;
    margin-bottom: 40px;
  }

  .navs {
    flex-direction: column;
  }

  .nav-item {
    font-size: 1.6rem;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      color: $white;
      text-decoration: none;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .router-link-active {
        background-color: $yckYellow;
        border-radius: 8px;
        color: $yckDarkGrey;
        font-weight: 600;
      }
    }
  }
}

@media screen and (min-width: 992px) {
  .admin-settings {
    .navs {
      flex-direction: row;
    }

    .nav-item {
      width: calc((100% - 40px) / 3);
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
