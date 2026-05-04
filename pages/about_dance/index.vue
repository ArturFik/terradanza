<template>
  <div class="about_dance-container">
    <Header />
    <div v-if="dance" class="about_dance">
      <div class="about_dance__view">
        <h1>{{ dance.name }}</h1>
        <h1 class="about" v-if="regionName">({{ regionName }})</h1>
        <p class="intro-text">
          {{
            dance.description || "Описание для этого танца пока не добавлено."
          }}
        </p>
        <NuxtLink
          v-if="linkedCourseSlug"
          class="button"
          :to="{ path: '/about_course', query: { slug: linkedCourseSlug } }"
        >
          <h4>Пройти курс</h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="16"
            viewBox="0 0 25 16"
            fill="none"
          >
            <path
              d="M24.3212 8.325C24.7239 7.92222 24.7239 7.26919 24.3212 6.86641L17.7575 0.302735C17.3547 -0.100045 16.7017 -0.100045 16.2989 0.302735C15.8961 0.705514 15.8961 1.35855 16.2989 1.76133L22.1333 7.5957L16.2989 13.4301C15.8961 13.8329 15.8961 14.4859 16.2989 14.8887C16.7017 15.2915 17.3547 15.2915 17.7575 14.8887L24.3212 8.325ZM0 7.5957L0 8.62708H23.5919V7.5957V6.56432H0L0 7.5957Z"
              fill="#fff"
            />
          </svg>
        </NuxtLink>
      </div>
      <img :src="heroImage" :alt="dance.name" />
    </div>

    <div v-if="dance && historyBlocks.length" class="about_dancetwo">
      <h1 class="abouttwo">История и культура</h1>
      <div class="about_dance__viewtwo">
        <img src="@/assets/img/line.png" alt="line" class="line" />
        <div
          v-for="(block, index) in historyBlocks"
          :key="block.id"
          class="divtwo"
        >
          <img
            v-if="index % 2 === 0"
            :src="block.image"
            :alt="dance.name"
            class="img"
          />
          <p class="intro-text">{{ block.text }}</p>
          <img
            v-if="index % 2 === 1"
            :src="block.image"
            :alt="dance.name"
            class="img"
          />
        </div>
      </div>
    </div>

    <!-- Блок Костюмы - исправлен -->
    <div v-if="costumeImages.length" class="about_dance-block4">
      <h1>Костюмы</h1>
      <div class="media-grid">
        <div
          v-for="(image, index) in costumeImages"
          :key="`costume-${index}`"
          class="tab-item"
        >
          <img :src="image" alt="costume" />
        </div>
      </div>
    </div>

    <!-- Блок Фото и видео - исправлен -->
    <div
      v-if="photoMedia.length || videoMedia.length"
      class="about_dance-block4"
    >
      <h1>Фото и видео</h1>
      <div class="media-grid">
        <!-- Фото -->
        <div
          v-for="(image, index) in photoMedia"
          :key="`photo-${index}`"
          class="tab-item"
        >
          <img :src="image" alt="media" />
        </div>
        <!-- Видео -->
        <div
          v-for="(video, index) in videoMedia"
          :key="`video-${index}`"
          class="tab-item"
        >
          <video :src="video" controls />
        </div>
      </div>
    </div>

    <div v-if="relatedDances.length" class="about_dance-block4">
      <h1>Другие танцы региона:</h1>
      <div class="related-dances">
        <NuxtLink
          v-for="item in relatedDances"
          :key="item.slug"
          class="dance-chip"
          :to="{ path: '/about_dance', query: { slug: item.slug } }"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import fallbackHero from "@/assets/img/imgtest.png";
import fallbackGallery from "@/assets/img/testtestest.png";

type DanceResponse = {
  id: string;
  region_id: string;
  name: string;
  slug: string;
  description?: string | null;
  costume_images: Array<{ id: string; image_key: string }>;
  media: Array<{
    id: string;
    media_type: string;
    media_key: string;
    thumbnail_key?: string | null;
  }>;
  history_blocks: Array<{
    id: string;
    image_key: string;
    text_content: string;
  }>;
};

type RegionItem = {
  id: string;
  name: string;
  slug: string;
};

type RegionDetail = RegionItem & {
  dances: Array<{ id: string; name: string; slug: string }>;
};

const route = useRoute();
const { apiFetch } = useApi();
const { mediaUrl } = useMedia();

const selectedSlug = computed(() => {
  const slug = route.query.slug;
  return typeof slug === "string" && slug.length ? slug : null;
});

