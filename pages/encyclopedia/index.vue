<template>
  <div class="encyclopedia-container">
    <Header />
    <div class="encyclopedia">
      <h1>энциклопедия</h1>
      <div class="encyclopedia__input">
        <input
          type="text"
          class="encyclopedia__input--input"
          v-model="searchQuery"
          @input="onSearchInput"
          @focus="showDropdown = true"
          placeholder="Найти вид танца"
        />
        <img
          src="@/assets/img/search.png"
          alt="search"
          class="encyclopedia__input--button"
          @click="performSearch"
        />

        <div
          v-if="showDropdown && searchResults.length > 0"
          class="search-dropdown"
        >
          <div
            v-for="result in searchResults"
            :key="result.danceSlug"
            class="search-dropdown-item"
            @click="navigateToDance(result.danceSlug)"
          >
            <div class="search-dropdown-item__name">{{ result.danceName }}</div>
            <div class="search-dropdown-item__region">
              {{ result.regionName }}
            </div>
          </div>
        </div>
        <div
          v-if="showDropdown && searchQuery && searchResults.length === 0"
          class="search-dropdown no-results"
        >
          <div class="search-dropdown-item"><h4>Ничего не найдено</h4></div>
        </div>
      </div>

      <template v-for="(region, index) in sortedRegions" :key="region.id">
        <div v-if="index === getFirstRussianRegionIndex()" class="russia-title">
          <h1 class="russia-text">Россия</h1>
        </div>

        <div class="encyclopedia-block1">
          <img
            :src="getRegionImage(index)"
            :alt="region.name"
            class="encyclopedia-block1__image"
          />
          <div class="encyclopedia-block1__text">
            <h1>{{ region.name }}</h1>
            <div class="encyclopedia-block1__block">
              <p
                v-for="dance in region.dances"
                :key="dance.slug"
                class="dance-item"
                @click="navigateToDance(dance.slug)"
              >
                {{ dance.name }}
              </p>
            </div>
            <NuxtLink
              class="ency__button"
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
        </div>
      </template>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import africaImage from "@/assets/img/Union8.png";
import europeImage from "@/assets/img/Union9.png";
import asiaImage from "@/assets/img/Union6.png";
import americaImage from "@/assets/img/Union5.png";
import australiaImage from "@/assets/img/Union4.png";
import caucasusImage from "@/assets/img/Union.png";
import volgaImage from "@/assets/img/Union3.png";
import siberiaImage from "@/assets/img/Union1.png";
import centralRussiaImage from "@/assets/img/Union2.png";

type RegionListItem = {
  id: string;
  name: string;
  slug: string;
};

type RegionDetail = RegionListItem & {
  dances: Array<{ id: string; name: string; slug: string }>;
};

const regionOrder = [
  "afrika",
  "evropa",
  "aziia",
  "amerika",
  "avstraliia",
  "severnyi-kavkaz",
  "povolzhe-i-priurale",
  "sibir-i-dalnii-vostok",
  "severo-zapad-i-tsentralnaia-rossiia",
];

const localImages = [
  africaImage,
  europeImage,
  asiaImage,
  americaImage,
  australiaImage,
  caucasusImage,
  volgaImage,
  siberiaImage,
  centralRussiaImage,
];

const getRegionImage = (index: number) => {
  return localImages[index % localImages.length];
};

const getFirstRussianRegionIndex = () => {
  const russianRegionSlugs = [
    "severnyi-kavkaz",
    "povolzhe-i-priurale",
    "sibir-i-dalnii-vostok",
    "severo-zapad-i-tsentralnaia-rossiia",
  ];

  return sortedRegions.value.findIndex((region) =>
    russianRegionSlugs.includes(region.slug)
  );
};

const { apiFetch } = useApi();

const { data } = await useAsyncData("encyclopedia-regions", async () => {
  const regionList = await apiFetch<RegionListItem[]>("/regions");
  const detailedRegions = await Promise.all(
    regionList.map((region) =>
      apiFetch<RegionDetail>(`/regions/${region.slug}`)
    )
  );

  return detailedRegions.map((region) => ({
    ...region,
    dances: region.dances.slice(0, 10),
  }));
});

const sortedRegions = computed(() => {
  if (!data.value) return [];

  return [...data.value].sort((a, b) => {
    const indexA = regionOrder.indexOf(a.slug);
    const indexB = regionOrder.indexOf(b.slug);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
});

const searchQuery = ref("");
const showDropdown = ref(false);
const searchResults = ref<
  Array<{ danceName: string; danceSlug: string; regionName: string }>
>([]);

const searchDances = (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  const results: Array<{
    danceName: string;
    danceSlug: string;
    regionName: string;
  }> = [];
  const lowerQuery = query.toLowerCase();

  sortedRegions.value.forEach((region) => {
    region.dances.forEach((dance) => {
      if (dance.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          danceName: dance.name,
          danceSlug: dance.slug,
          regionName: region.name,
        });
      }
    });
  });

  searchResults.value = results.slice(0, 10);
};

