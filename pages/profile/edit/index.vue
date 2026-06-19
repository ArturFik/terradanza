<template>
  <div class="profile-edit-container">
    <Header />
    <div class="profile-edit">
      <div class="profile-edit__bg">
        <div class="profile-edit__bg--white">
          <button
            class="profile-edit__close-btn"
            @click="goBackToAuth"
            aria-label="Вернуться в профиль"
          >
            ✕
          </button>
          <h1>Редактирование профиля</h1>

          <form @submit.prevent="handleSubmit">
            <div class="input-group">
              <input
                v-model="editForm.fullName"
                type="text"
                placeholder="Имя и фамилия"
                @input="handleNameChange"
              />
              <div v-if="nameSavedMessage" class="save-message success">
                {{ nameSavedMessage }}
              </div>
              <div v-if="nameErrorMessage" class="save-message error">
                {{ nameErrorMessage }}
              </div>
            </div>

            <div class="input-group">
              <input
                :value="currentUser?.email"
                type="email"
                placeholder="Почта"
                disabled
                class="disabled-input"
              />
            </div>

            <div class="input-group">
              <input
                type="password"
                value="**********"
                disabled
                class="password-input"
              />
            </div>

            <button
              type="button"
              class="profile-edit__submit-btn"
              @click="goToChangePassword"
            >
              Смена пароля
            </button>
          </form>

          <p v-if="message" class="profile-message">{{ message }}</p>
          <p v-if="errorMessage" class="profile-error">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";

const { currentUser, fetchMe, isAuthenticated } = useAuth();
const { apiFetch } = useApi();

if (!isAuthenticated.value) {
  await navigateTo({ path: "/auth", redirect: "/profile/edit" });
}

const goBackToAuth = () => { navigateTo("/profile");}

if (!currentUser.value) {
  await fetchMe();
}

const editForm = ref({
  fullName: "",
  originalName: "",
  surname: "",
  name: "",
});

let saveTimeout = null;
const nameSavedMessage = ref("");
const nameErrorMessage = ref("");
const loading = ref(false);
const message = ref("");
const errorMessage = ref("");

const initForm = () => {
  if (currentUser.value) {
    editForm.value.name = currentUser.value.name || "";
    editForm.value.surname = currentUser.value.surname || "";
    editForm.value.fullName =
      [editForm.value.surname, editForm.value.name].filter(Boolean).join(" ") ||
      "";
    editForm.value.originalName = editForm.value.fullName;
  }
};

initForm();

const handleNameChange = () => {
  nameSavedMessage.value = "";
  nameErrorMessage.value = "";

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    await saveNameAndSurname();
  }, 1000);
};

const saveNameAndSurname = async () => {
  const nameParts = editForm.value.fullName.trim().split(/\s+/);
  const surname = nameParts[0] || "";
  const name = nameParts.slice(1).join(" ") || "";

  if (surname === editForm.value.surname && name === editForm.value.name) {
    return;
  }

  loading.value = true;

  try {
    const response = await apiFetch("/users/me", {
      method: "PATCH",
      body: {
        name: name || undefined,
        surname: surname || undefined,
      },
    });

    editForm.value.name = response.name || "";
    editForm.value.surname = response.surname || "";
    editForm.value.originalName = editForm.value.fullName;

    if (currentUser.value) {
      currentUser.value.name = response.name || null;
      currentUser.value.surname = response.surname || null;
    }

    nameSavedMessage.value = "Имя сохранено";
    setTimeout(() => {
      nameSavedMessage.value = "";
    }, 3000);
  } catch (error) {
    nameErrorMessage.value =
      error?.data?.detail || "Ошибка при сохранении имени";
    editForm.value.fullName = editForm.value.originalName;
    setTimeout(() => {
      nameErrorMessage.value = "";
    }, 3000);
  } finally {
    loading.value = false;
  }
};

const goToChangePassword = () => {
  navigateTo("/change-password");
};

const handleSubmit = () => {};
</script>

<style lang="scss" scoped>
.profile-edit-container {
  background-color: #fff;
  min-height: 100vh;
}

.profile-edit {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
  margin-top: 50px;
  margin-bottom: 50px;
  position: relative;
  h1 {
    font-size: 50px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 43px;
  }

  &__close-btn {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    font-size: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #11243f;
    background-color: #fff;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__bg {
    border-radius: 70px;
    background-color: #11243f;
    background-image: url("@/assets/img/bgauth.png");
    background-size: 100% auto;
    padding: 40px 0;

    &--white {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      background-color: #fff;
      border-radius: 70px;
      padding: 78px 83px;
      position: relative;
      @media (max-width: 768px) {
        width: 90%;
        padding: 40px 20px;
      }
    }
  }

  &__submit-btn {
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding: 12px 50px;
    background-color: #c65d3b;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 35px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 63px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1a3650;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .input-group {
    margin-bottom: 20px;
    position: relative;

    input {
      width: 100%;
      padding: 18px;
      border: 0;
      border-bottom: 1px solid #ddd;
      font-size: 32px;
      box-sizing: border-box;
      font-family: "Inter", sans-serif;
      transition: border-color 0.3s ease;
      background-color: transparent;
      margin-bottom: 20px;
      &:focus {
        outline: none;
        border-color: #11243f;
      }

      &.disabled-input {
        color: #999;
        cursor: default;
      }

      &.password-input {
        color: #11243f;
        cursor: default;
      }
    }
  }

  .save-message {
    font-size: 18px;
    font-family: "Inter", sans-serif;
    margin-top: 5px;

    &.success {
      color: #4caf50;
    }

    &.error {
      color: #c65d3b;
    }
  }
}

.profile-message {
  margin-top: 20px;
  text-align: center;
  font-family: "Inter", sans-serif;
  color: #4caf50;
}

.profile-error {
  margin-top: 20px;
  text-align: center;
  font-family: "Inter", sans-serif;
  color: #c65d3b;
}

@media (max-width: 1400px) {
  .profile-edit {
    margin-top: 69px;
    padding: 0 20px;
    
    h1 {
      font-size: 25px;
      margin-bottom: 32px;
    }
    
    &__bg {
      padding: 0px;
      border-radius: 75px;
      
      &--white {
        width: calc(100% - 44px);
        padding: 39px 22px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.2);
        border-radius: 40px;
        
        input {
          font-size: 16px;
          padding: 5px;
        }
      }
    }
    
    &__close-btn {
      font-size: 20px;
      top: 20px;
      right: 20px;
      width: 20px;
      height: 20px;
    }
    
    &__submit-btn {
      font-size: 19px;
      padding: 10px 37px;
      margin: 32px auto 0;
    }
    
    .input-group {
      margin-bottom: 0;
      input {
        font-size: 16px;
        padding: 5px;
        margin-bottom: 20px;
      }
    }
    
    .save-message {
      font-size: 10px;
    }
  }
  
  .profile-message,
  .profile-error {
    font-size: 10px;
    margin: 0;
  }
}

</style>
