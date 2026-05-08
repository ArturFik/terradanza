<template>
  <div class="catalog-container">
    <Header />
    <div class="catalog">
      <h1>КАТАЛОГ КУРСОВ</h1>
      <div class="catalog__filters--container">
        <div class="catalog__filters--view">
          <div class="catalog__filters--block">
            <div
              class="filter-item"
              :class="{ 'filter-item--active': activeFilter === 'level' }"
              @click="toggleFilter('level')"
            >
              <p>
                {{
                  selectedFilters.level
                    ? translateLevel(selectedFilters.level)
                    : "Уровень сложности"
                }}
              </p>
              <span
                class="filter-arrow"
                :class="{ 'filter-arrow--open': activeFilter === 'level' }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 22 14"
                  fill="none"
                >
                  <path
                    d="M1.15625 1.1543L10.9575 10.9556L20.7588 1.1543"
                    stroke="currentColor"
                    stroke-width="3.2671"
                  />
                </svg>
              </span>
              <div v-if="activeFilter === 'level'" class="filter-dropdown">
                <p>Фильтр сложности</p>
                <div
                  v-for="option in levelOptions"
                  :key="option"
                  class="filter-option"
                  @click.stop="selectLevelOption(option)"
                >
                  {{ translateLevel(option) }}
                </div>
              </div>
            </div>

            <div
              class="filter-item filter-item--checkbox"
              :class="{ 'filter-item--active': activeFilter === 'region' }"
              @click="toggleFilter('region')"
            >
              <p>{{ getRegionFilterLabel() }}</p>
              <span
                class="filter-arrow"
                :class="{ 'filter-arrow--open': activeFilter === 'region' }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 22 14"
                  fill="none"
                >
                  <path
                    d="M1.15625 1.1543L10.9575 10.9556L20.7588 1.1543"
                    stroke="currentColor"
                    stroke-width="3.2671"
                  />
                </svg>
              </span>
              <div
                v-if="activeFilter === 'region'"
                class="filter-dropdown filter-dropdown--checkbox"
              >
                <p>Выберите регионы</p>
                <div v-if="allRegions.length === 0" class="filter-loading">
                  Загрузка регионов...
                </div>
                <div v-else class="filter-options-list">
                  <div
                    v-for="region in allRegions"
                    :key="region.id"
                    class="filter-option-checkbox"
                    @click.stop
                  >
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="region.name"
                        v-model="selectedFilters.region"
                        @change="handleRegionFilterChange"
                      />
                      <span class="checkbox-custom"></span>
                      {{ region.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="filter-item"
              :class="{ 'filter-item--active': activeFilter === 'style' }"
              @click="toggleFilter('style')"
            >
              <p>{{ selectedFilters.style || "Стиль" }}</p>
              <span
                class="filter-arrow"
                :class="{ 'filter-arrow--open': activeFilter === 'style' }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 22 14"
                  fill="none"
                >
                  <path
                    d="M1.15625 1.1543L10.9575 10.9556L20.7588 1.1543"
                    stroke="currentColor"
                    stroke-width="3.2671"
                  />
                </svg>
              </span>
              <div v-if="activeFilter === 'style'" class="filter-dropdown">
                <p>Фильтр стилей</p>
                <div
                  v-for="option in styleOptions"
                  :key="option"
                  class="filter-option"
                  @click.stop="selectOption('style', option)"
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
          <p class="catalog__filters--blocktwo" @click="resetFilters">
            Сбросить
          </p>
        </div>
      </div>

      <div class="catalog__grid">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="catalog__tab"
        >
          <div
            class="catalog__tab--view"
            :style="{ backgroundImage: `url(${course.backgroundImage})` }"
          >
            <div class="catalog__tab--overlay"></div>
            <div class="catalog__tab--content">
              <h2>{{ course.title }}</h2>
              <h3>{{ course.region }}</h3>
              <div class="catalog__tab--actions">
                <div
                  class="description-toggle"
                  :class="{
                    'description-toggle--open': expandedCourseIds.has(
                      course.id
                    ),
                  }"
                  @click="toggleDescription(course.id)"
                >
                  <p>Описание</p>
                  <svg
                    class="description-arrow"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 22 14"
                    fill="none"
                  >
                    <path
                      d="M1.15625 1.1543L10.9575 10.9556L20.7588 1.1543"
                      stroke="currentColor"
                      stroke-width="3.2671"
                    />
                  </svg>
                </div>
                <div class="heart-icon" @click="toggleFavorite(course.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    :fill="
                      favoriteCourseIds.has(course.id) ? '#ff6b6b' : 'none'
                    "
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                </div>
              </div>
              <div
                class="catalog__tab--description"
                :class="{
                  'catalog__tab--description--expanded': expandedCourseIds.has(
                    course.id
                  ),
                }"
              >
                <p>{{ course.description }}</p>
                <NuxtLink
                  class="button"
                  :to="{ path: '/about_course', query: { slug: course.slug } }"
                >
                  Подробнее о курсе
                </NuxtLink>
              </div>
            </div>
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
import fallbackCourseImage from "@/assets/img/imgtest.png";

