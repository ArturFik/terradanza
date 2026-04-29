<template>
  <div class="account-container">
    <Header />
    <div v-if="currentUser" class="account">
      <h1>ПРОФИЛЬ</h1>
      <div class="account__logo">
        <img :src="avatarUrl" alt="logo" class="logo" />
        <div class="logo__view">
          <p class="logo__view--1">{{ fullName }}</p>
          <p class="logo__view--2">{{ rankLabel }}</p>
          <p class="logo__view--3" @click="handleLogout">Выйти</p>
        </div>
      </div>

      <div class="account-tab">
        <img
          v-for="(tab, index) in tabs"
          :key="index"
          :src="tab.img"
          :alt="`tab-${index}`"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        />
      </div>

      <div v-if="activeTab === 0" class="achievements-container">
        <div v-if="achievementRows.length">
          <div
            class="check-tab"
            v-for="(row, rowIndex) in achievementRows"
            :key="rowIndex"
          >
            <div
              v-for="achievement in row"
              :key="achievement.id"
              class="achievement-item"
            >
              <div class="achievement-image-wrapper">
                <img
                  :src="achievement.icon"
                  :alt="achievement.name"
                  class="achievement-icon"
                />
                <div class="achievement-overlay">
                  <p class="achievement-description">{{ achievement.description }}</p>
                </div>
              </div>
              <p class="achievement-name">{{ achievement.name }}</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">Пока нет полученных достижений.</p>
      </div>

      <div v-if="activeTab === 1" class="progress-container">
        <div class="account__grid progress-grid">
          <div
            v-for="course in enrolledCourses"
            :key="course.id"
            class="account__view progress-card"
          >
            <div
              class="account__view--view"
              :style="{ backgroundImage: `url(${course.backgroundImage})` }"
            >
              <div class="account__view--overlay"></div>
              <div class="account__view--content">
                <h2>{{ course.title }}</h2>
                <h3>{{ course.region }}</h3>
                <div class="progress-bar-container">
                  <div class="progress-bar-bg">
                    <div
                      class="progress-bar-fill"
                      :style="{ width: course.progress + '%' }"
                    ></div>
                  </div>
                  <span class="progress-percentage">{{ course.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!enrolledCourses.length" class="empty-state">Вы пока не записаны ни на один курс.</p>
      </div>

      <div v-if="activeTab === 2" class="favorites-container">
        <div class="account__grid favorites-grid">
          <div
            v-for="course in favoriteCourses"
            :key="course.id"
            class="account__view"
          >
            <div
              class="account__view--view"
              :style="{ backgroundImage: `url(${course.backgroundImage})` }"
            >
              <div class="account__view--overlay"></div>
              <div class="account__view--content">
                <h2>{{ course.title }}</h2>
                <h3>{{ course.region }}</h3>
                <div class="account__view--actions">
                  <div
                    class="description-toggle"
                    :class="{ 'description-toggle--open': expandedCourseIds.has(course.id) }"
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
                  <div class="heart-icon active" @click="toggleFavorite(course.id)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                <div
                  class="account__view--description"
                  :class="{
                    'account__view--description--expanded': expandedCourseIds.has(course.id),
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
        <p v-if="!favoriteCourses.length" class="empty-state">Избранных курсов пока нет.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue"
import Footer from "@/component/footer/footer.vue"
import frameImg from "@/assets/img/Frame.png"
import frame2Img from "@/assets/img/Frame2.png"
import frame3Img from "@/assets/img/Frame3.png"
import defaultAvatar from "@/assets/img/logo.png"


import notShyLocked from "/assets/img/not_shy_locked.png"
import totalTheoristLocked from "/assets/img/total_theorist_locked.png"
import firstPancakeLocked from "/assets/img/first_pancake_locked.png"
import soulOfCompanyLocked from "/assets/img/soul_of_company_locked.png"
import antiSpoilerLocked from "/assets/img/anti_spoiler_locked.png"
import absoluteDancerLocked from "/assets/img/absolute_dancer_locked.png"
import noSkipsLocked from "/assets/img/no_skips_locked.png"
import likeMasterLocked from "/assets/img/like_master_locked.png"

const ALL_ACHIEVEMENTS = {
  not_shy: {
    code: "not_shy",
    name: "Не постеснялся",
    description: "Пересдал тест после первой неудачи и сдал его на 100% со второй попытки",
    icon_key: "achievements/default/not_shy.png",
    default_icon: notShyLocked
  },
  total_theorist: {
    code: "total_theorist",
    name: "Тотальный теоретик",
    description: "Набрал 100% в тесте с первой попытки",
    icon_key: "achievements/default/total_theorist.png",
    default_icon: totalTheoristLocked
  },
  first_pancake: {
    code: "first_pancake",
    name: "Первый блин не комом",
    description: "Досмотрел первый видео-урок первого курса до конца",
    icon_key: "achievements/default/first_pancake.png",
    default_icon: firstPancakeLocked
  },
  soul_of_company: {
    code: "soul_of_company",
    name: "Душа компании",
    description: "Просмотрел все уроки курса за 24 часа после начала первого урока",
    icon_key: "achievements/default/soul_of_company.png",
    default_icon: soulOfCompanyLocked
  },
  anti_spoiler: {
    code: "anti_spoiler",
    name: "Анти-спойлер",
    description: "Сдал тест до того, как посмотрел последний урок (минимум 80%)",
    icon_key: "achievements/default/anti_spoiler.png",
    default_icon: antiSpoilerLocked
  },
  absolute_dancer: {
    code: "absolute_dancer",
    name: "Абсолютный танцор",
    description: "Прошел 3 курса полностью и сдал финальный тест на >79%",
    icon_key: "achievements/default/absolute_dancer.png",
    default_icon: absoluteDancerLocked
  },
  no_skips: {
    code: "no_skips",
    name: "Ни одного пропуска",
    description: "Заканчивал по одному уроку каждый день подряд до завершения курса",
    icon_key: "achievements/default/no_skips.png",
    default_icon: noSkipsLocked
  },
  like_master: {
    code: "like_master",
    name: "Лайк-мастер",
    description: "Добавил в избранное хотя бы 3 курса",
    icon_key: "achievements/default/like_master.png",
    default_icon: likeMasterLocked
  },
}

type UserCoursesResponse = {
  success: boolean
  data: {
    courses: string[]
  }
}

type AchievementResponse = {
  success: boolean
  data: {
    achievements: Array<{
      id: string
      achievement_id: string
      code: string
      name: string
      description: string
      icon_key?: string | null
      earned_at: string
      progress_metadata: Record<string, any>
    }>
  }
}

type CourseListResponse = {
  success: boolean
  data: {
    items: Array<{
      id: string
      slug: string
      name: string
      description?: string | null
      region_name?: string | null
      main_image_key?: string | null
    }>
  }
}

const { currentUser, fetchMe, isAuthenticated, logout } = useAuth()
const { apiFetch } = useApi()
const { mediaUrl } = useMedia()

if (!isAuthenticated.value) {
  await navigateTo({ path: "/auth", query: { redirect: "/profile" } })
}

if (!currentUser.value) {
  await fetchMe()
}

const activeTab = ref(0)
const tabs = ref([{ img: frameImg }, { img: frame2Img }, { img: frame3Img }])
const expandedCourseIds = ref(new Set<string>())

const { data } = await useAsyncData("profile-data", async () => {
  const [allCourses, favorites, enrolled, achievements] = await Promise.all([
    apiFetch<CourseListResponse>("/courses"),
    apiFetch<UserCoursesResponse>("/users/me/favorites"),
    apiFetch<UserCoursesResponse>("/users/me/courses"),
    apiFetch<AchievementResponse>("/users/me/achievements"),
  ])

  const courseMap = new Map(
    allCourses.data.items.map((course) => [
      course.slug,
      {
        id: course.id,
        slug: course.slug,
        title: course.name,
        region: course.region_name || "Регион не указан",
        description: course.description || "Описание курса пока не добавлено.",
        backgroundImage: mediaUrl(course.main_image_key) || defaultAvatar,
      },
    ]),
  )

  const earnedAchievementCodes = new Set(
    achievements.data.achievements.map(a => a.code)
  )

  const allAchievementsList = Object.values(ALL_ACHIEVEMENTS).map(achievement => {
    const earnedAchievement = achievements.data.achievements.find(
      a => a.code === achievement.code
    )
    
    if (earnedAchievement) {
      return {
        id: earnedAchievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: mediaUrl(earnedAchievement.icon_key) || mediaUrl(achievement.icon_key) || achievement.default_icon,
        earned: true,
        earned_at: earnedAchievement.earned_at,
        code: achievement.code
      }
    } else {
      // Если достижение не получено - показываем заблокированную версию
      return {
        id: `locked_${achievement.code}`,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.default_icon,
        earned: false,
        code: achievement.code
      }
    }
  })

  return {
    achievements: allAchievementsList,
    favoriteCourses: favorites.data.courses
      .map((slug) => courseMap.get(slug))
      .filter(Boolean),
    enrolledCourses: enrolled.data.courses
      .map((slug) => courseMap.get(slug))
      .filter(Boolean)
      .map((course) => ({
        ...course!,
        progress: 0,
      })),
  }
})

const achievements = computed(() => data.value?.achievements || [])
const favoriteCourses = computed(() => data.value?.favoriteCourses || [])
const enrolledCourses = computed(() => data.value?.enrolledCourses || [])

// Делим достижения на строки по 4 элемента
const achievementRows = computed(() => {
  const rows = []
  for (let index = 0; index < achievements.value.length; index += 4) {
    rows.push(achievements.value.slice(index, index + 4))
  }
  return rows
})

const avatarUrl = computed(() => mediaUrl(currentUser.value?.avatar_key) || defaultAvatar)
const fullName = computed(() => {
  const parts = [currentUser.value?.surname, currentUser.value?.name].filter(Boolean)
  return parts.join(" ") || currentUser.value?.email || "Пользователь"
})
const rankLabel = computed(() => {
  const rankMap: Record<string, string> = {
    novice: "Новичок",
    amateur: "Любитель",
    pro: "Профи",
  }
  return rankMap[currentUser.value?.cached_rank || "novice"] || "Новичок"
})

const toggleDescription = (courseId: string) => {
  const next = new Set(expandedCourseIds.value)
  if (next.has(courseId)) {
    next.delete(courseId)
  } else {
    next.add(courseId)
  }
  expandedCourseIds.value = next
}

const toggleFavorite = async (courseId: string) => {
  try {
    await apiFetch(`/users/me/favorites/${courseId}`, { method: "DELETE" })
    const next = favoriteCourses.value.filter((course) => course.id !== courseId)
    data.value = {
      achievements: achievements.value,
      enrolledCourses: enrolledCourses.value,
      favoriteCourses: next,
    }
  } catch (error) {
    console.error("Failed to remove favorite", error)
  }
}

const handleLogout = async () => {
  await logout()
  await navigateTo("/auth")
}
</script>

<style lang="scss" scoped>
.account-container {
  background-color: #fff;
}

.account {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
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

  &__logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 50%;
    margin-right: auto;
    gap: 20px;
  }

  .logo {
    width: 125px;
    height: 125px;
    border-radius: 9999px;
    object-fit: cover;

    &__view {
      display: flex;
      flex-direction: column;
      align-items: left;
      margin-right: auto;
      justify-content: space-between;

      &--1 {
        font-size: 18px;
        font-weight: 600;
        color: #11243f;
        text-align: left;
        font-family: "Inter", sans-serif;
        margin: 20px 0 0 0;
      }

      &--2 {
        font-size: 18px;
        font-weight: 400;
        color: #11243f;
        text-align: left;
        font-family: "Inter", sans-serif;
        margin: 5px 0;
      }

      &--3 {
        font-size: 16px;
        font-weight: 400;
        text-decoration: underline;
        color: #c65d3b;
        text-align: left;
        font-family: "Inter", sans-serif;
        margin: 10px 0;
        cursor: pointer;
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

.account-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;

  > img {
    width: 20%;
    cursor: pointer;
    transition: all 0.3s ease;
    padding-bottom: 10px;

    &.active {
      border-bottom: 3px solid #c65d3b;
    }

    &:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
  }
}

.check-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;

  > .achievement-item {
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  
    &--locked {
      opacity: 0.5;
      filter: grayscale(0.5);
    }
}

}

.achievement-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff; 

  &:hover .achievement-icon {
    filter: blur(4px);
  }

  &:hover .achievement-overlay {
    opacity: 1;
  }
}

.achievement-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: filter 0.3s ease;
  display: block;
}

.achievement-overlay {
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

.achievement-description {
  font-size: 12px;
  text-align: center;
  color: #11243f;
  font-family: "Inter", sans-serif;
  padding: 12px;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

.achievement-name {
  font-size: 14px;
  font-weight: 600;
  color: #11243f;
  text-align: center;
  font-family: "Inter", sans-serif;
  margin: 8px 0 0 0;
}

.achievement-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #c65d3b;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  width: 100%;
}

.progress-bar-bg {
  flex: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #c65d3b;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #fffcf6;
  min-width: 45px;
  text-align: right;
}

.progress-grid,
.favorites-grid {
  margin-top: 20px;
}

.account__view {
  &--view {
    font-family: "Inter", sans-serif;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 170px;
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
      max-height: 200px;
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

  &.active {
    color: #ff6b6b;
  }

  &:hover {
    transform: scale(1.1);
  }
}

.button {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #c65d3b;
  color: #fffcf6;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #a84a2d;
    transform: translateY(-2px);
  }
}

.empty-state {
  text-align: center;
  color: #11243f;
  font-family: "Inter", sans-serif;
  margin-top: 40px;
}
</style>