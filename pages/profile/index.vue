<template>
  <div class="profile-page-container">
    <Header />
    <div v-if="currentUser" class="profile-page-container__account">
      <h1 class="profile-page-container__title">ПРОФИЛЬ</h1>
      <div class="profile-page-container__logo">
        <div class="profile-page-container__avatar-wrapper" @click="triggerFileUpload">
          <div v-if="avatarUrl" class="profile-page-container__avatar-image-wrapper">
            <img :src="avatarUrl" alt="logo" class="profile-page-container__avatar" />
          </div>
          <div v-else class="profile-page-container__avatar-initials">
            <span>{{ userInitials }}</span>
          </div>
          <div class="profile-page-container__avatar-overlay">
            <span>Изменить</span>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleAvatarUpload"
        />
        <div class="profile-page-container__logo-view">
          <p class="profile-page-container__logo-view--name">{{ fullName }}</p>
          <p class="profile-page-container__logo-view--rank">{{ rankLabel }}</p>
          <p class="profile-page-container__logo-view--edit" @click="goToPage('profile/edit')">
            Редактировать профиль
          </p>
          <p class="profile-page-container__logo-view--logout" @click="handleLogout">Выйти</p>
        </div>
      </div>
      <div
        v-if="avatarMessage"
        class="profile-page-container__avatar-message"
        :class="avatarMessageType"
      >
        {{ avatarMessage }}
      </div>

      <div class="profile-page-container__tabs">
        <img
          v-for="(tab, index) in tabs"
          :key="index"
          :src="tab.img"
          :alt="`tab-${index}`"
          :class="{ 'profile-page-container__tab--active': activeTab === index }"
          class="profile-page-container__tab"
          @click="activeTab = index"
        />
      </div>

      <div v-if="activeTab === 0" class="profile-page-container__achievements">
        <div v-if="achievementRows.length">
          <div
            class="profile-page-container__achievements-row"
            v-for="(row, rowIndex) in achievementRows"
            :key="rowIndex"
          >
            <div
              v-for="achievement in row"
              :key="achievement.id"
              class="profile-page-container__achievement-item"
            >
              <div class="profile-page-container__achievement-image-wrapper">
                <img
                  :src="achievement.icon"
                  :alt="achievement.name"
                  class="profile-page-container__achievement-icon"
                />
                <div class="profile-page-container__achievement-overlay">
                  <p class="profile-page-container__achievement-description">
                    {{ achievement.description }}
                  </p>
                </div>
              </div>
              <p class="profile-page-container__achievement-name">{{ achievement.name }}</p>
            </div>
          </div>
        </div>
        <p v-else class="profile-page-container__empty-state">Пока нет полученных достижений.</p>
      </div>

      <div v-if="activeTab === 1" class="profile-page-container__progress">
        <div class="profile-page-container__grid">
          <div
            v-for="course in enrolledCourses"
            :key="course.id"
            class="profile-page-container__card-wrapper"
          >
            <div
              class="profile-page-container__card"
              :class="{ 'profile-page-container__card--expanded': expandedCourseIds.has(course.id) }"
            >
              <div
                class="profile-page-container__card-bg"
                :style="{ backgroundImage: `url(${course.backgroundImage})` }"
              >
                <div class="profile-page-container__card-overlay"></div>
                <div class="profile-page-container__card-content">
                  <h2 class="profile-page-container__card-title">{{ course.title }}</h2>
                  <h3 class="profile-page-container__card-region">{{ course.region }}</h3>
                  <div class="profile-page-container__progress-bar-wrapper">
                    <div class="profile-page-container__progress-bar-bg">
                      <div
                        class="profile-page-container__progress-bar-fill"
                        :style="{ width: course.progress + '%' }"
                      ></div>
                    </div>
                    <span class="profile-page-container__progress-percentage"
                      >{{ course.progress }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!enrolledCourses.length" class="profile-page-container__empty-state">
          Вы пока не записаны ни на один курс.
        </p>
      </div>

      <div v-if="activeTab === 2" class="profile-page-container__favorites">
        <div class="profile-page-container__grid">
          <div
            v-for="course in favoriteCourses"
            :key="course.id"
            class="profile-page-container__card-wrapper"
          >
            <div
              class="profile-page-container__card"
              :class="{ 'profile-page-container__card--expanded': expandedCourseIds.has(course.id) }"
            >
              <div
                class="profile-page-container__card-bg"
                :style="{ backgroundImage: `url(${course.backgroundImage})` }"
              >
                <div class="profile-page-container__card-overlay"></div>
                <div class="profile-page-container__card-content">
                  <h2 class="profile-page-container__card-title">{{ course.title }}</h2>
                  <h3 class="profile-page-container__card-region">{{ course.region }}</h3>
                  <div class="profile-page-container__card-actions">
                    <div
                      class="profile-page-container__description-toggle"
                      :class="{
                        'profile-page-container__description-toggle--open': expandedCourseIds.has(
                          course.id
                        ),
                      }"
                      @click="toggleDescription(course.id)"
                    >
                      <p>Описание</p>
                      <svg
                        class="profile-page-container__description-arrow"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                    <div
                      class="profile-page-container__heart-icon profile-page-container__heart-icon--active"
                      @click="toggleFavorite(course.id)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                        fill="#ff6b6b"
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
                  <div class="profile-page-container__card-description">
                    <div class="profile-page-container__card-description-inner">
                      <p>{{ course.description }}</p>
                      <NuxtLink
                        class="profile-page-container__button"
                        :to="{
                          path: '/about_course',
                          query: { slug: course.slug },
                        }"
                      >
                        Подробнее о курсе
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!favoriteCourses.length" class="profile-page-container__empty-state">
          Избранных курсов пока нет.
        </p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import frameImg from "@/assets/img/Frame.png";
