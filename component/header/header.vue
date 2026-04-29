<template>
  <div class="header-container">
    <div class="header">
      <NuxtLink to="/" class="header-logo">TerraDanza</NuxtLink>
      <div class="header-menu">
        <NuxtLink to="/encyclopedia">Энциклопедия</NuxtLink>
        <NuxtLink to="/catalog">Курсы</NuxtLink>
        <NuxtLink to="/">Карта</NuxtLink>
      </div>
      <NuxtLink class="header-account" :to="accountLink">
        <img src="@/assets/img/Vector.png" alt="" />
        <p>{{ accountLabel }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentUser } = useAuth()

const accountLink = computed(() => (currentUser.value ? "/profile" : "/auth"))
const accountLabel = computed(() => (currentUser.value ? "Профиль" : "Войти"))
</script>

<style lang="scss">
@font-face {
  font-family: "NicoMoji";
  src: url("@/assets/fonts/NicoMoji-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.header-container {
  width: 100%;
  background-color: #11243f;
  padding: 20px 0;
  color: #fffcf6;
  height: 70px;
}

.header {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
}

.header-logo {
  font-family: "NicoMoji", sans-serif;
  font-size: 24px;
  font-weight: 300;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

.header-menu {
  display: flex;
  flex-direction: row;
  gap: 20px;
  font-family: "Inter", sans-serif;
  margin-right: 50px;

  a {
    text-decoration: none;
    color: inherit;
    position: relative;
    padding-bottom: 4px;

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #fffcf6;
      transition: width 0.3s ease;
    }

    &:hover::after,
    &.router-link-active::after {
      width: 100%;
    }
  }
}

.header-menu > a {
  font-size: 18px;
}

.header-account {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Inter", sans-serif;
  gap: 10px;
  color: inherit;
  text-decoration: none;

  img {
    width: 20px;
    height: 22px;
  }
}
</style>
