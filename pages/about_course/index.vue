<template>
  <div class="about__course--container">
    <Header />
    <div v-if="course" class="about__course">
      <div class="about__course--view">
        <img :src="courseImage" :alt="course.name" class="course-image" />
        <div class="course-content">
          <h1>{{ course.name }}</h1>
          <p class="course-description">
            {{ course.description || "Описание курса пока не добавлено." }}
          </p>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-circle" data-progress="60">
                <span class="stat-number">{{ paddedLessonsCount }}</span>
              </div>
              <p class="stat-label">уроков</p>
            </div>
            <div class="stat-item">
              <div class="stat-circle" data-progress="15">
                <span class="stat-number">{{ paddedTeachersCount }}</span>
              </div>
              <p class="stat-label">тренера</p>
            </div>
            <div class="stat-item">
              <div class="stat-circle" data-progress="40">
                <span class="stat-number">{{ paddedHours }}</span>
              </div>
              <p class="stat-label">часа <br />занятий</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="courses-title" v-if="course.teachers.length">
        ПРЕПОДАВАТЕЛИ:
      </h2>

      <div class="teachers-grid" v-if="course.teachers.length">
        <div
          v-for="teacher in course.teachers"
          :key="teacher.id"
          class="teacher-card"
        >
          <img
            :src="teacher.image"
            :alt="teacher.name"
            class="teacher-avatar"
          />
          <h3 class="teacher-name">преподаватель</h3>
          <p class="teacher-description">{{ teacher.name }}</p>
          <div class="teacher-socials" v-if="teacher.contactLink">
            <a :href="teacher.contactLink" class="social-icon" target="_blank">
              <img :src="phoneIcon" alt="contact" />
            </a>
          </div>
        </div>
      </div>

      <h2 class="courses-title" v-if="course.teachers.length">
        УРОКИ:
      </h2>

      <div
        v-if="
          isAuthenticated &&
          isEnrolled &&
          lessonColumns.some((column) => column.length)
        "
        class="lessons-section"
      >
        <div
          class="lessons-column"
          v-for="(column, colIndex) in lessonColumns"
          :key="colIndex"
        >
          <div v-for="lesson in column" :key="lesson.id" class="lesson-card">
            <div class="lesson-left">
              <div class="blue-rectangle">
                <div class="lesson-number">[ {{ lesson.number }} ]</div>
              </div>
              <div class="circle-photo">
                <img :src="lesson.image" :alt="lesson.title" />
              </div>
            </div>
            <div class="lesson-right">
              <h4 class="lesson-title">{{ lesson.title }}</h4>
              <p class="lesson-description">{{ lesson.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <p v-else-if="!isAuthenticated" class="lessons-lock-note">
        Пожалуйста, авторизуйтесь для просмотра уроков.
      </p>

      <p v-else-if="isAuthenticated && !isEnrolled" class="lessons-lock-note">
        Вы не записаны на этот курс. Запишитесь, чтобы получить доступ к урокам.
      </p>

      <p
        v-else-if="
          isAuthenticated &&
          isEnrolled &&
          !lessonColumns.some((column) => column.length)
        "
        class="lessons-lock-note"
      >
        Уроки для этого курса пока не добавлены.
      </p>

      <NuxtLink
        class="about__course--button"
        :to="{ path: '/course', query: { slug: course.slug } }"
      >
        <h4>Пройти курс</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="26"
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
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import fallbackCourseImage from "@/assets/img/imgtest.png";
import bookIcon from "@/assets/img/book.png";
import phoneIcon from "@/assets/img/phone.png";

type CourseResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  hours?: number | null;
  main_image_key?: string | null;
  lessons_count: number;
  teachers: Array<{
    id: string;
    name: string;
    image_key?: string | null;
    contact_link?: string | null;
  }>;
};

type CourseListResponse = {
  success: boolean;
  data: {
    items: Array<{ slug: string }>;
  };
};

type LessonListResponse = {
  success: boolean;
  data: {
    lessons: Array<{
      id: string;
      name: string;
      description?: string | null;
      thumbnail_key?: string | null;
    }>;
  };
};

type EnrollmentResponse = {
  success: boolean;
  data: {
    id: string;
    course_id: string;
    user_id: string;
    status: string;
    enrolled_at: string;
  };
};

const route = useRoute();
const { apiFetch } = useApi();
const { mediaUrl } = useMedia();
const { isAuthenticated, fetchMe } = useAuth();

const isEnrolled = ref(false);

const selectedSlug = computed(() => {
  const slug = route.query.slug;
  return typeof slug === "string" && slug.length ? slug : null;
});

onMounted(async () => {
  await fetchMe();
});

const { data } = await useAsyncData(
  () => `course-preview-${selectedSlug.value || "default"}`,
  async () => {
    let courseSlug = selectedSlug.value;

    if (!courseSlug) {
      const listResponse = await apiFetch<CourseListResponse>("/courses");
      courseSlug = listResponse.data.items[0]?.slug || null;
      if (!courseSlug) {
        return null;
      }
    }

    const course = await apiFetch<CourseResponse>(`/courses/${courseSlug}`);

    let lessons: LessonListResponse["data"]["lessons"] = [];
    let enrolled = false;

    if (isAuthenticated.value) {
      try {
        const lessonResponse = await apiFetch<LessonListResponse>(
          `/courses/${courseSlug}/lessons`
        );
        lessons = lessonResponse.data.lessons;
        enrolled = true;
      } catch (error: any) {
        lessons = [];
        enrolled = false;

        try {
          const enrollmentStatus = await apiFetch<EnrollmentResponse>(
            `/courses/${courseSlug}/enrollment-status`
          );
          enrolled =
            enrollmentStatus.success &&
            enrollmentStatus.data.status === "active";
        } catch {
          enrolled = false;
        }
      }
    } else {
      lessons = [];
      enrolled = false;
    }

    return {
      ...course,
      isEnrolled: enrolled,
      teachers: course.teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        image: mediaUrl(teacher.image_key) || fallbackCourseImage,
        contactLink: teacher.contact_link,
      })),
      lessons: lessons.map((lesson, index) => ({
        id: lesson.id,
        number: String(index + 1).padStart(2, "0"),
        title: lesson.name,
        description: lesson.description || "Описание урока пока не добавлено.",
        image: bookIcon,
      })),
    };
  }
);

