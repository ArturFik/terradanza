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

        <div v-if="test" class="final-test" :style="{ marginTop: testMarginTop + 'px' }">
          <h2 class="final-test__title">ФИНАЛЬНЫЙ ТЕСТ</h2>
          <p class="final-test__subtitle">
            *Для получения сертификата о прохождении курса выполните все задания
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
                            @touchstart="touchStart($event, index)"
                            @touchmove="touchMove($event, index)"
                            @touchend="touchEnd($event)"
                            :class="{
                              'piece-placed': piece !== null,
                              'piece-correct': isPuzzleComplete,
                              'piece-dragging': touchDragIndex === index,
                            }"
                            :data-index="index"
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

<script setup>
import Header from "@/component/header/header.vue";
import Footer from "@/component/footer/footer.vue";
import bookIcon from "@/assets/img/book.png";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const goToPage = (page) => {
  router.push(`/${page}`);
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
      const listResponse = await apiFetch("/courses");
      courseSlug = listResponse.data.items[0]?.slug || null;
      if (!courseSlug) {
        return null;
      }
    }

    const course = await apiFetch(`/courses/${courseSlug}`);

    if (!isAuthenticated.value) {
      return {
        course,
        lessons: [],
        test: null,
      };
    }

    const lessonsResponse = await apiFetch(`/courses/${courseSlug}/lessons`);

    let test = null;

    if ("test" in course && course.test) {
      test = course.test;
    } else {
      try {
        const testResponse = await apiFetch(`/courses/${courseSlug}/test`);
        test = testResponse.data.test;
      } catch {
        try {
          const testResponse = await apiFetch(`/test/${courseSlug}`);
          test = testResponse.data;
        } catch {
          try {
            const testResponse = await apiFetch(`/courses/${courseSlug}/final-test`);
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
        thumbnail: bookIcon,
      })),
      test,
    };
  }
);

const course = computed(() => data.value?.course || null);
const lessons = computed(() => data.value?.lessons || []);
const test = computed(() => data.value?.test || null);

const expandedIndex = ref(null);

const getCollapsedHeight = () => {
  return isMobile.value ? 68 : 205;
};

const getExpandedHeight = (index) => {
  if (isMobile.value) {
    const mobileHeights = [180, 220, 250, 290, 330, 370, 400, 440, 460, 500];
    if (index < mobileHeights.length) {
      return mobileHeights[index];
    }
    return mobileHeights[mobileHeights.length - 1] + (index - mobileHeights.length + 1) * 60;
  }
  
  const heights = [370, 470, 570, 670, 770, 870, 970, 1070, 1170, 1270];
  if (index < heights.length) {
    return heights[index];
  }
  return heights[heights.length - 1] + (index - heights.length + 1) * 90;
};

const currentExpandedHeight = computed(() => {
  if (expandedIndex.value === null) return 0;
  return getExpandedHeight(expandedIndex.value);
});

const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

const getBoxTop = (index) => {
  const collapsedHeight = getCollapsedHeight();
  let top = index * collapsedHeight;
  if (expandedIndex.value !== null && index > expandedIndex.value) {
    top += currentExpandedHeight.value;
  }
  return top;
};

const containerHeight = computed(() => {
  const collapsedHeight = getCollapsedHeight();
  let height = lessons.value.length * collapsedHeight;
  if (expandedIndex.value !== null) {
    height += currentExpandedHeight.value;
  }
  return height + 20;
});

const testMarginTop = computed(() => {
  if (expandedIndex.value === null) {
    return 0;
  }
  
  const lastLessonIndex = lessons.value.length - 1;
  const lastLessonTop = getBoxTop(lastLessonIndex);
  const baseLastLessonTop = lastLessonIndex * getCollapsedHeight();

  let shift = lastLessonTop - baseLastLessonTop;
  
  if (expandedIndex.value === lastLessonIndex) {
    shift = currentExpandedHeight.value;
  }
  
  return shift;
});

