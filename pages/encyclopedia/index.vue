<template>
  <div class="encyclopedia-container">
    <Header />
    <div class="encyclopedia">
      <div
        v-for="(region, index) in regions"
        :key="region.id"
        class="encyclopedia-block1"
      >
        <img
          v-if="index % 2 === 0"
          :src="region.image"
          :alt="region.name"
        />
        <div class="encyclopedia-block1__text">
          <h1>{{ region.name }}</h1>
          <div class="encyclopedia-block1__block">
            <p
              v-for="dance in region.dances"
              :key="dance.slug"
              class="dance-item"
            >
              {{ dance.name }}
            </p>
          </div>
          <NuxtLink
            class="button"
            :to="{ path: '/about_country', query: { slug: region.slug } }"
          >
            <h4>больше танцев</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
            >
              <path
                d="M0.40297 28.3793C-0.162016 28.9852 -0.128871 29.9344 0.477003 30.4994C1.08288 31.0644 2.03204 31.0312 2.59703 30.4253L1.5 29.4023L0.40297 28.3793ZM24.823 5.94668C24.7941 5.11876 24.0995 4.47103 23.2716 4.49994L9.77982 4.97108C8.9519 5 8.30417 5.6946 8.33308 6.52252C8.362 7.35044 9.0566 7.99817 9.88452 7.96926L21.8772 7.55046L22.296 19.5432C22.3249 20.3711 23.0195 21.0188 23.8474 20.9899C24.6754 20.961 25.3231 20.2664 25.2942 19.4385L24.823 5.94668ZM1.5 29.4023L2.59703 30.4253L24.421 7.02202L23.3239 5.99903L22.2269 4.97603L0.40297 28.3793L1.5 29.4023Z"
                fill="#FFFEFB"
              />
            </svg>
          </NuxtLink>
        </div>
        <img
          v-if="index % 2 === 1"
          :src="region.image"
          :alt="region.name"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue"
import Footer from "@/component/footer/footer.vue"
import africaImage from "@/assets/img/Union8.png"
import europeImage from "@/assets/img/Union9.png"
import asiaImage from "@/assets/img/Union6.png"
import americaImage from "@/assets/img/Union5.png"
import australiaImage from "@/assets/img/Union4.png"
import caucasusImage from "@/assets/img/Union.png"
import volgaImage from "@/assets/img/Union3.png"
import siberiaImage from "@/assets/img/Union1.png"
import centralRussiaImage from "@/assets/img/Union2.png"

type RegionListItem = {
  id: string
  name: string
  slug: string
  images: Array<{ image_key: string }>
}

type RegionDetail = RegionListItem & {
  dances: Array<{ id: string; name: string; slug: string }>
}

const regionFallbackImages = [
  africaImage,
  europeImage,
  asiaImage,
  americaImage,
  australiaImage,
  caucasusImage,
  volgaImage,
  siberiaImage,
  centralRussiaImage,
]

const { apiFetch } = useApi()
const { mediaUrl } = useMedia()

const { data } = await useAsyncData("encyclopedia-regions", async () => {
  const regionList = await apiFetch<RegionListItem[]>("/regions")
  const detailedRegions = await Promise.all(
    regionList.map((region) => apiFetch<RegionDetail>(`/regions/${region.slug}`)),
  )

  return detailedRegions.map((region, index) => ({
    ...region,
    image:
      mediaUrl(region.images[0]?.image_key) ||
      regionFallbackImages[index % regionFallbackImages.length],
    dances: region.dances.slice(0, 10),
  }))
})

const regions = computed(() => data.value || [])
</script>

<style lang="scss">
.encyclopedia-container {
  background-color: #fffcf6;
}

.encyclopedia {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
}

.encyclopedia-block1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;

  img {
    width: 30%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 20px;
  }

  &__text {
    width: 60%;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-weight: 400;
    font-family: "Inter", sans-serif;
  }

  &__block {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    width: 70%;
    margin-left: auto;
    margin-right: auto;

    .dance-item {
      border-radius: 999px;
      padding: 5px 15px;
      border: 3px solid #11243f;
      color: #11243f;
      margin: 0;
      width: auto;
      font-size: 26px;
      white-space: nowrap;
      display: inline-block;
    }
  }

  h1 {
    font-size: 64px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
  }
}

.button {
  border-radius: 999px;
  padding: 10px 15px;
  color: #fffcf6;
  margin: 0;
  width: auto;
  font-size: 26px;
  white-space: nowrap;
  display: inline-flex;
  background-color: #c65d3b;
  flex-direction: row;
  align-items: center;
  text-decoration: none;

  h4 {
    margin: 0;
    font-weight: 200;
  }

  svg {
    width: 18px;
  }

  gap: 10px;
}
</style>
