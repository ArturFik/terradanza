<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AchievementNotification />
    <ClientOnly>
      <div v-if="wsStatus === 'connected'" class="ws-status-indicator">
        <span class="ws-status-dot"></span>
        <span>Уведомления активны</span>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AchievementNotification from "./component/AchievementNotification.vue";

const { fetchMe, isAuthenticated } = useAuth();
const { status: wsStatus } = useWebSocket();

await useAsyncData("bootstrap-auth", async () => {
  if (!isAuthenticated.value) {
    return null;
  }
  return await fetchMe();
});
</script>

<style>
@font-face {
  font-family: "Luckiest";
  src: url("@/assets/fonts/LuckiestGuy-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "BergamascoThin";
  src: url("@/assets/fonts/BergamascoThin.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

body {
  margin: 0;
  padding: 0;
  background-color: #fffcf6;
}

.ws-status-indicator {
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #dcfce7;
  font-size: 12px;
  color: #166534;
  font-weight: 500;
  font-family: "Inter", sans-serif;
}

.ws-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
