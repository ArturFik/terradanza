<template>
  <div class="reset-container">
    <Header />
    <div class="reset">
      <div class="reset__bg">
        <div class="reset__bg--white">
          <button
            v-if="step > 1"
            class="reset__back-btn-top"
            @click="goToPreviousStep"
            aria-label="Назад"
          >Назад
          </button>

          <h1>Сброс пароля</h1>

          <form v-if="step === 1" @submit.prevent="submitEmail">
            <input
              v-model="emailForm.email"
              type="email"
              placeholder="Почта"
              :disabled="loading"
            />
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
            <button class="reset__submit-btn" :disabled="loading">
              {{ loading ? "Отправка..." : "Далее" }}
            </button>
          </form>

          <form v-if="step === 2" @submit.prevent="submitCode">
            <div class="code-inputs">
              <input
                v-for="(_, index) in 4"
                :key="index"
                :ref="(el) => setCodeInputRef(el, index)"
                v-model="codeForm[index]"
                type="text"
                maxlength="1"
                class="code-digit"
                :class="{ 'error-border': codeError }"
                @input="handleCodeInput(index, $event)"
                @keydown="handleCodeKeydown(index, $event)"
                @paste="handleCodePaste"
              />
            </div>
            <div v-if="codeError" class="error-message">{{ codeError }}</div>
            <button
              class="reset__submit-btn"
              :disabled="loading || !isCodeComplete"
            >
              {{ loading ? "Проверка..." : "Подтвердить код" }}
            </button>
          </form>

          <form v-if="step === 3" @submit.prevent="submitNewPassword">
            <input
              v-model="passwordForm.password"
              type="password"
              placeholder="Новый пароль"
              :disabled="loading"
            />
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              :disabled="loading"
            />
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            <button
              class="reset__submit-btn"
              :disabled="loading || !isPasswordValid"
            >
              {{ loading ? "Сохранение..." : "Сохранить пароль" }}
            </button>
          </form>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="error-message global-error">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";

const { apiFetch } = useApi();
const { isAuthenticated } = useAuth();

if (!isAuthenticated.value) {
  await navigateTo("/auth");
}

const step = ref(1);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const savedCode = ref("");

const emailForm = ref({
  email: "",
});

const codeForm = ref(["", "", "", ""]);

const passwordForm = ref({
  password: "",
  confirmPassword: "",
});

const emailError = ref("");
const codeError = ref("");
const passwordError = ref("");

const codeInputs = ref([]);

const setCodeInputRef = (el, index) => {
  if (el) {
    codeInputs.value[index] = el;
  }
};

const isCodeComplete = computed(() => {
  return codeForm.value.every((digit) => digit && digit.length === 1);
});

const isPasswordValid = computed(() => {
  return (
    passwordForm.value.password.length >= 6 &&
    passwordForm.value.confirmPassword.length >= 6 &&
    passwordForm.value.password === passwordForm.value.confirmPassword
  );
});

