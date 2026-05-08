<template>
  <div class="auth-container">
    <Header />
    <div class="auth">
      <div class="auth__bg">
        <div class="auth__bg--white">
          <button
            v-if="activeTab === 'forgot-password'"
            class="auth__close-btn"
            @click="goBackToAuth"
            aria-label="Вернуться к входу/регистрации"
          >
            ✕
          </button>

          <div class="auth__buttondiv" v-if="activeTab !== 'forgot-password'">
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

          <form
            v-if="activeTab === 'register'"
            @submit.prevent="submitRegister"
          >
            <input v-model="registerForm.name" type="text" placeholder="Имя" />
            <input
              v-model="registerForm.surname"
              type="text"
              placeholder="Фамилия"
            />
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="Почта"
            />
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
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
            <p class="change-password" @click="activeTab = 'forgot-password'">
              Забыли пароль?
            </p>
            <button class="auth__submit-btn" :disabled="loading">Войти</button>
          </form>

          <form
            v-if="activeTab === 'forgot-password' && resetStep === 1"
            @submit.prevent="submitForgotPassword"
          >
            <input
              v-model="forgotPasswordEmail"
              type="email"
              placeholder="Почта"
              :disabled="loading"
            />
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
            <div v-if="resetEmailError" class="error-message">
              {{ resetEmailError }}
            </div>
            <button class="auth__submit-btn" :disabled="loading">
              {{ loading ? "Отправка..." : "Отправить код" }}
            </button>
          </form>

          <form
            v-if="activeTab === 'forgot-password' && resetStep === 2"
            @submit.prevent="submitResetCode"
          >
            <div class="code-inputs">
              <input
                v-for="(_, index) in 4"
                :key="index"
                :ref="(el) => setCodeInputRef(el, index)"
                v-model="resetCodeForm[index]"
                type="text"
                maxlength="1"
                class="code-digit"
                :class="{ 'error-border': resetCodeError }"
                @input="handleCodeInput(index, $event)"
                @keydown="handleCodeKeydown(index, $event)"
                @paste="handleCodePaste"
              />
            </div>
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
            <div v-if="resetCodeError" class="error-message">
              {{ resetCodeError }}
            </div>
            <button
              class="auth__submit-btn"
              :disabled="loading || !isResetCodeComplete"
            >
              {{ loading ? "Проверка..." : "Подтвердить код" }}
            </button>
          </form>

          <form
            v-if="activeTab === 'forgot-password' && resetStep === 3"
            @submit.prevent="submitResetPassword"
          >
            <input
              v-model="resetPasswordForm.password"
              type="password"
              placeholder="Новый пароль"
              :disabled="loading"
            />
            <input
              v-model="resetPasswordForm.confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              :disabled="loading"
            />
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
            <div v-if="resetPasswordError" class="error-message">
              {{ resetPasswordError }}
            </div>
            <button
              class="auth__submit-btn"
              :disabled="loading || !isResetPasswordValid"
            >
              {{ loading ? "Сохранение..." : "Сохранить пароль" }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";

const route = useRoute();
const { apiFetch } = useApi();
const { isAuthenticated, login, register } = useAuth();

if (isAuthenticated.value) {
  await navigateTo("/profile");
}

const activeTab = ref("register");
const resetStep = ref(1);
const loading = ref(false);
const message = ref("");
const errorMessage = ref("");
const resetCode = ref("");

const registerForm = ref({
  name: "",
  surname: "",
  email: "",
  password: "",
});

const loginForm = ref({
  email: "",
  password: "",
});

const forgotPasswordEmail = ref("");
const resetEmailError = ref("");
const resetCodeError = ref("");
const resetPasswordError = ref("");
const resetCodeForm = ref(["", "", "", ""]);
const resetPasswordForm = ref({
  password: "",
  confirmPassword: "",
});
const codeInputs = ref([]);

const setCodeInputRef = (el, index) => {
  if (el) {
    codeInputs.value[index] = el;
  }
};

const isResetCodeComplete = computed(() => {
  return resetCodeForm.value.every((digit) => digit && digit.length === 1);
});

const isResetPasswordValid = computed(() => {
  return (
    resetPasswordForm.value.password.length >= 6 &&
    resetPasswordForm.value.confirmPassword.length >= 6 &&
    resetPasswordForm.value.password === resetPasswordForm.value.confirmPassword
  );
});

const getErrorMessage = (error) => {
  if (error?.data?.detail === "invalid_credentials") {
    return "Не правильный пароль или почта";
  }
  return error?.data?.detail || error?.message || "Произошла ошибка";
};

const goBackToAuth = () => {
  resetStep.value = 1;
  forgotPasswordEmail.value = "";
  resetCodeForm.value = ["", "", "", ""];
  resetCode.value = "";
  resetPasswordForm.value = { password: "", confirmPassword: "" };
  resetEmailError.value = "";
  resetCodeError.value = "";
  resetPasswordError.value = "";
  errorMessage.value = "";
  activeTab.value = "login";
};

const submitRegister = async () => {
  loading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    const response = await register({
      name: registerForm.value.name || undefined,
      surname: registerForm.value.surname || undefined,
      email: registerForm.value.email,
      password: registerForm.value.password,
    });
    message.value = response.message;
    activeTab.value = "login";
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const submitLogin = async () => {
  loading.value = true;
  message.value = "";
  errorMessage.value = "";

  try {
    await login(loginForm.value);
    await navigateTo(route.query.redirect || "/profile");
  } catch (error) {
    if (error?.data?.detail === "invalid_credentials") {
      errorMessage.value = "Не правильный пароль или почта";
    } else {
      errorMessage.value = getErrorMessage(error);
    }
  } finally {
    loading.value = false;
  }
};

const handleCodeInput = (index, event) => {
  const input = event.target;
  const value = input.value;

  if (value && !/^\d$/.test(value)) {
    input.value = "";
    resetCodeForm.value[index] = "";
    return;
  }

  if (value.length === 1 && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
};

const handleCodeKeydown = (index, event) => {
  if (event.key === "Backspace" && !resetCodeForm.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
};

const handleCodePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text") || "";
  const digits = pastedData.replace(/\D/g, "").slice(0, 4).split("");

  digits.forEach((digit, idx) => {
    if (idx < 4) {
      resetCodeForm.value[idx] = digit;
      if (codeInputs.value[idx]) {
        codeInputs.value[idx].value = digit;
      }
    }
  });

  const lastFilledIndex = digits.length - 1;
  if (lastFilledIndex < 3 && codeInputs.value[lastFilledIndex + 1]) {
    codeInputs.value[lastFilledIndex + 1]?.focus();
  }
};

const getResetCode = () => {
  return resetCodeForm.value.join("");
};

const clearResetErrors = () => {
  resetEmailError.value = "";
  resetCodeError.value = "";
  resetPasswordError.value = "";
};

const submitForgotPassword = async () => {
  if (!forgotPasswordEmail.value) {
    resetEmailError.value = "Введите email";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail.value)) {
    resetEmailError.value = "Введите корректный email";
    return;
  }

  loading.value = true;
  clearResetErrors();
  errorMessage.value = "";

  try {
    const response = await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: { email: forgotPasswordEmail.value },
      skipAuthRetry: true,
    });

    if (response.success) {
      errorMessage.value =
        response.message || "Код подтверждения отправлен на вашу почту";
      resetStep.value = 2;
      setTimeout(() => {
        if (codeInputs.value[0]) {
          codeInputs.value[0].focus();
        }
      }, 100);
    } else {
      resetEmailError.value = response.message || "Ошибка при отправке кода";
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error?.status === 404) {
      resetEmailError.value = "Пользователь с таким email не найден";
    } else {
      resetEmailError.value = error?.data?.detail || "Ошибка при отправке кода";
    }
  } finally {
    loading.value = false;
  }
};

