<template>
  <div class="course-container">
    <Header />
    <div class="course">
      <template v-if="course">
        <h1>{{ course.name }}</h1>
        <p>
          <span>Добро пожаловать на курс!</span><br />
          {{ course.description || "Описание курса пока не добавлено." }}
        </p>

        <p v-if="!isAuthenticated" class="auth-note">
          Чтобы открыть уроки и финальный тест, войдите в аккаунт.
        </p>

        <div
          v-if="lessons.length"
          class="course__view"
          :style="{ minHeight: containerHeight + 'px' }"
        >
          <div
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            class="course__view--box"
            :class="{
              'box-alternate': index % 2 !== 0,
              'box-expanded': expandedIndex === index,
            }"
            :style="{
              zIndex: index + 1,
              top: getBoxTop(index) + 'px',
            }"
          >
            <div
              class="circle-photo__course"
              :class="{ 'circle-alternate': index % 2 !== 0 }"
              @click="toggleExpand(index)"
            >
              <img :src="lesson.thumbnail" :alt="lesson.title" />
            </div>
            <div class="course__view--text">
              <div class="course__view--textfirst">
                <h4>[ {{ String(index + 1).padStart(2, "00") }} ]</h4>
                <h3>"{{ lesson.title }}"</h3>
              </div>
              <h4 class="start-link" @click="toggleExpand(index)">
                {{ expandedIndex === index ? "Скрыть" : "Начать" }}
                <span class="play-icon">
                  {{ expandedIndex === index ? "✕" : "▶" }}
                </span>
              </h4>
            </div>

            <div v-if="expandedIndex === index" class="expanded-content">
              <div class="expanded-content__info">
                <p class="expanded-content__title">В этом уроке вы узнаете:</p>
                <p class="lesson-long-description">
                  {{
                    lesson.description || "Описание урока пока не добавлено."
                  }}
                </p>
              </div>

              <div class="expanded-content__video">
                <div class="video-wrapper" v-if="lesson.videoUrl">
                  <video
                    class="video-player"
                    :src="lesson.videoUrl"
                    controls
                    playsinline
                    @play="markLessonStarted(lesson.id)"
                    @ended="markLessonCompleted(lesson.id)"
                  />
                </div>
                <div v-else class="video-missing">
                  Видео для этого урока ещё не загружено.
                </div>
                <div class="video-controls-info">
                  <span>{{ lesson.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="test" class="final-test">
          <h2 class="final-test__title">ФИНАЛЬНЫЙ ТЕСТ</h2>
          <p class="final-test__subtitle">
            Для завершения курса выполните задания ниже
          </p>

          <div class="test-wrapper">
            <div class="test-section__number">
              <div
                class="number-button"
                :class="{ 'number-active': activeTestBlock === 1 }"
                @click="activeTestBlock = 1"
              >
                [ 01 ]
              </div>
              <div
                v-if="test.statements.length"
                class="number-button"
                :class="{ 'number-active': activeTestBlock === 2 }"
                @click="activeTestBlock = 2"
              >
                [ 02 ]
              </div>
              <div
                v-if="test.write_answers.length"
                class="number-button"
                :class="{ 'number-active': activeTestBlock === 3 }"
                @click="activeTestBlock = 3"
              >
                [ 03 ]
              </div>
            </div>

            <div class="test-content">
              <div
                v-if="test.statements.length && activeTestBlock === 1"
                class="test-section"
              >
                <div class="test-section__body">
                  <div class="test-section__inner">
                    <h3 class="test-section__header">
                      Выберите все верные утверждения
                    </h3>
                    <div class="test-section__content">
                      <div
                        v-for="statement in test.statements"
                        :key="statement.id"
                        class="checkbox-option"
                      >
                        <label class="checkbox-label">
                          <input
                            type="checkbox"
                            :value="statement.id"
                            v-model="selectedStatements"
                            class="checkbox-input"
                          />
                          <span class="checkbox-custom"></span>
                          <span class="checkbox-text">{{
                            statement.statement
                          }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="test.write_answers.length && activeTestBlock === 2"
                class="test-section"
              >
                <div class="test-section__body">
                  <div class="test-section__inner">
                    <h3 class="test-section__header">Впишите ответ</h3>
                    <div class="test-section__content">
                      <div
                        v-for="question in test.write_answers"
                        :key="question.id"
                        class="text-question"
                      >
                        <p class="text-question__label">
                          {{ question.question }}
                        </p>
                        <input
                          v-model="writeAnswers[question.id]"
                          type="text"
                          class="text-input"
                          placeholder="Введите ответ"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="puzzleImageUrl && activeTestBlock === 3"
                class="test-section"
              >
                <div class="test-section__body">
                  <div class="test-section__inner">
                    <h3 class="test-section__header">Соберите пазл</h3>
                    <div class="test-section__content">
                      <div class="puzzle-container">
                        <div class="puzzle-grid" :style="gridStyle">
                          <div
                            v-for="(piece, index) in puzzlePieces"
                            :key="index"
                            class="puzzle-piece"
                            draggable="true"
                            @dragstart="dragStart($event, index)"
                            @dragover.prevent
                            @drop="drop(index)"
                            :class="{
                              'piece-placed': piece !== null,
                              'piece-correct': isPuzzleComplete,
                            }"
                          >
                            <div
                              v-if="piece !== null"
                              class="piece-content"
                              :style="getPieceStyle(piece)"
                            ></div>
                            <div v-else class="piece-empty"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="final-test__submit" @click="submitTest">
            Проверить результаты
          </button>

          <p v-if="testResultMessage" class="test-result-message">
            {{ testResultMessage }}
          </p>
          <p
            @click="goToPage('catalog')"
            v-if="testResultMessage"
            class="test-result-message-next"
          >
            Перейти на страницу курсов
          </p>
        </div>
      </template>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import bookIcon from "@/assets/img/book.png";
import { useRouter } from "vue-router";

const router = useRouter();

const goToPage = (page: any) => {
  router.push(`/${page}`);
};
type CourseResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  test?: {
    id: string;
    statements: Array<{ id: string; statement: string }>;
    write_answers: Array<{ id: string; question: string }>;
    puzzles: Array<{ id: string; puzzle_image_key: string }>;
  };
};

type CourseListResponse = {
  success: boolean;
  data: {
    items: Array<{ slug: string }>;
  };
};

type LessonResponse = {
  id: string;
  name: string;
  description?: string | null;
  video_key: string;
  video_duration?: number | null;
  hls_manifest_key?: string | null;
  thumbnail_key?: string | null;
};

type LessonListResponse = {
  success: boolean;
  data: {
    lessons: LessonResponse[];
  };
};

type TestData = {
  id: string;
  statements: Array<{ id: string; statement: string }>;
  write_answers: Array<{ id: string; question: string }>;
  puzzles: Array<{ id: string; puzzle_image_key: string }>;
};

const route = useRoute();
const { apiFetch } = useApi();
const { isAuthenticated } = useAuth();
const { mediaUrl } = useMedia();

const selectedSlug = computed(() => {
  const slug = route.query.slug;
  return typeof slug === "string" && slug.length ? slug : null;
});

const { data } = await useAsyncData(
  () => `course-learn-${selectedSlug.value || "default"}`,
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

    if (!isAuthenticated.value) {
      return {
        course,
        lessons: [],
        test: null,
      };
    }

    const lessonsResponse = await apiFetch<LessonListResponse>(
      `/courses/${courseSlug}/lessons`
    );

    let test: TestData | null = null;

    if ("test" in course && course.test) {
      test = course.test as TestData;
    } else {
      try {
        const testResponse = await apiFetch<{
          success: boolean;
          data: { test: TestData };
        }>(`/courses/${courseSlug}/test`);
        test = testResponse.data.test;
      } catch {
        try {
          const testResponse = await apiFetch<{
            success: boolean;
            data: TestData;
          }>(`/test/${courseSlug}`);
          test = testResponse.data;
        } catch {
          try {
            const testResponse = await apiFetch<{
              success: boolean;
              data: TestData;
            }>(`/courses/${courseSlug}/final-test`);
            test = testResponse.data;
          } catch {
            console.warn("Тест не найден для курса:", courseSlug);
            test = null;
          }
        }
      }
    }

    return {
      course,
      lessons: lessonsResponse.data.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.name,
        description: lesson.description,
        duration: lesson.video_duration
          ? `Продолжительность: ${Math.round(lesson.video_duration / 60)} мин`
          : "Продолжительность не указана",
        videoUrl: mediaUrl(lesson.hls_manifest_key || lesson.video_key),
        thumbnail: mediaUrl(lesson.thumbnail_key) || bookIcon,
      })),
      test,
    };
  }
);