const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1800;
  };
  
  checkMobile();
  
  window.addEventListener('resize', () => {
    const wasMobile = isMobile.value;
    checkMobile();
    
    if (wasMobile !== isMobile.value) {
      const current = expandedIndex.value;
      expandedIndex.value = null;
      setTimeout(() => {
        expandedIndex.value = current;
      }, 0);
    }
  });
});

const markLessonStarted = async (lessonId) => {
  try {
    await apiFetch(`/lessons/${lessonId}/progress`, {
      method: "POST",
      body: { video_started: true },
    });
  } catch {}
};

const markLessonCompleted = async (lessonId) => {
  try {
    await apiFetch(`/lessons/${lessonId}/progress`, {
      method: "POST",
      body: { video_completed: true },
    });
  } catch {}
};

const selectedStatements = ref([]);
const writeAnswers = ref({});
const testResultMessage = ref("");
const activeTestBlock = ref(1);

const PUZZLE_SIZE = 4;
const PIECE_SIZE = computed(() => isMobile.value ? 65 : 100);
const puzzleImageUrl = computed(() =>
  mediaUrl(test.value?.puzzles?.[0]?.puzzle_image_key)
);
const puzzlePieces = ref([]);
const draggedPieceIndex = ref(null);
const isPuzzleComplete = ref(false);