import frame2Img from "@/assets/img/Frame2.png";
import frame3Img from "@/assets/img/Frame3.png";
import { useRouter } from "vue-router";

import notShyLocked from "/assets/img/not_shy_locked.png";
import totalTheoristLocked from "/assets/img/total_theorist_locked.png";
import firstPancakeLocked from "/assets/img/first_pancake_locked.png";
import soulOfCompanyLocked from "/assets/img/soul_of_company_locked.png";
import antiSpoilerLocked from "/assets/img/anti_spoiler_locked.png";
import absoluteDancerLocked from "/assets/img/absolute_dancer_locked.png";
import noSkipsLocked from "/assets/img/no_skips_locked.png";
import likeMasterLocked from "/assets/img/like_master_locked.png";

const ALL_ACHIEVEMENTS = {
  not_shy: {
    code: "not_shy",
    name: "Не постеснялся",
    description:
      "Пересдал тест после первой неудачи и сдал его на 100% со второй попытки",
    icon_key: "achievements/default/not_shy.png",
    default_icon: notShyLocked,
  },
  total_theorist: {
    code: "total_theorist",
    name: "Тотальный теоретик",
    description: "Набрал 100% в тесте с первой попытки",
    icon_key: "achievements/default/total_theorist.png",
    default_icon: totalTheoristLocked,
  },
  first_pancake: {
    code: "first_pancake",
    name: "Первый блин не комом",
    description: "Досмотрел первый видео-урок первого курса до конца",
    icon_key: "achievements/default/first_pancake.png",
    default_icon: firstPancakeLocked,
  },
  soul_of_company: {
    code: "soul_of_company",
    name: "Душа компании",
    description:
      "Просмотрел все уроки курса за 24 часа после начала первого урока",
    icon_key: "achievements/default/soul_of_company.png",
    default_icon: soulOfCompanyLocked,
  },
  anti_spoiler: {
    code: "anti_spoiler",
    name: "Анти-спойлер",
    description:
      "Сдал тест до того, как посмотрел последний урок (минимум 80%)",
    icon_key: "achievements/default/anti_spoiler.png",
    default_icon: antiSpoilerLocked,
  },
  absolute_dancer: {
    code: "absolute_dancer",
    name: "Абсолютный танцор",
    description: "Прошел 3 курса полностью и сдал финальный тест на >79%",
    icon_key: "achievements/default/absolute_dancer.png",
    default_icon: absoluteDancerLocked,
  },
  no_skips: {
    code: "no_skips",
    name: "Ни одного пропуска",
    description:
      "Заканчивал по одному уроку каждый день подряд до завершения курса",
    icon_key: "achievements/default/no_skips.png",
    default_icon: noSkipsLocked,
  },
  like_master: {
    code: "like_master",
    name: "Лайк-мастер",
    description: "Добавил в избранное хотя бы 3 курса",
    icon_key: "achievements/default/like_master.png",
    default_icon: likeMasterLocked,
  },
};