const course = computed(() => data.value?.course || null);
const lessons = computed(() => data.value?.lessons || []);
const test = computed(() => data.value?.test || null);

const expandedIndex = ref<number | null>(null);
const EXPANDED_HEIGHT = 520;

const toggleExpand = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

const getBoxTop = (index: number) => {
  let top = index * 105;
  if (expandedIndex.value !== null && index > expandedIndex.value) {
    top += EXPANDED_HEIGHT;
  }
  return top;
};

const containerHeight = computed(() => {
  const boxHeight = 105;
  let height = lessons.value.length * boxHeight;
  if (expandedIndex.value !== null) {
    height += EXPANDED_HEIGHT;
  }
  return height + 20;
});

const markLessonStarted = async (lessonId: string) => {
  try {
    await apiFetch(`/lessons/${lessonId}/progress`, {
      method: "POST",
      body: { video_started: true },
    });
  } catch {}
};

const markLessonCompleted = async (lessonId: string) => {
  try {
    await apiFetch(`/lessons/${lessonId}/progress`, {
      method: "POST",
      body: { video_completed: true },
    });
  } catch {}
};

const selectedStatements = ref<string[]>([]);
const writeAnswers = ref<Record<string, string>>({});
const testResultMessage = ref("");
const activeTestBlock = ref<number>(1);