const onSearchInput = () => {
  searchDances(searchQuery.value);
  showDropdown.value = true;
};

const performSearch = () => {
  searchDances(searchQuery.value);
  showDropdown.value = true;
};

const navigateToDance = (slug: string) => {
  if (slug) {
    navigateTo({ path: "/about_dance", query: { slug: slug } });
    showDropdown.value = false;
    searchQuery.value = "";
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const inputContainer = document.querySelector(".encyclopedia__input");
  if (inputContainer && !inputContainer.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss">
.encyclopedia-container {
  background-color: #fff;
}

.encyclopedia {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
  position: relative;

  h1 {
    display: none;
  }
  .russia-text{
    display: block !important;
  }
  &__input {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    border-radius: 30px;
    border: 2px solid #11243f;
    flex: 1;
    width: 40%;
    min-width: 0;
    overflow: visible;
    margin-left: auto;
    margin-right: 5%;
    margin-top: 30px;
    margin-bottom: 20px;
    position: relative;

    &--input {
      font-size: 36px;
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      padding: 30px 36px;
      background: transparent;
    }

    &--button {
      width: 127px;
      flex-shrink: 0;
      cursor: pointer;
      padding: 0;
      background: transparent;
      border: none;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #11243f;
  border-radius: 30px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Inter", sans-serif;
  &-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #eee;

    &:hover {
      background-color: #11243f;
      color: white;
    }

    &:last-child {
      border-bottom: none;
    }

    &__name {
      font-weight: 500;
      margin-bottom: 4px;
      font-size: 40px;
      color: #11243f;
    }

    &__region {
      font-size: 24px;
      color: #666;

      .search-dropdown-item:hover & {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  &.no-results {
    .search-dropdown-item {
      cursor: default;
      text-align: center;
      color: #999;
      font-size: 40px;
      &:hover {
        background-color: transparent;
        color: #999;
      }
    }
  }
}

.encyclopedia-block1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 100px;

  img {
    width: 30%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 20px;
    order: 1;
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
    order: 2;
    h1{
      display: block !important;
    }
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
      font-size: 40px;
      white-space: nowrap;
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #11243f;
        color: #fff;
      }
    }
  }

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
  }
  &:nth-child(even) {
    .encyclopedia-block1__image {
      order: 2;
    }
    
    .encyclopedia-block1__text {
      order: 1;
      margin-right: 0;
      margin-left: auto;
    }
  }
}

.ency__button {
  border-radius: 999px;
  padding: 10px 35px;
  color: #fffcf6;
  margin: 10px 0 0 0;
  width: auto;
  font-size: 40px;
  white-space: nowrap;
  display: inline-flex;
  background-color: #c65d3b;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s ease;

  h4 {
    margin: 0;
    font-weight: 200;
  }

  svg {
    width: 18px;
  }

  gap: 10px;
}

.russia-title {
  text-align: center;
  margin: 40px 0 90px 0;

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
  }
}


@media (max-width: 1400px) {
  .encyclopedia{
    padding: 0 22px;
    h1 {
      display: block;
      font-size: 46px;
      font-family: "BergamascoThin", sans-serif;
      font-weight: 800;
      color: #11243f;
      text-align: center;
      margin-bottom: 50px;
      margin: 20px 0;
      text-transform: uppercase;
    }
    &__input{
      width: 100%;
      border-radius: 17px;
      margin: 0 0 38px 0;
      &--input{
        padding: 15px 21px;
        font-size: 17px;
      }
      &--button{
        width: 66px;
      }
    }
  }
  .encyclopedia-block1{
    margin-bottom: 60px;
    flex-direction: column;
    img{
      width: 70%;
      order: 1 !important;
    }
    &__text{
      width: 100%;
      gap: 11px;
      order: 2 !important;
      margin: 0 !important;
      h1{
        font-size: 50px;
        margin: 10px 0 0 0;
      }
      
    }
    &__block{
      width: 100%;
      gap: 6px;
    }
    .dance-item{
      font-size: 14px;
      border: 2px solid #11243f;
    }
  }
  .ency__button{
    margin: 0;
    padding: 2px 22px;
    h4{
      font-size: 16px;
    }
    svg{
      width: 14px;
    }
  }
  .search-dropdown-item{
    &__name{
      font-size: 18px;
    }
    &__region{
      font-size: 14px;
    }
  }
  .search-dropdown{
    border-radius: 17px;
    font-size: 18px;
  }
  .search-dropdown-item{
    padding: 7px 16px;
    h4{font-size: 18px;}
  }
  .russia-title{
    margin: 0;
  }
  .russia-text{
    margin: 0;
  }
}
</style>
