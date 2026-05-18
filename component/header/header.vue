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
      <button class="burger-button" @click="toggleMenu">
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
      </button>
    </div>
    <div
      class="menu-overlay"
      :class="{ active: isMenuOpen }"
      @click="closeMenu"
    ></div>
    <div class="mobile-menu" :class="{ active: isMenuOpen }">
      <div class="mobile-menu__profile">
        <div class="mobile-menu__avatar">
          <img src="" alt="Avatar" />
        </div>
        <div class="mobile-menu__user-info">
          <h3 class="mobile-menu__name">Солдатикова Ольга</h3>
        </div>
      </div>
      <nav class="mobile-menu__nav">
        <NuxtLink to="/profile" class="mobile-menu__item" @click="closeMenu">
          <div class="item-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span>Профиль</span>
        </NuxtLink>

        <NuxtLink
          to="/encyclopedia"
          class="mobile-menu__item"
          @click="closeMenu"
        >
          <span>Энциклопедия</span>
        </NuxtLink>

        <NuxtLink to="/catalog" class="mobile-menu__item" @click="closeMenu">
          <span>Курсы</span>
        </NuxtLink>

        <NuxtLink to="/" class="mobile-menu__item" @click="closeMenu">
          <span>Карта</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const { currentUser } = useAuth();
const accountLink = computed(() => (currentUser.value ? "/profile" : "/auth"));
const accountLabel = computed(() => (currentUser.value ? "Профиль" : "Войти"));

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = "";
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "NicoMoji";
  src: url("@/assets/fonts/NicoMoji-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.header-container {
  width: 100%;
  background-color: #11243f;
  padding: 10px 0;
  color: #fffcf6;
  height: 134px;
  position: relative;
  z-index: 100;
}

.header {
  padding: 0 167px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 35px;
  align-items: center;
}

.header-logo {
  font-family: "NicoMoji", sans-serif;
  font-size: 40px;
  font-weight: 300;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

.header-menu {
  display: flex;
  flex-direction: row;
  gap: 40px;
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
  font-size: 32px;
}

.header-account {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Inter", sans-serif;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  font-size: 32px;
  img {
    width: 30px;
    height: 32px;
  }
}

/* Бургер-кнопка */
.burger-button {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 200;

  span {
    width: 100%;
    height: 3px;
    background-color: #fffcf6;
    border-radius: 2px;
    transition: all 0.3s ease;

    &:nth-child(1).active {
      transform: translateY(9px) rotate(45deg);
    }

    &:nth-child(2).active {
      opacity: 0;
    }

    &:nth-child(3).active {
      transform: translateY(-9px) rotate(-45deg);
    }
  }
}

/* Оверлей */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 998;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100vh;
  background: linear-gradient(135deg, #0a1a2e 0%, #11243f 100%);
  backdrop-filter: blur(10px);
  z-index: 999;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
  overflow-y: auto;

  &.active {
    right: 0;
  }

  &__profile {
    padding: 70px 25px 25px;
    display: flex;
    align-items: left;
    gap: 15px;
    flex-direction: column;
    background: #1f3a5f;
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffd89b, #c7e9fb);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__user-info {
    flex: 1;
  }

  &__name {
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #fffcf6;
    margin: 0 0 4px 0;
  }

  &__email {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: rgba(255, 252, 246, 0.6);
    margin: 0;
  }

  /* Навигация */
  &__nav {
    display: flex;
    flex-direction: column;
    padding: 16px 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    text-decoration: none;
    color: #fffcf6;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;

    .item-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 252, 246, 0.7);
      transition: color 0.2s ease;
    }

    span {
      flex: 1;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-left-color: #ffd89b;

      .item-icon {
        color: #ffd89b;
      }
    }
  }
}

/* Десктопные стили остаются без изменений */
@media (max-width: 1200px) {
  .header {
    padding: 0 80px;
  }
}

@media (max-width: 992px) {
  .header {
    padding: 0 40px;
  }

  .header-menu {
    gap: 25px;
    margin-right: 20px;

    > a {
      font-size: 24px;
    }
  }

  .header-account {
    font-size: 24px;

    img {
      width: 24px;
      height: 26px;
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    height: auto;
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .header {
    padding: 0 20px;
    margin-top: 0;
    height: 70px;
    position: relative;
  }

  .header-logo {
    font-size: 20px;
    padding: 20px;
    margin: -20px;
  }

  .header-menu,
  .header-account {
    display: none;
  }

  .burger-button {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 15px;
    height: 60px;
  }

  .header-logo {
    font-size: 18px;
    padding: 15px;
    margin: -15px;
  }

  .burger-button {
    width: 25px;
    height: 18px;

    span {
      height: 2.5px;
    }
  }

  .mobile-menu {
    width: 280px;

    &__profile {
      padding: 70px 25px 20px;
    }

    &__avatar {
      width: 48px;
      height: 48px;
    }

    &__name {
      font-size: 14px;
    }

    &__item {
      padding: 12px 25px;
      font-size: 14px;
    }
  }
}
</style>
