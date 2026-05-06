<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="achievement-notifications-container">
        <TransitionGroup name="achievement" tag="div" class="achievement-list">
          <div
            v-for="achievement in achievementQueue"
            :key="achievement.timestamp"
            class="achievement-card"
            :class="{ 'achievement-level-up': achievement.type === 'level_up' }"
          >
            <div class="achievement-content">
              <div class="achievement-icon">
                <span v-if="achievement.icon">{{ achievement.icon }}</span>
                <span v-else>🏆</span>
              </div>

              <div class="achievement-info">
                <h4 class="achievement-title">
                  {{
                    achievement.name ||
                    achievement.title ||
                    "Достижение получено!"
                  }}
                </h4>
                <p class="achievement-description">
                  {{
                    achievement.description ||
                    "Поздравляем с новым достижением!"
                  }}
                </p>

                <div v-if="achievement.points" class="achievement-points">
                  <span>⭐</span>
                  <span>+{{ achievement.points }} очков</span>
                </div>
              </div>

              <button
                @click="removeAchievement(achievement.timestamp ?? 0)"
                class="achievement-close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div class="achievement-progress">
              <div class="achievement-progress-bar" />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { achievementQueue, removeFromQueue } = useWebSocket();

const removeAchievement = (timestamp: number) => {
  removeFromQueue(timestamp);
};
</script>

<style scoped>
.achievement-notifications-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 99999;
  pointer-events: none;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-card {
  pointer-events: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  max-width: 400px;
  border-left: 4px solid #c65d3b;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.achievement-level-up {
  border-left-color: #22c55e;
}

.achievement-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.achievement-icon {
  font-size: 32px;
  flex-shrink: 0;
  line-height: 1;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-title {
  font-size: 16px;
  font-weight: 600;
  color: #11243f;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.achievement-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.achievement-points {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #c65d3b;
  font-weight: 500;
}

.achievement-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  width: 24px;
  height: 24px;
}

.achievement-close:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.achievement-close svg {
  width: 16px;
  height: 16px;
}

.achievement-progress {
  height: 3px;
  background: #f3f4f6;
}

.achievement-progress-bar {
  height: 100%;
  background: linear-gradient(to right, #c65d3b, #e67e5a);
  animation: achievement-shrink 6s linear forwards;
}

.achievement-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.achievement-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.achievement-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.achievement-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

@keyframes achievement-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

@media (max-width: 640px) {
  .achievement-notifications-container {
    top: 8px;
    right: 8px;
    left: 8px;
  }

  .achievement-card {
    min-width: auto;
    max-width: none;
    width: 100%;
  }
}
</style>
