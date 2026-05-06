<template>
  <div class="profile-edit-container">
    <Header />
    <div class="profile-edit">
      <div class="profile-edit__bg">
        <div class="profile-edit__bg--white">
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
  background-color: #fffcf6;
  min-height: 100vh;
}

.profile-edit {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
  margin-top: 50px;
  margin-bottom: 50px;

  h1 {
    font-size: 36px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 30px;
  }

  &__bg {
    border-radius: 25px;
    background-color: #11243f;
    background-image: url("@/assets/img/bgauth.png");
    background-size: 100% auto;
    padding: 40px 0;

    &--white {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      background-color: #fff;
      border-radius: 25px;
      padding: 60px 40px;

      @media (max-width: 768px) {
        width: 90%;
        padding: 40px 20px;
      }
    }
  }

  &__submit-btn {
    display: block;
    width: 100%;
    padding: 12px 20px;
    background-color: #c65d3b;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 20px;
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
      padding: 12px;
      border: 0;
      border-bottom: 1px solid #ddd;
      font-size: 14px;
      box-sizing: border-box;
      font-family: "Inter", sans-serif;
      transition: border-color 0.3s ease;
      background-color: transparent;

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
    font-size: 12px;
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
</style>