const PUZZLE_SIZE = 4;
const PIECE_SIZE = 100;
const puzzleImageUrl = computed(() =>
  mediaUrl(test.value?.puzzles?.[0]?.puzzle_image_key)
);
const puzzlePieces = ref<number[]>([]);
const draggedPieceIndex = ref<number | null>(null);
const isPuzzleComplete = ref(false);

const shufflePuzzle = () => {
  const pieces = Array.from(
    { length: PUZZLE_SIZE * PUZZLE_SIZE },
    (_, index) => index
  );
  for (let i = pieces.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pieces[i]!;
    pieces[i] = pieces[j]!;
    pieces[j] = temp;
  }
  puzzlePieces.value = pieces;
  isPuzzleComplete.value = false;
};

const drop = (targetIndex: number) => {
  if (
    draggedPieceIndex.value === null ||
    draggedPieceIndex.value === targetIndex
  ) {
    return;
  }

  const next = [...puzzlePieces.value];
  const draggedPiece = next[draggedPieceIndex.value]!;
  next[draggedPieceIndex.value] = next[targetIndex]!;
  next[targetIndex] = draggedPiece;

  puzzlePieces.value = next;
  draggedPieceIndex.value = null;
  isPuzzleComplete.value = next.every((piece, index) => piece === index);
};

const getPieceStyle = (originalIndex: number) => {
  const row = Math.floor(originalIndex / PUZZLE_SIZE);
  const col = originalIndex % PUZZLE_SIZE;

  return {
    backgroundImage: `url(${puzzleImageUrl.value})`,
    backgroundPosition: `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`,
    backgroundSize: `${PUZZLE_SIZE * PIECE_SIZE}px ${
      PUZZLE_SIZE * PIECE_SIZE
    }px`,
    width: "100%",
    height: "100%",
  };
};

