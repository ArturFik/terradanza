<template>
  <div 
    class="about_country-container" 
    :style="{ backgroundImage: `url(${currentBackgroundImage})` }"
  >
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
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import africaImage from "@/assets/img/Rectangle5.png";
import europeImage from "@/assets/img/Rectangle6.png";
import asiaImage from "@/assets/img/Rectangle7.png";
import americaImage from "@/assets/img/Rectangle8.png";

import defaultBackground from "@/assets/img/back-africa.png";
import africaBackground from "@/assets/img/back-africa.png";
import europeBackground from "@/assets/img/back-europa.png";
import asiaBackground from "@/assets/img/back-asia.png";
import americaBackground from "@/assets/img/back-america.png";
import australiaBackground from "@/assets/img/back-australia.png";
import northCaucasusBackground from "@/assets/img/back-kavkaz.png";
import volgaRegionBackground from "@/assets/img/back-povol.png";
import siberiaBackground from "@/assets/img/back-sibir.png";
import centralRussiaBackground from "@/assets/img/back-center.png";

type RegionDetail = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description?: string | null;
  images: Array<{ image_key?: string | null; image?: string | null }>;
  dances: Array<{ id: string; name: string; slug: string }>;
};

const route = useRoute();
const { apiFetch } = useApi();
const { mediaUrl } = useMedia();

const fallbackGallery = [africaImage, europeImage, asiaImage, americaImage];
const isExpanded = ref(false);

const toggleText = () => {
  isExpanded.value = !isExpanded.value;
};

const selectedSlug = computed(() => {
  const slug = route.query.slug;
  return typeof slug === "string" && slug.length ? slug : null;
});

const { data } = await useAsyncData(
  () => `region-${selectedSlug.value || "default"}`,
  async () => {
    if (selectedSlug.value) {
      return await apiFetch<RegionDetail>(`/regions/${selectedSlug.value}`);
    }

    const regions = await apiFetch<Array<{ slug: string }>>("/regions");
    const firstRegion = regions[0];
    if (!firstRegion) {
      return null;
    }
    return await apiFetch<RegionDetail>(`/regions/${firstRegion.slug}`);
  }
);

const region = computed(() => data.value);

const galleryImages = computed<string[]>(() => {
  if (!region.value?.images || region.value.images.length === 0) {
    return fallbackGallery;
  }

  const urls = region.value.images
    .map((image) => {
      const imageKey = image.image_key || image.image;
      if (!imageKey) return null;
      const url = mediaUrl(imageKey);
      return url || "";
    })
    .filter((url): url is string => typeof url === "string" && url.length > 0);

  return urls.length ? urls : fallbackGallery;
});

const getBackgroundImage = (slug: string | null): string => {
  if (!slug) return defaultBackground;
  
  const backgroundMap: Record<string, string> = {
    'afrika': africaBackground,
    'evropa': europeBackground,
    'aziia': asiaBackground,
    'amerika': americaBackground,
    'avstraliia': australiaBackground,
    'severnyi-kavkaz': northCaucasusBackground,
    'povolzhe-i-priurale': volgaRegionBackground,
    'sibir-i-dalnii-vostok': siberiaBackground,
    'severo-zapad-i-tsentralnaia-rossiia': centralRussiaBackground,
  };
  
  return backgroundMap[slug] || defaultBackground;
};

const currentBackgroundImage = computed(() => {
  return getBackgroundImage(selectedSlug.value);
});
</script>

<style lang="scss">
.about_country-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.about_country {
  margin-top: 50px;

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 10px;
  }

  .about {
    font-size: 80px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: left;
  }

  .content-wrapper {
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1920px;
    padding: 0 100px;
  }

  .intro-section {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    width: 90%;
  }

  .intro-text {
    font-size: 40px;
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
    font-size: 40px;
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
    position: relative;
    padding: 0 100px;
    .dance-item {
      border-radius: 999px;
      padding: 5px 15px;
      border: 3px solid #11243f;
      color: #11243f;
      margin: 0;
      width: auto;
      font-size: 40px;
      white-space: nowrap;
      display: inline-block;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background-color: #11243f;
        color: white;
      }
    }
  }

  &__block {
    margin-left: auto;
    margin-right: auto;
    max-width: 1920px;
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
      font-size: 40px;
      font-weight: 300;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 0;
    }
  }

  &__tab {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1920px;
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 0 100px;

    .tab-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 6 / 8;

      img {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 20px;
        object-fit: cover;
      }
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      padding: 0 40px;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 0 30px;

      .tab-item {
        aspect-ratio: 4 / 5;
      }
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 0 20px;

      .tab-item {
        aspect-ratio: 16 / 9;
      }
    }
  }
}
</style>