const { apiFetch } = useApi();
const { isAuthenticated } = useAuth();
const { mediaUrl } = useMedia();

const levelTranslation = {
  beginner: "Начинающий",
  intermediate: "Продолжающий",
  advanced: "Продвинутый",
};

const translateLevel = (level) => {
  return levelTranslation[level?.toLowerCase()] || level;
};

const activeFilter = ref(null);
const selectedFilters = ref({
  level: null,
  region: [],
  style: null,
});

const expandedCourseIds = ref(new Set());
const favoriteCourseIds = ref(new Set());

const allRegions = ref([]);
const regionMap = ref(new Map());

const fetchRegions = async () => {
  try {
    const response = await apiFetch("/regions");
    console.log("Regions API Response:", response);

    if (Array.isArray(response)) {
      allRegions.value = response;
      regionMap.value.clear();
      allRegions.value.forEach((region) => {
        if (region.name && region.id) {
          regionMap.value.set(region.name, region.id);
        }
      });
      console.log(`Loaded ${allRegions.value.length} regions`);
      return allRegions.value;
    }

    console.warn("Regions response is not an array:", response);
    return [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const params = new URLSearchParams();

    if (selectedFilters.value.level) {
      params.append("difficulty", selectedFilters.value.level);
    }

    if (
      selectedFilters.value.region &&
      selectedFilters.value.region.length > 0
    ) {
      selectedFilters.value.region.forEach((regionName) => {
        const regionId = regionMap.value.get(regionName);
        if (regionId) {
          params.append("region_id", regionId);
        }
      });
    }

    if (selectedFilters.value.style) {
      params.append("tag", selectedFilters.value.style);
    }

    const queryString = params.toString();
    const url = queryString ? `/courses?${queryString}` : "/courses";

    console.log("Fetching courses with URL:", url);

    const response = await apiFetch(url);

    console.log("Courses API Response:", response);

    if (response.success && response.data && response.data.items) {
      const courses = response.data.items.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.name,
        region: course.region_name || "Регион не указан",
        region_id: course.region_id || undefined,
        description: course.description || "Описание курса пока не добавлено.",
        backgroundImage: mediaUrl(course.main_image_key) || fallbackCourseImage,
        level: course.difficulty,
        style: course.tags && course.tags.length > 0 ? course.tags[0] : null,
        tags: course.tags || [],
      }));
      return courses;
    }

    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const coursesData = ref([]);

const loadCourses = async () => {
  coursesData.value = await fetchCourses();
};

const getRegionFilterLabel = () => {
  if (selectedFilters.value.region.length === 0) return "Регион";
  if (selectedFilters.value.region.length === 1)
    return selectedFilters.value.region[0];
  return `Регион (${selectedFilters.value.region.length})`;
};

const handleRegionFilterChange = () => {
  loadCourses();
};

const initializeData = async () => {
  console.log("Initializing data...");
  await fetchRegions();
  await loadCourses();
};