const { currentUser, fetchMe, isAuthenticated, logout } = useAuth();
const { apiFetch } = useApi();
const { mediaUrl } = useMedia();

if (!isAuthenticated.value) {
  await navigateTo({ path: "/auth", query: { redirect: "/profile" } });
}

if (!currentUser.value) {
  await fetchMe();
}

const fileInput = ref(null);
const avatarMessage = ref("");
const avatarMessageType = ref("success");

const activeTab = ref(0);
const tabs = ref([{ img: frameImg }, { img: frame2Img }, { img: frame3Img }]);
const expandedCourseIds = ref(new Set());

const { data, refresh } = await useAsyncData("profile-data", async () => {
  const [allCourses, favorites, enrolled, courseProgress, achievementsResponse] = await Promise.all([
    apiFetch("/courses"),
    apiFetch("/users/me/favorites"),
    apiFetch("/users/me/courses"),
    apiFetch("/users/me/course-progress"),
    apiFetch("/users/me/achievements"),
  ]);

  const courseMap = new Map(
    allCourses.data.items.map((course) => [
      course.slug,
      {
        id: course.id,
        slug: course.slug,
        title: course.name,
        region: course.region_name || "Регион не указан",
        description: course.description || "Описание курса пока не добавлено.",
        backgroundImage: mediaUrl(course.main_image_key) || "/placeholder-course.jpg",
      },
    ])
  );

  const progressMap = new Map();
  if (courseProgress.data?.courses) {
    courseProgress.data.courses.forEach((progress) => {
      progressMap.set(progress.course_slug, progress.progress_percent || 0);
    });
  }

  const allAchievementsList = Object.values(ALL_ACHIEVEMENTS).map(
    (achievement) => {
      const earnedAchievement = achievementsResponse.data.achievements.find(
        (a) => a.code === achievement.code
      );

      if (earnedAchievement) {
        return {
          id: earnedAchievement.id,
          name: achievement.name,
          description: achievement.description,
          icon:
            mediaUrl(earnedAchievement.icon_key) ||
            mediaUrl(achievement.icon_key) ||
            achievement.default_icon,
          earned: true,
          earned_at: earnedAchievement.earned_at,
          code: achievement.code,
        };
      } else {
        return {
          id: `locked_${achievement.code}`,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.default_icon,
          earned: false,
          code: achievement.code,
        };
      }
    }
  );

  return {
    achievements: allAchievementsList,
    favoriteCourses: favorites.data.courses
      .map((slug) => courseMap.get(slug))
      .filter(Boolean),
    enrolledCourses: enrolled.data.courses
      .map((slug) => courseMap.get(slug))
      .filter(Boolean)
      .map((course) => ({
        ...course,
        progress: progressMap.get(course.slug) || 0,
      })),
  };
});

const achievements = computed(() => data.value?.achievements || []);
const favoriteCourses = computed(() => data.value?.favoriteCourses || []);
const enrolledCourses = computed(() => data.value?.enrolledCourses || []);

const achievementRows = computed(() => {
  const rows = [];
  for (let index = 0; index < achievements.value.length; index += 4) {
    rows.push(achievements.value.slice(index, index + 4));
  }
  return rows;
});

const avatarUrl = computed(() => {
  const key = currentUser.value?.avatar_key;
  return key ? mediaUrl(key) : null;
});

const fullName = computed(() => {
  const parts = [currentUser.value?.surname, currentUser.value?.name].filter(Boolean);
  return parts.join(" ") || currentUser.value?.email || "Пользователь";
});

const userInitials = computed(() => {
  const surname = currentUser.value?.surname || '';
  const name = currentUser.value?.name || '';
  const firstChar = name ? name.charAt(0).toUpperCase() : '';
  const secondChar = surname ? surname.charAt(0).toUpperCase() : '';
  if (firstChar && secondChar) return `${firstChar}${secondChar}`;
  if (firstChar) return firstChar;
  if (secondChar) return secondChar;
  return '?';
});

