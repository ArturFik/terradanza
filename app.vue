<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { fetchMe, isAuthenticated } = useAuth()

await useAsyncData("bootstrap-auth", async () => {
  if (!isAuthenticated.value) {
    return null
  }
  return await fetchMe()
})
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
</style>