const touchDragIndex = ref(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchStartElement = ref(null);
const touchGhostElement = ref(null);

const shufflePuzzle = () => {
  const pieces = Array.from(
    { length: PUZZLE_SIZE * PUZZLE_SIZE },
    (_, index) => index
  );
  for (let i = pieces.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pieces[i];
    pieces[i] = pieces[j];
    pieces[j] = temp;
  }
  puzzlePieces.value = pieces;
  isPuzzleComplete.value = false;
};

const touchStart = (event, index) => {
  if (isPuzzleComplete.value) return;
  const touch = event.touches[0];
  touchDragIndex.value = index;
  touchStartX.value = touch.clientX;
  touchStartY.value = touch.clientY;
  touchStartElement.value = event.currentTarget;
  
  const rect = event.currentTarget.getBoundingClientRect();
  const ghost = event.currentTarget.cloneNode(true);
  ghost.style.position = 'fixed';
  ghost.style.width = rect.width + 'px';
  ghost.style.height = rect.height + 'px';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '1000';
  ghost.style.opacity = '0.8';
  ghost.style.transform = 'scale(1.05)';
  ghost.style.transition = 'transform 0.2s ease';
  ghost.style.left = (touch.clientX - rect.width / 2) + 'px';
  ghost.style.top = (touch.clientY - rect.height / 2) + 'px';
  document.body.appendChild(ghost);
  touchGhostElement.value = ghost;
  
  event.currentTarget.style.opacity = '0.5';
};

const touchMove = (event, index) => {
  if (touchDragIndex.value === null || isPuzzleComplete.value) return;
  event.preventDefault();
  
  const touch = event.touches[0];
  
  if (touchGhostElement.value) {
    const rect = touchStartElement.value?.getBoundingClientRect();
    if (rect) {
      touchGhostElement.value.style.left = (touch.clientX - rect.width / 2) + 'px';
      touchGhostElement.value.style.top = (touch.clientY - rect.height / 2) + 'px';
    }
  }
  
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const puzzlePieces = elements.filter(el => 
    el.classList.contains('puzzle-piece') && 
    el.dataset.index !== undefined &&
    parseInt(el.dataset.index) !== touchDragIndex.value
  );
  
  document.querySelectorAll('.puzzle-piece').forEach(el => {
    el.classList.remove('drag-over');
  });
  if (puzzlePieces.length > 0) {
    puzzlePieces[0].classList.add('drag-over');
  }
};

const touchEnd = (event) => {
  if (touchDragIndex.value === null || isPuzzleComplete.value) {
    cleanupTouch();
    return;
  }

  const touch = event.changedTouches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const targetPiece = elements.find(el => 
    el.classList.contains('puzzle-piece') && 
    el.dataset.index !== undefined &&
    parseInt(el.dataset.index) !== touchDragIndex.value
  );
  
  if (targetPiece) {
    const targetIndex = parseInt(targetPiece.dataset.index);
    const sourceIndex = touchDragIndex.value;
    
    const next = [...puzzlePieces.value];
    const temp = next[sourceIndex];
    next[sourceIndex] = next[targetIndex];
    next[targetIndex] = temp;
    puzzlePieces.value = next;
    isPuzzleComplete.value = next.every((piece, index) => piece === index);
  }
  
  if (touchStartElement.value) {
    touchStartElement.value.style.opacity = '1';
  }
  document.querySelectorAll('.puzzle-piece').forEach(el => {
    el.classList.remove('drag-over');
  });
  
  cleanupTouch();
};

const cleanupTouch = () => {
  if (touchGhostElement.value) {
    document.body.removeChild(touchGhostElement.value);
    touchGhostElement.value = null;
  }
  if (touchStartElement.value) {
    touchStartElement.value.style.opacity = '1';
  }
  touchDragIndex.value = null;
  touchStartX.value = 0;
  touchStartY.value = 0;
  touchStartElement.value = null;
};

const drop = (targetIndex) => {
  if (
    draggedPieceIndex.value === null ||
    draggedPieceIndex.value === targetIndex
  ) {
    return;
  }

  const next = [...puzzlePieces.value];
  const draggedPiece = next[draggedPieceIndex.value];
  next[draggedPieceIndex.value] = next[targetIndex];
  next[targetIndex] = draggedPiece;

  puzzlePieces.value = next;
  draggedPieceIndex.value = null;
  isPuzzleComplete.value = next.every((piece, index) => piece === index);
};

const getPieceStyle = (originalIndex) => {
  const row = Math.floor(originalIndex / PUZZLE_SIZE);
  const col = originalIndex % PUZZLE_SIZE;
  const pieceSize = PIECE_SIZE.value;

  return {
    backgroundImage: `url(${puzzleImageUrl.value})`,
    backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
    backgroundSize: `${PUZZLE_SIZE * pieceSize}px ${
      PUZZLE_SIZE * pieceSize
    }px`,
    width: "100%",
    height: "100%",
  };
};

const dragStart = (event, index) => {
  if (isPuzzleComplete.value) {
    event.preventDefault();
    return;
  }
  draggedPieceIndex.value = index;
};

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${PUZZLE_SIZE}, ${PIECE_SIZE.value}px)`,
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
    const response = await apiFetch(`/courses/${course.value.slug}/test/submit`, {
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
  } catch (error) {
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
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
    margin-bottom: 50px;
  }

  > p {
    font-size: 30px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    color: #11243f;
    text-align: left;
    margin: 0;
    margin-bottom: 136px;
    padding: 0 140px;
    span {
      font-weight: 700;
    }
  }

  &__view {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 100px 50px 100px;
    &--box {
      position: absolute;
      background-color: #11243f;
      border-radius: 25px;
      padding: 40px 35px;
      transition: top 0.4s ease;
      cursor: pointer;
      left: 100px;
      right: 100px;
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
        font-size: 77px;
        font-weight: 700;
        font-family: "BergamascoThin", sans-serif;
      }

      h3 {
        margin: 0;
        font-size: 65px;
        font-weight: 400;
        font-family: "Inter", sans-serif;
      }
    }

    .start-link {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 41px;
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
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      font-size: 20px;
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
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 10px solid white;
  overflow: hidden;
  background: #11243f;
  z-index: 2;

  &.circle-alternate {
    background: #c65d3b;
  }

  img {
    width: 80px;
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
  padding: 0 135px;
  &__title {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0 ;
  }

  &__subtitle {
    font-size: 43px;
    font-family: "Inter", sans-serif;
    color: #666;
    text-align: center;
    margin: 0 0 50px 0;
    font-style: italic;
  }

  &__submit {
    display: block;
    margin: 100px auto 0;
    padding: 30px 90px;
    background-color: #c65d3b;
    color: #fffcf6;
    border: none;
    border-radius: 999px;
    font-size: 70px;
    font-weight: 300;
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
    font-size: 80px;
    font-weight: 700;
    font-family: "BergamascoThin", sans-serif;
    padding: 30px 20px;
    border-radius: 30px;
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
    font-size: 47px;
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
    font-size: 37px;
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
      display: none !important;
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
    font-size: 35px;
    font-weight: 500;
    color: #11243f;
    margin: 0 0 15px 0;
    font-family: "Inter", sans-serif;
  }

  .text-input {
    width: 100%;
    padding: 15px 20px;
    background: #fff;
    border: 2px solid #d0d5dd;
    border-radius: 12px;
    color: #11243f;
    font-size: 24px;
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
  touch-action: none;
  
  &.drag-over {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(198, 93, 59, 0.5);
    border: 2px solid #c65d3b;
  }
  
  &.piece-dragging {
    opacity: 0.5;
  }
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
  font-size: 32px;
  color: #11243f;
  margin-top: 30px;
}

.test-result-message-next {
  text-align: center;
  font-size: 32px;
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


@media (max-width: 1800px) {
  .course{
    margin-top: 26px;
    h1{
      font-size: 50px;
      margin-bottom: 12px;
    }
    >p{
      padding: 0 20px;
      font-size: 14px;
      margin-bottom: 12px;
    }
    &__view{
      padding: 0 20px;
      &--box{
        left: 20px;
        right: 20px;
        padding: 20px 20px;
        border-radius: 12px;
        .circle-photo__course{
          width: 50px;
          height: 50px;
          border: 4px solid white;
          img{
            width: 30px;
            height: auto;
          }
        }
      }
      &--textfirst{
        h4{
          font-size: 20px;
        }
        h3{
          font-size: 17px;
        }
        
      }
      .start-link{
        font-size: 17px;
        gap: 5px;
        .play-icon{
          width: 25px;
          height: 25px;
          font-size: 14px;
        }
      }
    }
  }
  .final-test{
    margin: 0px;
    padding: 0 20px;
    &__title{
      font-size: 40px;
    }
    &__subtitle{
      width: 90%;
      font-size: 12px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 16px;
    }
    .test-wrapper{
      flex-direction: column;
      gap: 10px;
      .test-section__number{
        width: 100%;
        flex-direction: row;
        .number-button{
          border-radius: 10px;
          height: 40px;
          padding: 11px 0px;
          flex: 1;
          font-size: 18px;
        }
      }
      .test-content{
        width: 100%;
        .test-section{
          &__body{
            padding: 14px;
          }
          &__inner{
            padding: 18px;
          }
          &__header{
            font-size: 16px;
          }
          .checkbox-option{
            margin-bottom: 0px;
          }
          .checkbox-label{
            .checkbox-custom{
              width: 15px;
              height: 15px;
              border-radius: 4px;
              &::after {
                content: "";
                width: 0px;
                height: 0px;
                border-radius: 3px;
                opacity: 0;
                transition: opacity 0.3s ease;
              }
            }
            .checkbox-text{
              font-size: 16px;
            }
          }
        }
      }
    }
    &__submit{
      margin: 26px auto 12px;
      padding: 10px 20px;
      font-size: 18px;
    }
    .text-question{
      margin-bottom: 0px;
      &__label{
        font-size: 14px;
        margin-bottom: 5px;
      }
      .text-input{
        padding: 5px 5px;
        border: 2px solid #d0d5dd;
        border-radius: 5px;
        font-size: 14px;
      }
    }
    .puzzle-container{
      padding: 0;
      .puzzle-grid{
        padding: 0;
        grid-template-columns: repeat(4, 65px) !important;
        gap: 2px;
        .puzzle-piece{
          width: 65px;
          height: 65px;
        }
      }
    }
    .test-result-message,
    .test-result-message-next{
      font-size: 14px;
      margin: 0;
    }
  }
}

@media (max-width: 430px) {
  .final-test .puzzle-container .puzzle-grid {
    grid-template-columns: repeat(4, 65px) !important;
  }
}

</style>