await initializeData();

if (isAuthenticated.value) {
  try {
    const favorites = await apiFetch("/users/me/favorites");
    if (favorites.success && favorites.data && favorites.data.courses) {
      const favoriteSlugs = new Set(favorites.data.courses);
      favoriteCourseIds.value = new Set(
        coursesData.value
          .filter((course) => favoriteSlugs.has(course.slug))
          .map((course) => course.id)
      );
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    favoriteCourseIds.value = new Set();
  }
}

const courses = computed(() => coursesData.value || []);

const levelOptions = computed(() => {
  const levels = new Set(
    courses.value.map((course) => course.level).filter(Boolean)
  );
  return Array.from(levels);
});

const styleOptions = computed(() => {
  const tags = new Set(
    courses.value.flatMap((course) => course.tags).filter(Boolean)
  );
  return Array.from(tags);
});

const filteredCourses = computed(() => courses.value);

watch(
  () => [
    selectedFilters.value.level,
    selectedFilters.value.region,
    selectedFilters.value.style,
  ],
  async () => {
    await loadCourses();
  },
  { deep: true }
);

const toggleFilter = (filter) => {
  activeFilter.value = activeFilter.value === filter ? null : filter;
};

const selectOption = (filter, option) => {
  if (filter === "region") {
    return;
  }
  selectedFilters.value[filter] = option;
  activeFilter.value = null;
};

const selectLevelOption = (option) => {
  selectedFilters.value.level = option;
  activeFilter.value = null;
};

const resetFilters = () => {
  selectedFilters.value = {
    level: null,
    region: [],
    style: null,
  };
  activeFilter.value = null;
};

const toggleDescription = (courseId) => {
  const next = new Set(expandedCourseIds.value);
  if (next.has(courseId)) {
    next.delete(courseId);
  } else {
    next.add(courseId);
  }
  expandedCourseIds.value = next;
};

const toggleFavorite = async (courseId) => {
  if (!isAuthenticated.value) {
    await navigateTo("/auth");
    return;
  }

  const isFavorite = favoriteCourseIds.value.has(courseId);

  try {
    if (isFavorite) {
      await apiFetch(`/users/me/favorites/${courseId}`, { method: "DELETE" });
    } else {
      await apiFetch(`/users/me/favorites/${courseId}`, { method: "POST" });
    }

    const next = new Set(favoriteCourseIds.value);
    if (isFavorite) {
      next.delete(courseId);
    } else {
      next.add(courseId);
    }
    favoriteCourseIds.value = next;
  } catch (error) {
    console.error("Failed to toggle favorite", error);
  }
};

const handleClickOutside = (event) => {
  const target = event.target;
  if (!target?.closest(".filter-item")) {
    activeFilter.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss">
.catalog-container {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.catalog {
  margin-top: 50px;

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 50px;
  }

  &__filters {
    &--container {
      width: 100%;
      background-color: #11243f;
      position: relative;
    }

    &--view {
      margin-left: auto;
      margin-right: auto;
      max-width: 1920px;
      padding: 0 75px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &--block {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 30px;
      width: 50%;
    }

    &--blocktwo {
      background-color: #fff;
      padding: 20px;
      border-radius: 15px;
      font-size: 30px;
      font-weight: 600;
      color: #11243f;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      width: auto;
      flex-shrink: 0;

      &:hover {
        background-color: #e8e4dd;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    max-width: 1920px;
    margin: 40px auto;
    padding: 0 75px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      padding: 0 20px;
      gap: 20px;
    }
  }
}

.catalog__tab {
  width: 100%;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &--view {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #11243f;
    opacity: 0.6;
    border-radius: 16px;
    pointer-events: none;
  }

  &--content {
    position: relative;
    z-index: 2;
    padding: 50px;
    color: #fffcf6;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h2 {
    font-size: 55px;
    font-weight: 700;
    margin: 0;
    font-family: "Inter", sans-serif;
    color: #fffcf6;
  }

  h3 {
    font-size: 40px;
    font-weight: 500;
    margin: 0;
    opacity: 0.9;
    color: #fffcf6;
  }

  &--actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    font-size: 24px;
  }

  &--description {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out, margin-top 0.3s ease;
    margin-top: 0;
    font-size: 24px;
    line-height: 1.5;
    color: rgba(255, 252, 246, 0.9);

    p {
      margin: 0;
      padding-top: 12px;
    }

    &--expanded {
      max-height: 1000px;
      margin-top: 8px;
    }
  }
}

.description-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 30px;
  border-radius: 30px;
  transition: all 0.3s ease;
  width: fit-content;

  p {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: #fffcf6;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(2px);
  }
}

.description-arrow {
  transition: transform 0.3s ease;
}

.description-toggle--open .description-arrow {
  transform: rotate(180deg);
}

.heart-icon {
  cursor: pointer;
  transition: transform 0.2s ease;
  color: rgba(255, 252, 246, 0.8);

  &:hover {
    transform: scale(1.1);
    color: #ff6b6b;
  }
}

.filter-item {
  background-color: #fff;
  padding: 20px 20px;
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.3s ease;
  min-width: 180px;

  > p {
    margin: 0;
    font-size: 30px;
    font-weight: 500;
    color: #11243f;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.3s ease;
  }

  > span {
    color: #11243f;
    transition: color 0.3s ease;
  }

  &:hover {
    background-color: #1f3a5f;
    box-shadow: 0 0 15px 5px #1f3a5f;

    > p,
    > span {
      color: #fff;
    }

    svg path {
      stroke: #fff;
    }
  }

  &--active {
    background-color: #1f3a5f;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    > p,
    > span {
      color: #fffcf6;
    }
  }
}

.filter-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;

    path {
      stroke: #11243f;
      transition: stroke 0.3s ease;
    }
  }

  &.filter-arrow--open {
    transform: rotate(180deg);
  }
}

.filter-item--active {
  .filter-arrow svg path {
    stroke: #fffcf6;
  }
}

.filter-item:hover:not(.filter-item--active) {
  .filter-arrow svg path {
    stroke: #fffcf6;
  }
}

.filter-dropdown {
  position: absolute;
  top: 130%;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;

  > p {
    color: #11243f;
    padding: 20px 32px;
    font-size: 24px;
    margin: 0;
    background-color: #fff;
    pointer-events: none;
    border-bottom: 1px solid #e8e4dd;
  }

  &--checkbox {
    min-width: 470px;
  }
}

.filter-options-list {
  max-height: 300px;
  overflow-y: auto;
}

.filter-option {
  padding: 12px 20px;
  font-size: 30px;
  color: #11243f;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #e8e4dd;
    padding-left: 24px;
  }
}