const course = computed(() => data.value);
const courseImage = computed(
  () => mediaUrl(course.value?.main_image_key) || fallbackCourseImage
);

watch(
  course,
  (newCourse) => {
    if (newCourse) {
      isEnrolled.value = newCourse.isEnrolled || false;
    }
  },
  { immediate: true }
);

const paddedLessonsCount = computed(() =>
  String(course.value?.lessons_count || 0).padStart(2, "0")
);
const paddedTeachersCount = computed(() =>
  String(course.value?.teachers.length || 0).padStart(2, "0")
);
const paddedHours = computed(() => {
  const hours = Math.round(course.value?.hours || 0);
  return String(hours).padStart(2, "0");
});

const lessonColumns = computed(() => {
  const allLessons = course.value?.lessons || [];
  const midPoint = Math.ceil(allLessons.length / 2);
  return [allLessons.slice(0, midPoint), allLessons.slice(midPoint)];
});
</script>

<style lang="scss">
.about__course--container {
  background-color: #fff;
}

.about__course {
  margin-top: 50px;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 100px;
  display: flex;
  flex-direction: column;

  &--view {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &--button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: "Inter", sans-serif;
    padding: 23px 37px;
    background-color: #c65d3b;
    color: #fffcf6;
    text-decoration: none;
    border-radius: 999px;
    
    font-size: 40px;
    transition: all 0.3s ease;
    margin: 12px auto 0;

    > h4 {
      margin: 0;
      font-weight: 100;
    }

    &:hover {
      background-color: #a84a2d;
      transform: translateY(-2px);
    }
    svg{
      rotate: -45deg;
    }
  }
}