const submitResetCode = async () => {
  const code = getResetCode();

  if (code.length !== 4) {
    resetCodeError.value = "Введите 4-значный код";
    return;
  }

  loading.value = true;
  clearResetErrors();

  try {
    resetCode.value = code;

    resetStep.value = 3;
    errorMessage.value = "Код подтвержден, введите новый пароль";
  } catch (error) {
    console.error("Error:", error);
    resetCodeError.value = "Произошла ошибка";
  } finally {
    loading.value = false;
  }
};

const submitResetPassword = async () => {
  if (resetPasswordForm.value.password.length < 6) {
    resetPasswordError.value = "Пароль должен содержать не менее 6 символов";
    return;
  }

  if (
    resetPasswordForm.value.password !== resetPasswordForm.value.confirmPassword
  ) {
    resetPasswordError.value = "Пароли не совпадают";
    return;
  }

  loading.value = true;
  clearResetErrors();

  try {
    const response = await apiFetch("/auth/reset-password", {
      method: "POST",
      body: {
        token: resetCode.value,
        email: forgotPasswordEmail.value,
        code: resetCode.value,
        new_password: resetPasswordForm.value.password,
      },
      skipAuthRetry: true,
    });

    if (response.success) {
      errorMessage.value = response.message || "Пароль успешно изменен";
      setTimeout(() => {
        activeTab.value = "login";
        resetStep.value = 1;
        forgotPasswordEmail.value = "";
        resetCodeForm.value = ["", "", "", ""];
        resetCode.value = "";
        resetPasswordForm.value = { password: "", confirmPassword: "" };
        errorMessage.value = "";
      }, 2000);
    } else {
      resetPasswordError.value =
        response.message || "Неверный код подтверждения";
    }
  } catch (error) {
    console.error("Reset password error:", error);
    if (error?.data?.detail === "Invalid code" || error?.status === 400) {
      resetPasswordError.value =
        "Неверный код подтверждения. Пожалуйста, запросите новый код";
      setTimeout(() => {
        resetStep.value = 2;
        resetCode.value = "";
        resetCodeForm.value = ["", "", "", ""];
      }, 2000);
    } else {
      resetPasswordError.value =
        error?.data?.detail || "Ошибка при смене пароля";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.auth-container {
  background-color: #fffcf6;
}

.auth {
  padding: 0 135px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
  margin-top: 50px;

  h1 {
    font-size: 50px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 10px;
  }

  &__bg {
    border-radius: 70px;
    background-color: #11243f;
    background-image: url("@/assets/img/bgauth.png");
    background-size: auto;
    background-size: 100% auto;
    padding: 75px 0px;
    position: relative;

    &--white {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      background-color: #fff;
      border-radius: 70px;
      padding: 115px 83px 85px 83px;
      position: relative;
    }
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

  &__buttondiv {
    display: flex;
    background-color: #f8f5ee;
    border-radius: 9999px;
    margin-bottom: 73px;
    transition: all 0.3s ease;
    width: 75%;
    margin-left: auto;
    margin-right: auto;
    &:hover:not(&--active) {
      background-color: #f8f5ee;
    }
  }

  &__tab-btn {
    padding: 12px 82px;
    border: none;
    border-radius: 9999px;
    font-size: 35px;
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
    display: flex;
    margin-left: auto;
    margin-right: auto;
    padding: 16px 59px;
    background-color: #c65d3b;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 35px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 100px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1a3650;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input:not(.code-digit) {
    width: 100%;
    padding: 20px;
    border: 0px;
    border-bottom: 1px solid #ddd;
    font-size: 32px;
    margin-bottom: 20px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #11243f;
    }
  }

  .code-inputs {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 20px;

    .code-digit {
      width: 60px;
      height: 60px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      font-family: "Inter", sans-serif;
      border: 2px solid #ddd;
      border-radius: 12px;
      background-color: #fff;
      padding: 0;
      margin: 0;

      &:focus {
        outline: none;
        border-color: #11243f;
        box-shadow: 0 0 0 2px rgba(17, 36, 63, 0.1);
      }

      &.error-border {
        border-color: #c65d3b;
      }
    }
  }

  .error-message {
    font-size: 12px;
    font-family: "Inter", sans-serif;
    color: #c65d3b;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: left;
  }
}

.register {
  width: 65%;
}

.login {
  width: 40%;
}

.change-password {
  font-size: 24px;
  font-weight: 300;
  color: #777777;
  text-align: left;
  font-family: "Inter", sans-serif;
  margin: 20px 0 0 20px;
  flex: 1;
  cursor: pointer;

  &:hover {
    color: #11243f;
  }
}

.auth-message,
.auth-error {
  margin-top: 10px;
  font-size: 18px;
  text-align: center;
  font-family: "Inter", sans-serif;
}

.auth-message {
  color: #4caf50;
}

.auth-error {
  color: #c65d3b;
}
</style>
