<template>
  <div class="catalog-container">
    <Header />
    <div class="catalog">
      <h1>КАТАЛОГ КУРСОВ</h1>
      <div class="catalog__filters--container">
        <div class="catalog__filters--view">
          <div class="catalog__filters--block">
            <div class="filter-item-wrapper">
              <div
                class="filter-item"
                :class="{ 'filter-item--active': activeFilter === 'level' }"
                @click.stop="toggleFilter('level')"
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
              </div>
              <div v-if="activeFilter === 'level'" class="filter-dropdown" @click.stop>
                <p>Фильтр сложности</p>
                <div
                  v-for="option in levelOptions"
                  :key="option.value"
                  class="filter-option"
                  :class="{ 'filter-option--active': selectedFilters.level === option.value }"
                  @click="selectLevelOption(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>

            <div class="filter-item-wrapper">
              <div
                class="filter-item filter-item--checkbox"
                :class="{ 'filter-item--active': activeFilter === 'region' }"
                @click.stop="toggleFilter('region')"
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
              </div>
              <div
                v-if="activeFilter === 'region'"
                class="filter-dropdown filter-dropdown--checkbox"
                @click.stop
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

            <div class="filter-item-wrapper">
              <div
                class="filter-item"
                :class="{ 'filter-item--active': activeFilter === 'style' }"
                @click.stop="toggleFilter('style')"
              >
                <p>{{ getStyleFilterLabel() }}</p>
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
              </div>
              <div v-if="activeFilter === 'style'" class="filter-dropdown" @click.stop>
                <p>Фильтр стилей</p>
                <div v-if="allTags.length === 0" class="filter-loading">
                  Загрузка стилей...
                </div>
                <div
                  v-for="tag in allTags"
                  :key="tag.id"
                  class="filter-option"
                  :class="{ 'filter-option--active': selectedFilters.style === tag.slug }"
                  @click="selectOption('style', tag.slug)"
                >
                  {{ tag.name }}
                </div>
              </div>
            </div>
          </div>
          <p class="catalog__filters--blocktwo" @click="resetFilters">
            Сбросить
          </p>
        </div>
        
        <!-- Мобильная версия -->
        <div class="catalog__filters--mobile">
          <!-- Отображение выбранных фильтров в виде чипов -->
          <div v-if="hasActiveFilters" class="mobile-active-filters">
            <div 
              v-if="selectedFilters.level" 
              class="mobile-filter-chip"
              @click="removeFilter('level')"
            >
              {{ translateLevel(selectedFilters.level) }}
              <span class="chip-remove">×</span>
            </div>
            <div 
              v-for="region in selectedFilters.region" 
              :key="region"
              class="mobile-filter-chip"
              @click="removeRegionFilter(region)"
            >
              {{ region }}
              <span class="chip-remove">×</span>
            </div>
            <div 
              v-if="selectedFilters.style" 
              class="mobile-filter-chip"
              @click="removeFilter('style')"
            >
              {{ getStyleName(selectedFilters.style) }}
              <span class="chip-remove">×</span>
            </div>
          </div>
          
          <!-- Кнопка управления фильтрами -->
          <div 
            class="catalog__filters--mobile-btn"
            :class="{ 'has-filters': hasActiveFilters }"
            @click="openMobileFilters"
          >
            <span v-if="!hasActiveFilters">Настроить фильтрацию</span>
            <span v-else>Сбросить фильтры</span>
          </div>
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

    <div
      class="mobile-filters-overlay"
      :class="{ active: isMobileFiltersOpen }"
      @click="closeMobileFilters"
    ></div>
    <div class="mobile-filters-menu" :class="{ active: isMobileFiltersOpen }">
      <div class="mobile-filters-content">
        <div class="mobile-filter-section">
          <div class="mobile-filter-section-header">
            <span>Фильтр сложности</span>
          </div>
          <div class="mobile-filter-options">
            <div
              v-for="option in levelOptions"
              :key="option.value"
              class="mobile-filter-option"
              :class="{ 'mobile-filter-option--active': selectedFilters.level === option.value }"
              @click="selectedFilters.level = option.value"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <div class="mobile-filter-section">
          <div class="mobile-filter-section-header">
            <span>Фильтр региона</span>
          </div>
          <div class="mobile-filter-options">
            <div v-if="allRegions.length === 0" class="filter-loading">
              Загрузка регионов...
            </div>
            <div
              v-for="region in allRegions"
              :key="region.id"
              class="mobile-filter-checkbox"
            >
              <label class="mobile-checkbox-label">
                <input
                  type="checkbox"
                  :value="region.name"
                  v-model="selectedFilters.region"
                />
                <span class="mobile-checkbox-custom"></span>
                {{ region.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="mobile-filter-section">
          <div class="mobile-filter-section-header">
            <span>Фильтр стилей</span>
          </div>
          <div class="mobile-filter-options">
            <div v-if="allTags.length === 0" class="filter-loading">
              Загрузка стилей...
            </div>
            <div
              v-for="tag in allTags"
              :key="tag.id"
              class="mobile-filter-option"
              :class="{ 'mobile-filter-option--active': selectedFilters.style === tag.slug }"
              @click="selectedFilters.style = tag.slug"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-filters-footer">
        <button class="mobile-filters-apply" @click="applyMobileFilters">Применить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import fallbackCourseImage from "@/assets/img/imgtest.png";

const { apiFetch } = useApi();
const { isAuthenticated } = useAuth();
const { mediaUrl } = useMedia();

const levelOptions = ref([
  { value: "beginner", label: "Начинающий" },
  { value: "intermediate", label: "Продолжающий" },
  { value: "advanced", label: "Продвинутый" }
]);

const translateLevel = (level) => {
  const found = levelOptions.value.find(opt => opt.value === level);
  return found ? found.label : level;
};

const activeFilter = ref(null);
const selectedFilters = ref({
  level: null,
  region: [],
  style: null,
});

// Мобильные фильтры
const isMobileFiltersOpen = ref(false);
const expandedCourseIds = ref(new Set());
const favoriteCourseIds = ref(new Set());

const allRegions = ref([]);
const regionMap = ref(new Map());
const allTags = ref([]);

// Вычисляемое свойство для проверки наличия активных фильтров
const hasActiveFilters = computed(() => {
  return !!(selectedFilters.value.level || 
            selectedFilters.value.region.length > 0 || 
            selectedFilters.value.style);
});

// Получение имени стиля по slug
const getStyleName = (slug) => {
  const tag = allTags.value.find(t => t.slug === slug);
  return tag ? tag.name : slug;
};

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

const fetchTags = async () => {
  try {
    const response = await apiFetch("/tags");
    console.log("Tags API Response:", response);

    if (response.success && response.data && response.data.tags) {
      allTags.value = response.data.tags;
      console.log(`Loaded ${allTags.value.length} tags`);
      return allTags.value;
    }

    console.warn("Tags response structure unexpected:", response);
    return [];
  } catch (error) {
    console.error("Error fetching tags:", error);
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

const getStyleFilterLabel = () => {
  if (!selectedFilters.value.style) return "Стиль";
  const selectedTag = allTags.value.find(tag => tag.slug === selectedFilters.value.style);
  return selectedTag ? selectedTag.name : selectedFilters.value.style;
};

const handleRegionFilterChange = () => {
  loadCourses();
};

const initializeData = async () => {
  console.log("Initializing data...");
  await Promise.all([fetchRegions(), fetchTags()]);
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

// Мобильные функции
const openMobileFilters = () => {
  // Если есть активные фильтры, кнопка работает как сброс
  if (hasActiveFilters.value) {
    resetMobileFilters();
  } else {
    // Иначе открываем модалку
    isMobileFiltersOpen.value = true;
    document.body.style.overflow = "hidden";
  }
};

const closeMobileFilters = () => {
  isMobileFiltersOpen.value = false;
  document.body.style.overflow = "";
};

const removeFilter = (filterType) => {
  if (filterType === 'level') {
    selectedFilters.value.level = null;
  } else if (filterType === 'style') {
    selectedFilters.value.style = null;
  }
  loadCourses();
};

const removeRegionFilter = (regionName) => {
  selectedFilters.value.region = selectedFilters.value.region.filter(r => r !== regionName);
  loadCourses();
};

const resetMobileFilters = () => {
  selectedFilters.value = {
    level: null,
    region: [],
    style: null,
  };
  closeMobileFilters();
  loadCourses();
};

const applyMobileFilters = async () => {
  closeMobileFilters();
  await loadCourses();
};

const toggleDescription = (courseId) => {
  if (expandedCourseIds.value.has(courseId)) {
    expandedCourseIds.value.delete(courseId);
  } else {
    expandedCourseIds.value.add(courseId);
  }
};

const toggleFavorite = async (courseId) => {
  if (!isAuthenticated.value) {
    navigateTo("/login");
    return;
  }

  const course = coursesData.value.find((c) => c.id === courseId);
  if (!course) return;

  const isFavorite = favoriteCourseIds.value.has(courseId);
  const previousState = new Set(favoriteCourseIds.value);

  if (isFavorite) {
    favoriteCourseIds.value.delete(courseId);
  } else {
    favoriteCourseIds.value.add(courseId);
  }

  try {
    if (isFavorite) {
      await apiFetch(`/users/me/favorites/${course.slug}`, {
        method: "DELETE",
      });
    } else {
      await apiFetch(`/users/me/favorites/${course.slug}`, {
        method: "POST",
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    favoriteCourseIds.value = previousState;
  }
};

const handleClickOutside = (event) => {
  const target = event.target;
  if (!target?.closest(".filter-item-wrapper")) {
    activeFilter.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.body.style.overflow = "";
});
</script>

<style lang="scss">
.filter-item-wrapper {
  position: relative;
  display: inline-block;
}

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
      position: relative;
      background-color: #11243f;
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

    @media (max-width: 1800px) {
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
  background: #11243f;
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
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
  margin-top: 5px;

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

  &--active {
    background-color: #c65d3b;
    color: white;
    
    &:hover {
      background-color: #c65d3b;
    }
  }
}

.filter-loading {
  padding: 20px;
  text-align: center;
  color: #11243f;
  font-size: 20px;
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
      left: 10px;
      top: 8px;
      width: 12px;
      height: 12px;
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

// Мобильная версия
.catalog__filters--mobile {
  display: none;
  flex-direction: column;
  padding: 0 20px;
  margin-bottom: 20px;
  background-color: white;
}

.mobile-active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.mobile-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #1f3a5f;
  border-radius: 10px;
  color: #fffcf6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .chip-remove {
    font-size: 18px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    background-color: #c65d3b;
    
    .chip-remove {
      opacity: 1;
    }
  }
}

.catalog__filters--mobile-btn {
  padding: 12px 0;
  text-align: center;
  color: #fff;
  width: 100%;
  background-color: #11243f;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(17, 36, 63, 0.85);
  }
  
  &.has-filters {
    background-color: #A1A1AA;
    
    &:hover {
      background-color: #8a8a93;
    }
  }
}

// Выезжающая модалка
.mobile-filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 998;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-filters-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100vh;
  background-color: #1F3A5F;
  z-index: 999;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);

  &.active {
    right: 0;
  }
}

.mobile-filters-content {
  margin-top: 60px;
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background-color: #1F3A5F;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
}

.mobile-filter-section {
  &:last-child {
    border-bottom: none;
  }
}

.mobile-filter-section-header {
  padding: 17px 0px 0px 27px;
  background-color: #1F3A5F;

  span {
    font-size: 12px;
    font-weight: 400;
    color: #A1A1AA;
    font-family: "Inter", sans-serif;
  }
}

.mobile-filter-options {
  padding: 8px 0 0px 27px;
}

.mobile-filter-option {
  padding: 10px 0px;
  font-size: 14px;
  color: rgba(255, 252, 246, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    padding-left: 20px;
  }

  &--active {
    background-color: #c65d3b;
    color: white;
    
    &:hover {
      background-color: #c65d3b;
    }
  }
}

.mobile-filter-checkbox {
  padding: 8px 0;
}

.mobile-checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
  position: relative;
  user-select: none;
  font-size: 14px;
  color: rgba(255, 252, 246, 0.8);
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .mobile-checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 252, 246, 0.5);
    border-radius: 5px;
    display: inline-block;
    position: relative;
    transition: all 0.2s ease;
    background-color: transparent;
    flex-shrink: 0;
  }

  input:checked + .mobile-checkbox-custom {
    background-color: #c65d3b;
    border-color: #c65d3b;

    &::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 2px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  input:focus + .mobile-checkbox-custom {
    box-shadow: 0 0 0 2px rgba(198, 93, 59, 0.3);
  }

  &:hover .mobile-checkbox-custom {
    border-color: #c65d3b;
  }
}

.mobile-filters-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background-color: #1F3A5F;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.mobile-filters-apply {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background-color: #fff;
  border: none;
  color: #1F3A5F;

  &:hover {
    background-color: #fff;
    transform: translateY(-2px);
  }
}

@media (max-width: 1200px) {
  .catalog__filters--view {
    display: none;
  }
  
  .catalog__filters--mobile {
    display: flex;
  }
  
  .catalog {
    margin-top: 18px;
    
    h1 {
      display: none;
    }
  }
  
  .catalog__grid {
    margin-top: 18px;
  }
  
  .catalog__tab {
    border-radius: 20px;
    min-height: 141px;
    
    &--content {
      padding: 22.1px;
      
      h2 {
        font-size: 24px;
      }
      
      h3 {
        font-size: 17px;
      }
    }
    
    &--actions {
      margin-top: 0;
      
      .description-toggle {
        padding: 5px 21px;
        
        p {
          font-size: 14px;
        }
      }
      
      .description-arrow {
        width: 12px;
        height: 8px;
      }
      
      .heart-icon {
        svg {
          width: 31px;
          height: 28px;
        }
      }
    }
    
    &--description {
      p {
        font-size: 14px;
      }
      
      .button {
        font-size: 14px;
        padding: 5px 21px;
      }
    }
  }
}
</style>