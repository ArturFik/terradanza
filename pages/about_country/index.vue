<template>
  <div class="about_country-container">
    <Header />
    <div class="about_country">
      <h1>{{ region?.name || "Регион" }}</h1>

      <div class="content-wrapper" v-if="region">
        <h1 class="about">История и культура</h1>
        <div class="intro-section">
          <p class="intro-text">
            {{ region.short_description }}
          </p>
          <button
            class="toggle-button"
            @click="toggleText"
            :class="{ rotated: isExpanded }"
          >
            >
          </button>
        </div>
        <div class="full-text" v-show="isExpanded">
          <p>{{ region.full_description }}</p>
        </div>
      </div>

      <div class="about_country__tab" v-if="galleryImages.length">
        <div
          v-for="(image, index) in galleryImages"
          :key="`${image}-${index}`"
          class="tab-item"
        >
          <img :src="image" :alt="region?.name || 'region'" />
        </div>
      </div>

      <div class="about_country__continue" v-if="region">
        <div class="about_country__block">
          <h1 class="about">Танцы этого региона:</h1>
          <div class="about_country__view">
            <NuxtLink
              v-for="dance in region.dances"
              :key="dance.id"
              class="dance-item"
              :to="{ path: '/about_dance', query: { slug: dance.slug } }"
            >
              {{ dance.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue"
import Footer from "@/component/footer/footer.vue"
import africaImage from "@/assets/img/Rectangle5.png"
import europeImage from "@/assets/img/Rectangle6.png"
import asiaImage from "@/assets/img/Rectangle7.png"
import americaImage from "@/assets/img/Rectangle8.png"

type RegionDetail = {
  id: string
  name: string
  slug: string
  short_description: string
  full_description?: string | null
  images: Array<{ image_key: string }>
  dances: Array<{ id: string; name: string; slug: string }>
}

const route = useRoute()
const { apiFetch } = useApi()
const { mediaUrl } = useMedia()

const fallbackGallery = [africaImage, europeImage, asiaImage, americaImage]
const isExpanded = ref(false)

const toggleText = () => {
  isExpanded.value = !isExpanded.value
}

const selectedSlug = computed(() => {
  const slug = route.query.slug
  return typeof slug === "string" && slug.length ? slug : null
})

const { data } = await useAsyncData(
  () => `region-${selectedSlug.value || "default"}`,
  async () => {
    if (selectedSlug.value) {
      return await apiFetch<RegionDetail>(`/regions/${selectedSlug.value}`)
    }

    const regions = await apiFetch<Array<{ slug: string }>>("/regions")
    const firstRegion = regions[0]
    if (!firstRegion) {
      return null
    }
    return await apiFetch<RegionDetail>(`/regions/${firstRegion.slug}`)
  },
)

const region = computed(() => data.value)

const galleryImages = computed(() => {
  const keys = region.value?.images?.map((image) => mediaUrl(image.image_key)).filter(Boolean) || []
  return keys.length ? keys : fallbackGallery
})
</script>

<style lang="scss">
.about_country-container {
  background-color: #fff;
}

.about_country {
  margin-top: 50px;

  h1 {
    font-size: 64px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 10px;
  }

  .about {
    font-size: 48px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: left;
  }

  .content-wrapper {
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1234px;
    padding: 0 75px;
  }

  .intro-section {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    width: 90%;
  }

  .intro-text {
    font-size: 18px;
    font-weight: 300;
    color: #11243f;
    text-align: left;
    font-family: "Inter", sans-serif;
    margin: 0;
    flex: 1;
  }

  .toggle-button {
    background: none;
    border: none;
    font-size: 24px;
    font-weight: bold;
    color: #11243f;
    cursor: pointer;
    padding: 0;
    transition: transform 0.3s ease;
    font-family: monospace;
    line-height: 1;
    transform: rotate(90deg);

    &:hover {
      opacity: 0.7;
    }

    &.rotated {
      transform: rotate(270deg);
    }
  }

  &__continue {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("@/assets/img/back.png");
    position: relative;

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
      text-decoration: none;
    }
  }

  &__block {
    margin-left: auto;
    margin-right: auto;
    max-width: 1234px;
  }

  &__view {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    width: 100%;
  }

  .full-text {
    margin-top: 20px;
    width: 90%;

    p {
      font-size: 18px;
      font-weight: 300;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 0;
    }
  }

  &__tab {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    max-width: 1234px;
    margin-top: 50px;
    margin-bottom: 50px;
    gap: 10px;
    padding: 0 75px;

    .tab-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      img {
        max-width: 250px;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 20px;
        object-fit: cover;
      }
    }
  }
}
</style>