const { data } = await useAsyncData(
  () => `dance-${selectedSlug.value || "default"}`,
  async () => {
    const regions = await apiFetch<RegionItem[]>("/regions");

    let danceSlug = selectedSlug.value;
    if (!danceSlug) {
      const firstRegion = regions[0];
      if (!firstRegion) {
        return null;
      }
      const regionDetail = await apiFetch<RegionDetail>(
        `/regions/${firstRegion.slug}`
      );
      danceSlug = regionDetail.dances[0]?.slug || null;
      if (!danceSlug) {
        return null;
      }
    }

    const dance = await apiFetch<DanceResponse>(`/dances/${danceSlug}`);
    const region = regions.find((item) => item.id === dance.region_id) || null;
    const regionDetail = region
      ? await apiFetch<RegionDetail>(`/regions/${region.slug}`)
      : null;

    let linkedCourseSlug: string | null = null;
    try {
      const courseResponse = await apiFetch<{
        success: boolean;
        data: { course: { slug: string } };
      }>(`/dances/${danceSlug}/course`);
      linkedCourseSlug = courseResponse.data.course.slug;
    } catch {
      linkedCourseSlug = null;
    }

    return {
      dance,
      region,
      regionDetail,
      linkedCourseSlug,
    };
  }
);

const dance = computed(() => data.value?.dance || null);
const regionName = computed(() => data.value?.region?.name || "");
const linkedCourseSlug = computed(() => data.value?.linkedCourseSlug || null);

const heroImage = computed(() => {
  const historyImage = dance.value?.history_blocks[0]?.image_key;
  const costumeImage = dance.value?.costume_images[0]?.image_key;
  const mediaImage =
    dance.value?.media.find((item) => item.thumbnail_key)?.thumbnail_key ||
    dance.value?.media.find((item) => item.media_type === "image")?.media_key;

  return mediaUrl(historyImage || costumeImage || mediaImage) || fallbackHero;
});

const historyBlocks = computed(() =>
  (dance.value?.history_blocks || []).map((block) => ({
    id: block.id,
    text: block.text_content,
    image: mediaUrl(block.image_key) || fallbackGallery,
  }))
);

const costumeImages = computed(() =>
  (dance.value?.costume_images || [])
    .map((item) => mediaUrl(item.image_key))
    .filter(Boolean)
);

const photoMedia = computed(() =>
  (dance.value?.media || [])
    .filter((item) => item.media_type === "image")
    .map((item) => mediaUrl(item.media_key))
    .filter(Boolean)
);

const videoMedia = computed(() =>
  (dance.value?.media || [])
    .filter((item) => item.media_type === "video")
    .map((item) => mediaUrl(item.media_key))
    .filter(Boolean)
);

const relatedDances = computed(() =>
  (data.value?.regionDetail?.dances || []).filter(
    (item) => item.slug !== dance.value?.slug
  )
);
</script>

<style lang="scss">
.about_dance-container {
  background-color: #fff;
}

.about_dance {
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding: 0 70px;
  max-width: 1234px;
  gap: 30px;

  &__view {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;

    h1 {
      font-size: 64px;
      font-family: "BergamascoThin", sans-serif;
      font-weight: 800;
      color: #11243f;
      text-align: left;
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

    .intro-text {
      font-size: 18px;
      font-weight: 300;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 0;
      flex: 1;
    }

    .button {
      border-radius: 999px;
      padding: 8px 15px;
      color: #fffcf6;
      margin: 20px 0 0 0;
      width: auto;
      font-size: 18px;
      white-space: nowrap;
      display: inline-flex;
      background-color: #c65d3b;
      font-family: "Inter", sans-serif;
      flex-direction: row;
      align-items: center;
      text-decoration: none;
      gap: 10px;

      h4 {
        margin: 0;
        font-weight: 200;
      }

      svg {
        width: 18px;
      }
    }
  }

  img {
    width: 50%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 20px;
  }
}

.about_dancetwo {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-left: auto;
  margin-right: auto;
  padding: 0 70px;
  max-width: 1234px;
  gap: 30px;

  .abouttwo {
    font-size: 64px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: left;
    margin: 0;
    margin-bottom: 10px;
  }

  .about_dance__viewtwo {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }

  .divtwo {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 150px;
    position: relative;
    z-index: 1;

    .intro-text {
      font-size: 18px;
      font-weight: 300;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 0;
      flex: 1;
    }
  }

  .line {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
    width: auto;
    height: 71%;
    max-width: none;
    pointer-events: none;
  }

  .img {
    width: 44%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 20px;
  }
}

.about_dance-block4 {
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 70px;
  max-width: 1234px;

  h1 {
    font-size: 64px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: left;
    margin: 0;
    margin-bottom: 10px;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 50px;
  }

  .tab-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 6 / 8;

    img,
    video {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 20px;
      object-fit: cover;
      background: #11243f;
    }

    video {
      object-fit: cover;
    }
  }

  // Адаптивность
  @media (max-width: 1024px) {
    .media-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
  }

  @media (max-width: 768px) {
    .media-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .tab-item {
      aspect-ratio: 4 / 5;
    }
  }

  @media (max-width: 480px) {
    .media-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .tab-item {
      aspect-ratio: 16 / 9;
    }
  }
}

.related-dances {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}

.dance-chip {
  border-radius: 999px;
  padding: 10px 16px;
  border: 2px solid #11243f;
  color: #11243f;
  text-decoration: none;
  font-family: "Inter", sans-serif;
  transition: all 0.3s ease;

  &:hover {
    background-color: #11243f;
    color: white;
  }
}
</style>
