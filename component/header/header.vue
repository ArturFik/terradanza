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
      <div v-if="isAuthenticated && currentUser" class="mobile-menu__profile">
        <div class="mobile-menu__avatar">
          <img 
            v-if="avatarUrl" 
            :src="avatarUrl" 
            alt="Avatar" 
          />
          <div v-else class="mobile-menu__avatar-initials">
            {{ userInitials }}
          </div>
        </div>
        <div class="mobile-menu__user-info">
          <h3 class="mobile-menu__name">{{ fullName }}</h3>
          <p class="mobile-menu__rank">{{ rankLabel }}</p>
        </div>
      </div>
      
      <div v-else class="mobile-menu__profile mobile-menu__profile--guest">
        <div class="mobile-menu__avatar-guest">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="mobile-menu__user-info">
          <h3 class="mobile-menu__name">Гость</h3>
          <NuxtLink to="/auth" class="mobile-menu__login-link" @click="closeMenu">
            Войти в аккаунт
          </NuxtLink>
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
        
        <button 
          v-if="isAuthenticated" 
          class="mobile-menu__item mobile-menu__logout" 
          @click="handleLogout"
        >
          <div class="item-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
            </svg>
          </div>
          <span>Выйти</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const { currentUser, isAuthenticated, fetchMe, logout } = useAuth();
const { mediaUrl } = useMedia();

onMounted(async () => {
  if (isAuthenticated.value && !currentUser.value) {
    await fetchMe();
  }
});

const accountLink = computed(() => (isAuthenticated.value ? "/profile" : "/auth"));
const accountLabel = computed(() => (isAuthenticated.value ? "Профиль" : "Войти"));

const avatarUrl = computed(() => {
  const key = currentUser.value?.avatar_key;
  return key ? mediaUrl(key) : null;
});

const fullName = computed(() => {
  if (!currentUser.value) return "Гость";
  const parts = [currentUser.value?.surname, currentUser.value?.name].filter(Boolean);
  return parts.join(" ") || currentUser.value?.email || "Пользователь";
});

const userInitials = computed(() => {
  if (!currentUser.value) return "?";
  const surname = currentUser.value?.surname || '';
  const name = currentUser.value?.name || '';
  const firstChar = name ? name.charAt(0).toUpperCase() : '';
  const secondChar = surname ? surname.charAt(0).toUpperCase() : '';
  if (firstChar && secondChar) return `${firstChar}${secondChar}`;
  if (firstChar) return firstChar;
  if (secondChar) return secondChar;
  return '?';
});

const rankLabel = computed(() => {
  if (!currentUser.value) return "";
  const rankMap = {
    novice: "Новичок",
    amateur: "Любитель",
    pro: "Профи",
  };
  return rankMap[currentUser.value?.cached_rank || "novice"] || "Новичок";
});

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

const handleLogout = async () => {
  await logout();
  closeMenu();
  await navigateTo("/auth");
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
  color: #fff;
  height: 134px;
  position: relative;
  z-index: 100000;
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
      background-color: #fff;
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
  z-index: 100000;

  span {
    width: 100%;
    height: 3px;
    background-color: #fff;
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
  z-index: 100000;

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
  z-index: 100000;
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
    align-items: flex-start;
    gap: 15px;
    flex-direction: column;
    background: rgba(31, 58, 95, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &--guest {
      background: rgba(31, 58, 95, 0.5);
    }
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c65d3b, #a84a2d);
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
  
  &__avatar-initials {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c65d3b, #a84a2d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    color: #fffcf6;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
  }
  
  &__avatar-guest {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 252, 246, 0.6);
    
    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__user-info {
    flex: 1;
    width: 100%;
  }

  &__name {
    font-family: "Inter", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #fffcf6;
    margin: 0 0 4px 0;
  }
  
  &__rank {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: rgba(255, 252, 246, 0.7);
    margin: 0;
  }
  
  &__login-link {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: #c65d3b;
    text-decoration: none;
    margin-top: 4px;
    display: inline-block;
    
    &:hover {
      text-decoration: underline;
    }
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
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;

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
      border-left-color: #c65d3b;

      .item-icon {
        color: #c65d3b;
      }
    }
  }
  
  &__logout {
    margin-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-left: none;
    color: rgba(255, 252, 246, 0.8);
    
    &:hover {
      background: rgba(198, 93, 59, 0.2);
      color: #c65d3b;
      
      .item-icon {
        color: #c65d3b;
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
    z-index: 100000;
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

    &__avatar,
    &__avatar-initials,
    &__avatar-guest {
      width: 48px;
      height: 48px;
    }
    
    &__avatar-initials {
      font-size: 18px;
    }
    
    &__avatar-guest svg {
      width: 24px;
      height: 24px;
    }

    &__name {
      font-size: 16px;
    }

    &__item {
      padding: 12px 25px;
      font-size: 14px;
    }
  }
}
</style>