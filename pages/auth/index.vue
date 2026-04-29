<template>
  <div class="auth-container">
    <Header />
    <div class="auth">
      <div class="auth__bg">
        <div class="auth__bg--white">
          <div
            class="auth__buttondiv"
            v-if="activeTab !== 'forgot-password'"
          >
            <button
              @click="activeTab = 'register'"
              class="register"
              :class="[
                'auth__tab-btn',
                { 'auth__tab-btn--active': activeTab === 'register' },
              ]"
            >
              Регистрация
            </button>
            <button
              @click="activeTab = 'login'"
              class="login"
              :class="[
                'auth__tab-btn',
                { 'auth__tab-btn--active': activeTab === 'login' },
              ]"
            >
              Вход
            </button>
          </div>

          <h1 v-if="activeTab === 'forgot-password'">Сброс пароля</h1>

          <form v-if="activeTab === 'register'" @submit.prevent="submitRegister">
            <input
              v-model="registerForm.name"
              type="text"
              placeholder="Имя"
            />
            <input
              v-model="registerForm.surname"
              type="text"
              placeholder="Фамилия"
            />
            <input v-model="registerForm.email" type="email" placeholder="Почта" />
            <input
              v-model="registerForm.password"
              type="password"
              placeholder="Пароль"
            />
            <button class="auth__submit-btn" :disabled="loading">
              Зарегистрироваться
            </button>
          </form>

          <form v-if="activeTab === 'login'" @submit.prevent="submitLogin">
            <input v-model="loginForm.email" type="email" placeholder="Почта" />
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="Пароль"
            />
            <p class="change-password" @click="activeTab = 'forgot-password'">
              Забыли пароль?
            </p>
            <button class="auth__submit-btn" :disabled="loading">Войти</button>
          </form>

          <form
            v-if="activeTab === 'forgot-password'"
            @submit.prevent="submitForgotPassword"
          >
            <input
              v-model="forgotPasswordEmail"
              type="email"
              placeholder="Почта"
            />
            <button class="auth__submit-btn" :disabled="loading">Отправить</button>
          </form>

          <p v-if="message" class="auth-message">{{ message }}</p>
          <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue"
import Footer from "@/component/footer/footer.vue"

const route = useRoute()
const { apiFetch } = useApi()
const { isAuthenticated, login, register } = useAuth()

if (isAuthenticated.value) {
  await navigateTo("/profile")
}

const activeTab = ref<"register" | "login" | "forgot-password">("register")
const loading = ref(false)
const message = ref("")
const errorMessage = ref("")

const registerForm = ref({
  name: "",
  surname: "",
  email: "",
  password: "",
})

const loginForm = ref({
  email: "",
  password: "",
})

const forgotPasswordEmail = ref("")

const getErrorMessage = (error: any) =>
  error?.data?.detail || error?.message || "Произошла ошибка"

const submitRegister = async () => {
  loading.value = true
  message.value = ""
  errorMessage.value = ""

  try {
    const response = await register({
      name: registerForm.value.name || undefined,
      surname: registerForm.value.surname || undefined,
      email: registerForm.value.email,
      password: registerForm.value.password,
    })
    message.value = response.message
    activeTab.value = "login"
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const submitLogin = async () => {
  loading.value = true
  message.value = ""
  errorMessage.value = ""

  try {
    await login(loginForm.value)
    await navigateTo((route.query.redirect as string) || "/profile")
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const submitForgotPassword = async () => {
  loading.value = true
  message.value = ""
  errorMessage.value = ""

  try {
    const response = await apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email: forgotPasswordEmail.value },
      skipAuthRetry: true,
    })
    message.value = response.message
    activeTab.value = "login"
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
.auth-container {
  background-color: #fffcf6;
}

.auth {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
  margin-top: 50px;

  h1 {
    font-size: 36px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 10px;
  }

  &__bg {
    border-radius: 25px;
    background-color: #11243f;
    background-image: url("@/assets/img/bgauth.png");
    background-size: auto;
    background-size: 100% auto;
    padding: 40px 0px;

    &--white {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      background-color: #fff;
      border-radius: 25px;
      padding: 60px 40px;
    }
  }

  &__buttondiv {
    display: flex;
    background-color: #f8f5ee;
    border-radius: 9999px;
    margin-bottom: 30px;
    transition: all 0.3s ease;

    &:hover:not(&--active) {
      background-color: #f8f5ee;
    }
  }

  &__tab-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: transparent;
    color: #999;

    &--active {
      background-color: #11243f;
      color: white;
    }
  }

  &__submit-btn {
    flex: 1;
    display: flex;
    margin-left: auto;
    margin-right: auto;
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
  }

  input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 0px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #11243f;
    }
  }
}

.register {
  width: 60%;
}

.login {
  width: 40%;
}

.change-password {
  font-size: 12px;
  font-weight: 300;
  color: #777777;
  text-align: left;
  font-family: "Inter", sans-serif;
  margin: 0;
  flex: 1;
  cursor: pointer;
}

.auth-message,
.auth-error {
  margin-top: 20px;
  text-align: center;
  font-family: "Inter", sans-serif;
}

.auth-error {
  color: #c65d3b;
}
</style>