.course-image {
  width: 35%;
  height: 600px;
  object-fit: cover;
  border-radius: 20px;
  @media (max-width: 768px) {
    width: 80%;
    max-width: 300px;
  }
}

.course-content {
  flex: 1;

  h1 {
    text-transform: uppercase;
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: left;
    margin: 0;
  }
}

.course-description {
  margin: 33px 0 0 0;
  font-size: 35px;
  font-weight: 300;
  color: #11243f;
  font-family: "Inter", sans-serif;
  line-height: 1.5;
}

.stats-row {
  margin-top: 33px;
  display: flex;
  flex-direction: row;
  gap: 48px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-circle {
  position: relative;
  width: 165px;
  height: 165px;
  margin: 0 auto 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 5px solid #e0e0e0;
    box-sizing: border-box;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 1px solid #11243f;
    box-sizing: border-box;
    z-index: 2;
    clip-path: inset(0 0 0 0);
  }

  &[data-progress="60"]::after {
    background: conic-gradient(#11243f 0deg 216deg, transparent 216deg 360deg);
    border: none;
  }

  &[data-progress="15"]::after {
    background: conic-gradient(#11243f 0deg 54deg, transparent 54deg 360deg);
    border: none;
  }

  &[data-progress="40"]::after {
    background: conic-gradient(#11243f 0deg 144deg, transparent 144deg 360deg);
    border: none;
  }

  .stat-number {
    font-size: 72px;
    font-weight: 700;
    color: #11243f;
    font-family: "Inter", sans-serif;
    position: relative;
    z-index: 3;
    background: #fff;
    width: 154px;
    height: 154px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
}

.stat-label {
  font-size: 35px;
  font-weight: 300;
  color: #11243f;
  font-family: "Inter", sans-serif;
  margin: 0;
  line-height: 1.3;
}

.courses-title {
  font-size: 100px;
  font-family: "BergamascoThin", sans-serif;
  font-weight: 800;
  color: #11243f;
  text-align: left;
  margin: 80px 0 40px;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 40px 0 60px;
  max-width: 400px;
  
  @media (max-width: 480px) {
    max-width: 100%;
    gap: 15px;
  }
}

.teacher-card {
  background: #ffffff;
  border-radius: 40px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 185px;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    min-height: 170px;
  }
}

.teacher-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 10px;
  display: block;
}

.teacher-name {
  font-size: 13px;
  font-weight: 400;
  color: #11243f;
  font-family: "Inter", sans-serif;
  margin: 0 0 5px;
  text-transform: lowercase;
  
  &::first-letter {
    text-transform: uppercase;
  }
}

.teacher-description {
  font-size: 16px;
  font-weight: 700;
  color: #11243f;
  font-family: "Inter", sans-serif;
  line-height: 1.3;
  margin: 0 0 10px;
  padding: 0;
}

.teacher-socials {
  display: flex;
  justify-content: center;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: all 0.3s ease;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  &:hover {
    background: #11243f;
    transform: scale(1.1);

    img {
      filter: brightness(0) invert(1);
    }
  }
}

.lessons-section {
  display: flex;
  gap: 40px;
  margin: 60px 0 80px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
}

.lessons-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.lesson-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  border-radius: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
}

.lesson-left {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  height: 200px;
}

.blue-rectangle {
  width: 100%;
  height: 100%;
  background-color: #11243f;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.lesson-number {
  font-size: 72px;
  font-weight: 800;
  color: white;
  font-family: "BergamascoThin", sans-serif;
}

.circle-photo {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 7px solid white;
  overflow: hidden;
  background: #11243f;
  z-index: 2;
  position: relative;

  img {
    width: 60px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }
}

.lesson-right {
  flex: 1;

  .lesson-title {
    font-size: 45px;
    font-weight: 700;
    color: #11243f;
    font-family: "Inter", sans-serif;
    margin: 0 0 8px;
  }

  .lesson-description {
    font-size: 28px;
    font-weight: 400;
    color: #666;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    margin: 0;
  }
}

.lessons-lock-note {
  font-family: "Inter", sans-serif;
  font-size: 30px;
  color: #11243f;
  margin: 40px 0;
  text-align: center;
}

@media (max-width: 480px) {
  .stats-row {
    gap: 15px;
    justify-content: center;
  }

  .stat-circle {
    width: 80px;
    height: 80px;
    &::after {
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
    }
    .stat-number {
      width: 78px;
      height: 78px;
      font-size: 26px;
    }
  }

  .stat-label {
    font-size: 14px;
  }

  .course-description {
    font-size: 16px;
  }

  .course-content h1 {
    font-size: 100px;
  }

  .courses-title {
    font-size: 32px;
    margin: 50px 0 25px;
  }

  .teachers-grid {
    gap: 15px;
    max-width: 100%;
  }

  .teacher-card {
    width: 100%;
    height: auto;
    min-height: 170px;
    padding: 15px;
  }

  .teacher-avatar {
    width: 60px;
    height: 60px;
  }

  .teacher-name {
    font-size: 11px;
  }
  
  .teacher-description {
    font-size: 14px;
  }

  .lesson-left {
    width: 120px;
    height: 120px;
  }

  .circle-photo {
    width: 85px;
    height: 85px;
  }

  .lesson-number {
    font-size: 26px;
  }

  .lesson-right .lesson-title {
    font-size: 18px;
  }
}


@media (max-width: 480px) {
  .about__course{
    margin-top: 24px;
    padding: 0 20px;
    &--view{
      gap: 16px;
      .course-image{
        width: 100%;
        max-width: 1980px;
        max-height: 419px;
      }
      .course-content{
        h1{
          font-size: 50px;
        }
        .course-description{
          margin-top: 10px;
        }
        .stats-row{
          margin-top: 10px;
          .stat-item{

          }
        }
      }
    }
    .courses-title{
      margin: 25px 0px;
    }
    .teachers-grid{
      margin-top: 0px;
      margin-bottom: 0;
      gap: 15px;
      grid-template-columns: repeat(2, 1fr);
      
      .teacher-card{
        width: 100%;
        height: auto;
        height: 190px;
        padding: 15px;
        border-radius: 20px;
        .teacher-avatar{
          width: 60px;
          height: 60px;
          margin: 0 auto 5px auto;
        }
        .teacher-name{
          margin-bottom: 5px;
          font-size: 11px;
        }
        .teacher-description{
          font-size: 14px;
          margin-bottom: 8px;
        }
        .teacher-socials{
          .social-icon{
            width: 18px;
            height: 18px;
            img{
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
    &--button{
      padding: 10px 20px;
      h4{
        font-size: 18px;
      }
      svg{
        width: 20px;
      }
    }
  }
  .lessons-section{
    margin-top: 15px;
    margin-bottom: 0;
    gap: 0;
    .lessons-column{
      gap: 0px;

      .lesson-card{
        margin-bottom: 40px;
        flex-direction: row;
        .lesson-left{
          width: 138px;
          height: 100px;
          .lesson-number{
            font-size: 38px;
            margin-top: 10px;
          }
          .circle-photo{
            width: 50px;
            height: 50px;
            border: 4px solid white;
            img{
              width: 30px;
              height: 25px;
            }
          }
        }
        .lesson-right{
          h4{
            font-size: 22px;
            margin: 0;
            text-align: left;
          }
          .lesson-description{
            font-size: 14px;
            text-align: left;
          }
        }
      }
    }
  }
}

</style>