const handleCodeInput = (index, event) => {
  const input = event.target;
  const value = input.value;

  if (value && !/^\d$/.test(value)) {
    input.value = "";
    codeForm.value[index] = "";
    return;
  }

  if (value.length === 1 && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
};

const handleCodeKeydown = (index, event) => {
  if (event.key === "Backspace" && !codeForm.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
};

const handleCodePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text") || "";
  const digits = pastedData.replace(/\D/g, "").slice(0, 4).split("");

  digits.forEach((digit, idx) => {
    if (idx < 4) {
      codeForm.value[idx] = digit;
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

const getCode = () => {
  return codeForm.value.join("");
};

const clearErrors = () => {
  emailError.value = "";
  codeError.value = "";
  passwordError.value = "";
  errorMessage.value = "";
};

const clearSuccess = () => {
  successMessage.value = "";
};

const submitEmail = async () => {
  if (!emailForm.value.email) {
    emailError.value = "Введите email";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.value.email)) {
    emailError.value = "Введите корректный email";
    return;
  }

  loading.value = true;
  clearErrors();
  clearSuccess();

  try {
    const response = await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: { email: emailForm.value.email },
      skipAuthRetry: true,
    });

    if (response.success) {
      successMessage.value = "Код подтверждения отправлен на вашу почту";
      step.value = 2;
      setTimeout(() => {
        if (codeInputs.value[0]) {
          codeInputs.value[0].focus();
        }
      }, 100);
    } else {
      emailError.value = response.message || "Ошибка при отправке кода";
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error?.status === 404) {
      emailError.value = "Пользователь с таким email не найден";
    } else {
      emailError.value = error?.data?.detail || "Ошибка при отправке кода";
    }
  } finally {
    loading.value = false;
  }
};

const submitCode = async () => {
  const code = getCode();

  if (code.length !== 4) {
    codeError.value = "Введите 4-значный код";
    return;
  }

  loading.value = true;
  clearErrors();

  try {
    savedCode.value = code;

    step.value = 3;
    successMessage.value = "Код подтвержден, введите новый пароль";

    passwordForm.value.password = "";
    passwordForm.value.confirmPassword = "";
  } catch (error) {
    console.error("Error:", error);
    codeError.value = "Произошла ошибка";
  } finally {
    loading.value = false;
  }
};

const submitNewPassword = async () => {
  if (passwordForm.value.password.length < 6) {
    passwordError.value = "Пароль должен содержать не менее 6 символов";
    return;
  }

  if (passwordForm.value.password !== passwordForm.value.confirmPassword) {
    passwordError.value = "Пароли не совпадают";
    return;
  }

  loading.value = true;
  clearErrors();

  try {
    const response = await apiFetch("/auth/reset-password", {
      method: "POST",
      body: {
        token: savedCode.value,
        email: emailForm.value.email,
        code: savedCode.value,
        new_password: passwordForm.value.password,
      },
      skipAuthRetry: true,
    });

    if (response.success) {
      successMessage.value =
        response.message || "Пароль успешно изменен! Перенаправление...";
      setTimeout(() => {
        navigateTo("/auth?reset=success");
      }, 2000);
    } else {
      passwordError.value = response.message || "Неверный код подтверждения";
    }
  } catch (error) {
    console.error("Reset password error:", error);
    if (error?.data?.detail === "Invalid code" || error?.status === 400) {
      passwordError.value =
        "Неверный код подтверждения. Пожалуйста, запросите новый код";
      setTimeout(() => {
        step.value = 2;
        savedCode.value = "";
        codeForm.value = ["", "", "", ""];
        setTimeout(() => {
          if (codeInputs.value[0]) {
            codeInputs.value[0].focus();
          }
        }, 100);
      }, 2000);
    } else {
      passwordError.value = error?.data?.detail || "Ошибка при смене пароля";
    }
  } finally {
    loading.value = false;
  }
};

const goToPreviousStep = () => {
  if (step.value === 2) {
    step.value = 1;
    clearErrors();
    clearSuccess();
    codeForm.value = ["", "", "", ""];
  } else if (step.value === 3) {
    step.value = 2;
    clearErrors();
    clearSuccess();
    passwordForm.value = { password: "", confirmPassword: "" };
    setTimeout(() => {
      if (codeInputs.value[0]) {
        codeInputs.value[0].focus();
      }
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
.reset-container {
  background-color: #fffcf6;
  min-height: 100vh;
}

.reset {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
  margin-top: 50px;
  margin-bottom: 50px;

  h1 {
    font-size: 50px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 50px;
  }

  &__bg {
    border-radius: 70px;
    background-color: #11243f;
    background-image: url("@/assets/img/bgauth.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    padding: 40px 0;
    position: relative;

    &--white {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      background-color: #fff;
      border-radius: 70px;
      padding: 80px 80px;
      position: relative;
    }
  }

  &__back-btn-top {
    position: absolute;
    top: 40px;
    left: 40px;
    background: none;
    border: none;
    font-size: 30px;
    font-weight: 500;
    color: #11243f;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-family: "Inter", sans-serif;

    &:hover {
      background-color: #f8f5ee;
      transform: translateX(-2px);
    }
  }

  &__submit-btn {
    display: flex;
    flex: 1;
    margin-left: auto;
    margin-right: auto;
    padding: 16px 68px;
    background-color: #c65d3b;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 35px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
      background-color: #1a3650;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input:not(.code-digit) {
    width: 100%;
    padding: 35px;
    margin-bottom: 15px;
    border: 0;
    border-bottom: 1px solid #ddd;
    font-size: 30px;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
    background-color: transparent;

    &:focus {
      outline: none;
      border-color: #11243f;
    }

    &:disabled {
      background-color: transparent;
      cursor: not-allowed;
    }
  }

  .code-inputs {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 50px;

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
    font-size: 18px;
    font-family: "Inter", sans-serif;
    color: #c65d3b;
    margin-top: -10px;
    margin-bottom: 10px;
    margin-left: 35px;
    text-align: left;

    &.global-error {
      margin-top: 20px;
      text-align: center;
    }
  }

  .success-message {
    font-size: 14px;
    font-family: "Inter", sans-serif;
    color: #4caf50;
    margin-top: 20px;
    padding: 10px;
    text-align: center;
    border-radius: 8px;
  }
}
</style>