const dragStart = (event: DragEvent, index: number) => {
  if (isPuzzleComplete.value) {
    event.preventDefault();
    return;
  }
  draggedPieceIndex.value = index;
};

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${PUZZLE_SIZE}, ${PIECE_SIZE}px)`,
  gap: "2px",
  justifyContent: "center",
}));

watch(
  puzzleImageUrl,
  (value) => {
    if (value) {
      shufflePuzzle();
    }
  },
  { immediate: true }
);

const submitTest = async () => {
  if (!course.value || !test.value) {
    return;
  }

  try {
    const response = await apiFetch<{
      success: boolean;
      data: {
        passed: boolean;
        score: number;
        correct_answers: number;
        total_questions: number;
      };
    }>(`/courses/${course.value.slug}/test/submit`, {
      method: "POST",
      body: {
        selected_statements: selectedStatements.value,
        write_answers: writeAnswers.value,
        puzzle_solved: isPuzzleComplete.value,
        passed: false,
      },
    });

    testResultMessage.value = response.data.passed
      ? `Тест пройден. Результат: ${response.data.score}%`
      : `Тест не пройден. Результат: ${response.data.score}%`;
  } catch (error: any) {
    testResultMessage.value =
      error?.data?.detail || "Не удалось отправить тест";
  }
};
</script>

<style lang="scss">
.course-container {
  background-color: #fff;
  font-family: "Inter", sans-serif;
}

.course {
  margin-top: 50px;
  max-width: 1234px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 70px;

  h1 {
    font-size: 80px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 50px;
  }

  > p {
    font-size: 18px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    color: #11243f;
    text-align: left;
    margin: 0;
    margin-bottom: 50px;

    span {
      font-weight: 700;
    }
  }

  &__view {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-bottom: 50px;

    &--box {
      position: absolute;
      width: 100%;
      background-color: #11243f;
      border-radius: 20px;
      padding: 35px 35px;
      transition: top 0.4s ease;
      cursor: pointer;

      &.box-alternate {
        background-color: #c65d3b;
      }

      &.box-expanded {
        border-radius: 20px;
        padding-bottom: 40px;
        z-index: 200 !important;
      }

      &:not(.box-expanded):hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }
    }

    &--text {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: #fffcf6;
      position: relative;
    }

    &--textfirst {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      h4 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        font-family: "BergamascoThin", sans-serif;
      }

      h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        font-family: "Inter", sans-serif;
      }
    }

    .start-link {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    .play-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      font-size: 12px;
    }
  }
}

.auth-note {
  text-align: center;
  font-weight: 600;
}

.circle-photo__course {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 7px solid white;
  overflow: hidden;
  background: #11243f;
  z-index: 2;

  &.circle-alternate {
    background: #c65d3b;
  }

  img {
    width: 40px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }
}

.expanded-content {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #fffcf6;
  animation: slideDown 0.4s ease;

  &__title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 25px;
    font-family: "Inter", sans-serif;
  }

  &__info {
    margin-bottom: 30px;
  }

  &__video {
    width: 100%;
    margin-top: 30px;

    .video-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 12px;
      overflow: hidden;

      .video-player {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .video-controls-info {
      margin-top: 10px;
      font-size: 14px;
      opacity: 0.7;
      text-align: right;
    }
  }
}

.lesson-long-description,
.video-missing {
  font-size: 18px;
  line-height: 1.5;
}

.final-test {
  margin-top: 80px;

  &__title {
    font-size: 48px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0 0 15px 0;
  }

  &__subtitle {
    font-size: 16px;
    font-family: "Inter", sans-serif;
    color: #666;
    text-align: center;
    margin: 0 0 50px 0;
    font-style: italic;
  }

  &__submit {
    display: block;
    margin: 40px auto 0;
    padding: 18px 60px;
    background-color: #c65d3b;
    color: #fffcf6;
    border: none;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(198, 93, 59, 0.3);
    }
  }
}

.test-wrapper {
  display: flex;
  gap: 30px;
  align-items: start;
}

.test-section__number {
  width: 15%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .number-button {
    font-size: 32px;
    font-weight: 700;
    font-family: "BergamascoThin", sans-serif;
    padding: 30px 20px;
    border-radius: 20px;
    background-color: #11243f;
    color: #fffcf6;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }

    &.number-active {
      background-color: #c65d3b;
    }
  }
}

.test-content {
  width: 85%;
}

.test-section {
  border-radius: 20px;
  animation: slideDown 0.3s ease;
  height: 100%;

  &__body {
    background: linear-gradient(90deg, #1f3a5f 0%, #738093 50%, #1f3a5f 100%);
    border-radius: 20px;
    padding: 25px 50px;
  }

  &__inner {
    background-color: #fff;
    border-radius: 16px;
    padding: 35px 40px;
  }

  &__header {
    font-size: 24px;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    color: #11243f;
    margin: 0 0 10px 0;
  }

  &__content {
    animation: slideDown 0.3s ease;
  }
}

.checkbox-option {
  margin-bottom: 15px;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    color: #11243f;
    font-size: 18px;
    font-family: "Inter", sans-serif;
  }

  .checkbox-input {
    display: none;
  }

  .checkbox-custom {
    width: 24px;
    height: 24px;
    border: 2px solid #11243f;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &::after {
      content: "";
      width: 12px;
      height: 12px;
      background-color: #11243f;
      border-radius: 3px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }

  .checkbox-input:checked + .checkbox-custom::after {
    opacity: 1;
  }

  .checkbox-text {
    line-height: 1.4;
  }
}

.text-question {
  margin-bottom: 25px;

  &__label {
    font-size: 18px;
    font-weight: 500;
    color: #11243f;
    margin: 0 0 5px 0;
    font-family: "Inter", sans-serif;
  }

  .text-input {
    width: 100%;
    padding: 15px 20px;
    background: #fff;
    border: 2px solid #d0d5dd;
    border-radius: 12px;
    color: #11243f;
    font-size: 16px;
    font-family: "Inter", sans-serif;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &::placeholder {
      color: #98a2b3;
    }

    &:focus {
      outline: none;
      border-color: #c65d3b;
      background: #fff;
    }
  }
}

.puzzle-container {
  text-align: center;
  padding: 20px 0;
}

.puzzle-grid {
  display: inline-grid;
  padding: 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.puzzle-piece {
  width: 100px;
  height: 100px;
  background-color: white;
  cursor: grab;
  transition: all 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
}

.piece-content {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  pointer-events: none;
}

.piece-empty {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}

.piece-correct {
  opacity: 0.9;
}

.test-result-message {
  text-align: center;
  font-size: 18px;
  color: #11243f;
  margin-top: 20px;
}

.test-result-message-next {
  text-align: center;
  font-size: 18px;
  color: #11243f;
  margin-top: 20px;
  transition: all 0.2s ease;
  text-decoration: underline;
  &:hover {
    transform: scale(1.05);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