const rankLabel = computed(() => {
  const rankMap = {
    novice: "Новичок",
    amateur: "Любитель",
    pro: "Профи",
  };
  return rankMap[currentUser.value?.cached_rank || "novice"] || "Новичок";
});

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
  try {
    await apiFetch(`/users/me/favorites/${courseId}`, { method: "DELETE" });
    const next = favoriteCourses.value.filter(
      (course) => course.id !== courseId
    );
    data.value = {
      achievements: achievements.value,
      enrolledCourses: enrolledCourses.value,
      favoriteCourses: next,
    };
  } catch (error) {
    console.error("Failed to remove favorite", error);
  }
};

const handleLogout = async () => {
  await logout();
  await navigateTo("/auth");
};

const router = useRouter();

const goToPage = (page) => {
  router.push(`/${page}`);
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleAvatarUpload = async (event) => {
  const target = event.target;
  const file = target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    avatarMessage.value = "Пожалуйста, выберите изображение";
    avatarMessageType.value = "error";
    setTimeout(() => {
      avatarMessage.value = "";
    }, 3000);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    avatarMessage.value = "Размер файла не должен превышать 5MB";
    avatarMessageType.value = "error";
    setTimeout(() => {
      avatarMessage.value = "";
    }, 3000);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  avatarMessage.value = "Загрузка...";
  avatarMessageType.value = "success";

  try {
    const response = await apiFetch("/users/me/avatar", {
      method: "PUT",
      body: formData,
    });

    if (response.success) {
      avatarMessage.value = "Аватар успешно обновлен";
      avatarMessageType.value = "success";
      await fetchMe();
      setTimeout(() => {
        avatarMessage.value = "";
      }, 3000);
    } else {
      throw new Error(response.message || "Ошибка загрузки");
    }
  } catch (error) {
    avatarMessage.value = error?.data?.detail || "Ошибка при загрузке аватара";
    avatarMessageType.value = "error";
    setTimeout(() => {
      avatarMessage.value = "";
    }, 3000);
  } finally {
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-page-container {
  background-color: #fff;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  & > &__account {
    padding: 0 135px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1920px;
    width: 100%;
    margin-top: 50px;
    box-sizing: border-box;

    @media (max-width: 768px) {
      padding: 0 20px;
    }
  }

  &__title {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 60px;
    }
  }

  &__logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    max-width: 100%;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__avatar-wrapper {
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    &:hover .profile-page-container__avatar-overlay {
      opacity: 1;
    }
  }

  &__avatar-image-wrapper {
    width: 293px;
    height: 293px;
    border-radius: 9999px;
    overflow: hidden;
    
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }
  
  &__avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__avatar-initials {
    width: 293px;
    height: 293px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #c65d3b 0%, #a84a2d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    
    span {
      font-size: 100px;
      font-weight: 600;
      color: #fffcf6;
      font-family: "Inter", sans-serif;
      text-transform: uppercase;
    }
    
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
      
      span {
        font-size: 68px;
      }
    }
  }

  &__avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    span {
      color: white;
      font-size: 24px;
      font-family: "Inter", sans-serif;
      text-align: center;
    }
  }

  &__avatar-message {
    margin-top: 10px;
    margin-left: 0;
    font-size: 12px;
    font-family: "Inter", sans-serif;

    &.success {
      color: #4caf50;
    }

    &.error {
      color: #c65d3b;
    }
  }

  &__logo-view {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    flex: 1;

    &--name {
      font-size: 51.1px;
      font-weight: 600;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 0;

      @media (max-width: 768px) {
        font-size: 28px;
      }
    }

    &--rank {
      font-size: 45px;
      font-weight: 400;
      color: #11243f;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 5px 0;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }

    &--edit {
      font-size: 36px;
      font-weight: 400;
      color: #c65d3b;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 28px 0 0 0;
      cursor: pointer;

      @media (max-width: 768px) {
        font-size: 20px;
        margin-top: 15px;
      }
    }

    &--logout {
      font-size: 36px;
      font-weight: 400;
      text-decoration: underline;
      color: #c65d3b;
      text-align: left;
      font-family: "Inter", sans-serif;
      margin: 10px 0;
      cursor: pointer;

      @media (max-width: 768px) {
        font-size: 20px;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px;
    width: 100%;
    margin: 40px 0;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  &__card-wrapper {
    width: 100%;
    display: flex;
  }

  &__card {
    width: 100%;
    display: flex;
    transition: all 0.3s ease;
    
    &-bg {
      font-family: "Inter", sans-serif;
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 37px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      min-height: 300px;
      overflow: hidden;
    }

    &-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #11243f;
      opacity: 0.6;
      border-radius: 37px;
      pointer-events: none;
    }

    &-content {
      position: relative;
      z-index: 2;
      padding: 30px;
      color: #fffcf6;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;

      @media (max-width: 768px) {
        padding: 20px;
      }
    }

    &-title {
      font-size: 51px;
      font-weight: 700;
      margin: 0;
      font-family: "Inter", sans-serif;
      color: #fffcf6;
      word-break: break-word;

      @media (max-width: 768px) {
        font-size: 28px;
      }
    }

    &-region {
      font-size: 37px;
      font-weight: 500;
      margin: 0;
      opacity: 0.9;
      color: #fffcf6;
      word-break: break-word;

      @media (max-width: 768px) {
        font-size: 20px;
      }
    }

    &-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      gap: 10px;
      flex-wrap: wrap;
    }

    &-description {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 0;
      
      &-inner {
        padding-top: 12px;
        font-size: 25px;
        line-height: 1.5;
        color: rgba(255, 252, 246, 0.9);
        
        p {
          margin: 0 0 12px 0;
        }
      }
    }
  }

  &__card--expanded {
    .profile-page-container__card-description {
      max-height: 1000px;
    }
  }

  &__tabs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
    gap: 20px;
    padding: 0 100px;
  }

  &__tab {
    cursor: pointer;
    transition: all 0.3s ease;
    padding-bottom: 10px;
    object-fit: contain;

    &--active {
      border-bottom: 3px solid #c65d3b;
    }

    &:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
  }

  &__achievements-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    width: 100%;
    margin-top: 50px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__achievement-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__achievement-image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1.2;
    cursor: pointer;
    overflow: hidden;
    background-color: #fff;

    &:hover .profile-page-container__achievement-icon {
      filter: blur(4px);
    }

    &:hover .profile-page-container__achievement-overlay {
      opacity: 1;
    }
  }

  &__achievement-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: filter 0.3s ease;
    display: block;
  }

  &__achievement-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(4px);
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &__achievement-description {
    font-size: 27px;
    text-align: center;
    color: #11243f;
    font-family: "Inter", sans-serif;
    padding: 12px;
    margin: 0;
    line-height: 1.4;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  &__achievement-name {
    font-size: 28px;
    font-weight: 600;
    color: #11243f;
    text-align: center;
    font-family: "Inter", sans-serif;
    margin: 8px 0 0 0;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  &__progress-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
    width: 100%;
  }

  &__progress-bar-bg {
    flex: 1;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 999px;
    overflow: hidden;
  }

  &__progress-bar-fill {
    height: 100%;
    background-color: #c65d3b;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  &__progress-percentage {
    font-size: 28px;
    font-weight: 400;
    color: #fffcf6;
    min-width: 45px;
    text-align: right;

    @media (max-width: 768px) {
      font-size: 18px;
      min-width: 35px;
    }
  }

  &__description-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
    padding: 15px 50px;
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

    &--open .profile-page-container__description-arrow {
      transform: rotate(180deg);
    }
  }

  &__description-arrow {
    transition: transform 0.3s ease;
  }

  &__heart-icon {
    cursor: pointer;
    transition: transform 0.2s ease;
    color: rgba(255, 252, 246, 0.8);
    display: flex;
    align-items: center;

    &--active {
      color: #ff6b6b;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  &__button {
    display: inline-block;
    padding: 13px 50px;
    background-color: #c65d3b;
    color: #fffcf6;
    text-decoration: none;
    border-radius: 999px;
    font-size: 24px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #a84a2d;
      transform: translateY(-2px);
    }
  }

  &__empty-state {
    text-align: center;
    color: #11243f;
    font-family: "Inter", sans-serif;
    margin-top: 40px;
  }
}
</style>