.filter-loading {
  padding: 20px;
  text-align: center;
  color: #11243f;
  font-size: 14px;
}

.filter-option-checkbox {
  padding: 20px 32px;
  font-size: 14px;
  color: #11243f;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e8e4dd;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
  position: relative;
  user-select: none;
  font-size: 24px;
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-custom {
    width: 35px;
    height: 35px;
    border: 2px solid #11243f;
    border-radius: 10px;
    display: inline-block;
    position: relative;
    transition: all 0.2s ease;
    background-color: #fff;
    flex-shrink: 0;
  }

  input:checked + .checkbox-custom {
    background-color: #c65d3b;
    border-color: #c65d3b;

    &::after {
      content: "";
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  input:focus + .checkbox-custom {
    box-shadow: 0 0 0 2px rgba(198, 93, 59, 0.3);
  }

  &:hover .checkbox-custom {
    border-color: #c65d3b;
  }
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.button {
  border-radius: 999px;
  padding: 15px 30px;
  color: #fffcf6;
  font-weight: 700;
  margin: 20px 0 0 0;
  font-size: 24px;
  white-space: nowrap;
  display: inline-flex;
  background-color: #c65d3b;
  font-family: "Inter", sans-serif;
  text-decoration: none;
  width: fit-content;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px 5px rgba(198, 93, 59, 0.5);
  }
}
</style>
