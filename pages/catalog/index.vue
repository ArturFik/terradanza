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
              <p :class="{ 'style-active': activeFilter === 'level' }">
                {{ selectedFilters.level || "Уровень сложности" }}
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
                  @click.stop="selectOption('level', option)"
                >
                  {{ option }}
                </div>
              </div>
            </div>

            <div
              class="filter-item"
              :class="{ 'filter-item--active': activeFilter === 'region' }"
              @click="toggleFilter('region')"
            >
              <p>{{ selectedFilters.region || "Регион" }}</p>
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
              <div v-if="activeFilter === 'region'" class="filter-dropdown">
                <p>Фильтр региона</p>
                <div
                  v-for="option in regionOptions"
                  :key="option"
                  class="filter-option"
                  @click.stop="selectOption('region', option)"
                >
                  {{ option }}
                </div>
              </div>
            </div>

            <div
              class="filter-item"
              :class="{ 'filter-item--active': activeFilter === 'style' }"
              @click="toggleFilter('style')"
            >
              <p>{{ selectedFilters.style || "Тег" }}</p>
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
                <p>Фильтр тегов</p>
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
                    width="24"
                    height="24"
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

<script setup lang="ts">
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import fallbackCourseImage from "@/assets/img/imgtest.png";

type CourseItem = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  region_name?: string | null;
  region_id?: string | null;
  difficulty: string;
  main_image_key?: string | null;
  tags: string[];
};

type CourseListResponse = {
  success: boolean;
  data: {
    items: CourseItem[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  message: string;
};

type FavoriteResponse = {
  success: boolean;
  data: {
    courses: string[];
  };
};

type DisplayCourse = {
  id: string;
  slug: string;
  title: string;
  region: string;
  region_id?: string;
  description: string;
  backgroundImage: string;
  level: string;
  style: string | null;
  tags: string[];
};

const { apiFetch } = useApi();
const { isAuthenticated } = useAuth();
const { mediaUrl } = useMedia();

const activeFilter = ref<string | null>(null);
const selectedFilters = ref({
  level: null as string | null,
  region: null as string | null,
  style: null as string | null,
});

const expandedCourseIds = ref(new Set<string>());
const favoriteCourseIds = ref(new Set<string>());

// Хранилище для регионов с их ID
const regionMap = ref<Map<string, string>>(new Map());

// Функция для получения курсов с фильтрами
const fetchCourses = async (): Promise<DisplayCourse[]> => {
  try {
    const params = new URLSearchParams();

    if (selectedFilters.value.level) {
      params.append("difficulty", selectedFilters.value.level);
    }

    if (selectedFilters.value.region) {
      const regionId = regionMap.value.get(selectedFilters.value.region);
      if (regionId) {
        params.append("region_id", regionId);
      }
    }

    if (selectedFilters.value.style) {
      params.append("tag", selectedFilters.value.style);
    }

    const queryString = params.toString();
    const url = queryString ? `/courses?${queryString}` : "/courses";

    console.log("Fetching courses with URL:", url); // Для отладки

    const response = await apiFetch<CourseListResponse>(url);

    console.log("API Response:", response); // Для отладки

    const courses = response.data.items.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.name,
      region: course.region_name || "Регион не указан",
      region_id: course.region_id || undefined,
      description: course.description || "Описание курса пока не добавлено.",
      backgroundImage: mediaUrl(course.main_image_key) || fallbackCourseImage,
      level: course.difficulty,
      style: course.tags[0] || null,
      tags: course.tags,
    }));

    // Обновляем карту регионов
    courses.forEach((course) => {
      if (course.region && course.region_id) {
        regionMap.value.set(course.region, course.region_id);
      }
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const coursesData = ref<DisplayCourse[]>([]);

// Загружаем курсы
const loadCourses = async () => {
  coursesData.value = await fetchCourses();
};

// Начальная загрузка
await loadCourses();

// Загружаем избранное, если пользователь авторизован
if (isAuthenticated.value) {
  try {
    const favorites = await apiFetch<FavoriteResponse>("/users/me/favorites");
    const favoriteSlugs = new Set(favorites.data.courses);
    favoriteCourseIds.value = new Set(
      coursesData.value
        .filter((course) => favoriteSlugs.has(course.slug))
        .map((course) => course.id)
    );
  } catch {
    favoriteCourseIds.value = new Set();
  }
}

const courses = computed(() => coursesData.value || []);

const levelOptions = computed(() => [
  ...new Set(courses.value.map((course) => course.level).filter(Boolean)),
]);

const regionOptions = computed(() => {
  // Получаем все уникальные регионы из карты регионов
  return Array.from(regionMap.value.keys());
});

const styleOptions = computed(() => [
  ...new Set(courses.value.flatMap((course) => course.tags).filter(Boolean)),
]);

const filteredCourses = computed(() => courses.value);

// Используем watch для отслеживания изменений фильтров
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

const toggleFilter = (filter: string) => {
  activeFilter.value = activeFilter.value === filter ? null : filter;
};

const selectOption = (filter: "level" | "region" | "style", option: string) => {
  selectedFilters.value[filter] = option;
  activeFilter.value = null;
};

const resetFilters = () => {
  selectedFilters.value = {
    level: null,
    region: null,
    style: null,
  };
  activeFilter.value = null;
};

const toggleDescription = (courseId: string) => {
  const next = new Set(expandedCourseIds.value);
  if (next.has(courseId)) {
    next.delete(courseId);
  } else {
    next.add(courseId);
  }
  expandedCourseIds.value = next;
};

const toggleFavorite = async (courseId: string) => {
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

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;
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
    font-size: 80px;
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
      max-width: 1234px;
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
      gap: 15px;
      width: 50%;
    }

    &--blocktwo {
      background-color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
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
    max-width: 1234px;
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
  border-radius: 16px;
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
    padding: 24px;
    color: #fffcf6;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    font-family: "Inter", sans-serif;
    color: #fffcf6;
  }

  h3 {
    font-size: 18px;
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
  }

  &--description {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out, margin-top 0.3s ease;
    margin-top: 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 252, 246, 0.9);

    p {
      margin: 0;
      padding-top: 12px;
    }

    &--expanded {
      max-height: 220px;
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
  padding: 8px 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  width: fit-content;

  p {
    margin: 0;
    font-size: 14px;
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
  padding: 12px 20px;
  border-radius: 8px;
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
    font-size: 16px;
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
  width: 10px;
  height: 10px;
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
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;

  > p {
    color: #11243f;
    padding: 10px 20px;
    font-size: 12px;
    margin: 0;
    background-color: #fff;
    pointer-events: none;
  }
}

.filter-option {
  padding: 12px 20px;
  font-size: 14px;
  color: #11243f;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #e8e4dd;
    padding-left: 24px;
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
  padding: 7px 30px;
  color: #fffcf6;
  font-weight: 700;
  margin: 20px 0 0 0;
  font-size: 14px;
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
