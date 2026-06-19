<template>
  <div class="home-container">
    <Header />
    <div class="home">
      <div class="home-block1">
        <!-- Фоновый текст TERRA -->
        <div class="home-block1__background-text">
          <div class="bg-row" v-for="i in 6" :key="i">
            <span class="bg-word" v-for="j in 12" :key="j">TERRA</span>
          </div>
        </div>

        <div class="home-block1__content">
          <div class="home-block1__danza">
            <h1>D <span>A </span>n <span>Z </span>A</h1>
          </div>
          <div class="home-block1__text">
            <p>
              История мирового танца <span>в единой системе</span>
              Terra Danza
            </p>
          </div>
        </div>
      </div>

      <div class="home-block2">
        <h1>Карта</h1>
        <div class="home-map">
          <!-- Приволжье -->
          <div
            class="map-item privol"
            @mouseenter="showTooltip('privol')"
            @mouseleave="hideTooltip('privol')"
          >
            <img
              src="@/assets/img/privol.png"
              alt="privol"
              class="default-img"
            />
            <img
              src="@/assets/img/privolwhite.png"
              alt="privol"
              class="hover-img"
              style="z-index: 1000"
              @click="goToPage('about_country?slug=povolzhe-i-priurale')"
            />
            <div
              v-if="activeTooltip === 'privol'"
              class="map-tooltip"
              :style="tooltipStyles.privol"
              @click="goToPage('about_country?slug=povolzhe-i-priurale')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Приволжье</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>12</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Америка (два блока) -->
          <div
            class="map-item america"
            @mouseenter="showTooltip('america')"
            @mouseleave="hideTooltip('america')"
          >
            <img
              src="@/assets/img/america.png"
              alt="America"
              class="default-img"
            />
            <img
              src="@/assets/img/americawhite.png"
              alt="America"
              class="hover-img"
              @click="goToPage('about_country?slug=amerika')"
            />
            <div
              v-if="activeTooltip === 'america'"
              class="map-tooltip america-tooltip-1"
              :style="tooltipStyles.america1"
              @click="goToPage('about_country?slug=amerika')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Северная Америка</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>24</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
            <div
              v-if="activeTooltip === 'america'"
              class="map-tooltip america-tooltip-2"
              :style="tooltipStyles.america2"
              @click="goToPage('about_country?slug=amerika')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Южная Америка</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>18</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Африка -->
          <div
            class="map-item africa"
            @mouseenter="showTooltip('africa')"
            @mouseleave="hideTooltip('africa')"
          >
            <img
              src="@/assets/img/africa.png"
              alt="Africa"
              class="default-img"
            />
            <img
              src="@/assets/img/africawhite.png"
              alt="Africa"
              class="hover-img"
              @click="goToPage('about_country?slug=afrika')"
            />
            <div
              v-if="activeTooltip === 'africa'"
              class="map-tooltip"
              :style="tooltipStyles.africa"
              @click="goToPage('about_country?slug=afrika')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Африка</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>32</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Европа -->
          <div
            class="map-item europa"
            @mouseenter="showTooltip('europa')"
            @mouseleave="hideTooltip('europa')"
          >
            <img
              src="@/assets/img/europa.png"
              alt="Europa"
              class="default-img"
            />
            <img
              src="@/assets/img/europawhite.png"
              alt="Europa"
              class="hover-img"
              style="z-index: 1002"
              @click="goToPage('about_country?slug=evropa')"
            />
            <div
              v-if="activeTooltip === 'europa'"
              class="map-tooltip"
              :style="tooltipStyles.europa"
              @click="goToPage('about_country?slug=evropa')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Европа</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>45</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Азия -->
          <div
            class="map-item asia"
            @mouseenter="showTooltip('asia')"
            @mouseleave="hideTooltip('asia')"
          >
            <img src="@/assets/img/asia.png" alt="Asia" class="default-img" />
            <img
              src="@/assets/img/asiawhite.png"
              alt="Asia"
              class="hover-img"
              style="z-index: 999"
              @click="goToPage('about_country?slug=aziia')"
            />
            <div
              v-if="activeTooltip === 'asia'"
              class="map-tooltip"
              :style="tooltipStyles.asia"
              @click="goToPage('about_country?slug=aziia')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Азия</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>56</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Кавказ -->
          <div
            class="map-item kavkaz"
            @mouseenter="showTooltip('kavkaz')"
            @mouseleave="hideTooltip('kavkaz')"
          >
            <img
              src="@/assets/img/kavkaz.png"
              alt="Kavkaz"
              class="default-img"
            />
            <img
              src="@/assets/img/kavkazwhite.png"
              alt="Kavkaz"
              class="hover-img"
              style="z-index: 1001"
              @click="goToPage('about_country?slug=severnyi-kavkaz')"
            />
            <div
              v-if="activeTooltip === 'kavkaz'"
              class="map-tooltip"
              :style="tooltipStyles.kavkaz"
              @click="goToPage('about_country?slug=severnyi-kavkaz')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Кавказ</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>28</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Запад -->
          <div
            class="map-item west"
            @mouseenter="showTooltip('west')"
            @mouseleave="hideTooltip('west')"
          >
            <img src="@/assets/img/west.png" alt="west" class="default-img" />
            <img
              src="@/assets/img/westwhite.png"
              alt="west"
              class="hover-img"
              @click="goToPage('about_country?slug=sibir-i-dalnii-vostok')"
            />
            <div
              v-if="activeTooltip === 'west'"
              class="map-tooltip"
              :style="tooltipStyles.west"
              @click="goToPage('about_country?slug=sibir-i-dalnii-vostok')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Сибирь и дальний восток</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>38</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <!-- Центр -->
          <div
            class="map-item center"
            @mouseenter="showTooltip('center')"
            @mouseleave="hideTooltip('center')"
          >
            <img
              src="@/assets/img/center.png"
              alt="center"
              class="default-img"
            />
            <img
              src="@/assets/img/centerwhite.png"
              alt="center"
              class="hover-img"
              @click="
                goToPage(
                  'about_country?slug=severo-zapad-i-tsentralnaia-rossiia'
                )
              "
            />
            <div
              v-if="activeTooltip === 'center'"
              class="map-tooltip"
              :style="tooltipStyles.center"
              @click="
                goToPage(
                  'about_country?slug=severo-zapad-i-tsentralnaia-rossiia'
                )
              "
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Центральная Россия</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>22</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>

          <div
            class="map-item australia"
            @mouseenter="showTooltip('australia')"
            @mouseleave="hideTooltip('australia')"
          >
            <img
              src="@/assets/img/avstralia.png"
              alt="Australia"
              class="default-img"
            />
            <img
              src="@/assets/img/avstraliawhite.png"
              alt="Australia"
              class="hover-img"
              @click="goToPage('about_country?slug=avstraliia')"
            />
            <div
              v-if="activeTooltip === 'australia'"
              class="map-tooltip"
              :style="tooltipStyles.australia"
              @click="goToPage('about_country?slug=avstraliia')"
            >
              <div class="tooltip-content">
                <h3 class="tooltip-title">Австралия</h3>
                <p class="tooltip-dances">Кол-во танцев: <span>15</span></p>
                <button class="tooltip-button">Узнать больше →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="home-block3">
        <h1>О нас</h1>
        <div class="home-tab">
          <div class="tab-item tab-item-1">
            <div class="tab-number">(01)</div>
            <div class="tab-title">МИР ТАНЦА</div>
            <div class="tab-title-hover">МИР ТАНЦА</div>
            <div class="tab-description">
              Здесь танец — это не просто движение, а ключ к пониманию истории,
              традиций и образа жизни народов
            </div>
          </div>
          <div class="tab-item tab-item-2">
            <div class="tab-number">(02)</div>
            <div class="tab-title">КАРТА</div>
            <div class="tab-title-hover">КАРТА</div>
            <div class="tab-description">
              Мы создали карту мира, на которой вы можете посмотреть, где возник
              танец, как он развивался и с какой культурой связан
            </div>
          </div>
          <div class="tab-item tab-item-3">
            <div class="tab-number">(03)</div>
            <div class="tab-title">ДОСТУП</div>
            <div class="tab-title-hover">ДОСТУП</div>
            <div class="tab-description">
              Мы делаем знания о танце доступными, современными и вдохновляющими
              для каждого
            </div>
          </div>
          <div class="tab-item tab-item-4">
            <div class="tab-number">(04)</div>
            <div class="tab-title">СИСТЕМА</div>
            <div class="tab-title-hover">СИСТЕМА</div>
            <div class="tab-description">
              Мы собираем и систематизируем знания о танцах, чтобы вы получали
              понятный, логичный и достоверный материал в одном месте.
            </div>
          </div>
        </div>
        <div class="home-view-button">
          <h1>Начни свой путь вместе с нами!</h1>
          <h2 @click="goToPage('catalog')">НАЧАТЬ ОБУЧЕНИЕ</h2>
        </div>
      </div>

      <div class="home-block4">
        <h1>Почему мы</h1>
        <div class="home-tab">
          <img src="@/assets/img/ico1.png" alt="ico" />
          <img src="@/assets/img/ico2.png" alt="ico" />
          <img src="@/assets/img/ico3.png" alt="ico" />
          <img src="@/assets/img/ico4.png" alt="ico" />
        </div>
      </div>

      <div class="home-block5">
        <h1>Популярные стили</h1>
        <h2>2026</h2>
        <div class="blockstyle">
          <h3 class="blockstyle__popular">Популярные</h3>
          <div class="blockstyle__style">
            <h3 class="blockstyle__style--style">стили</h3>
            <h3 class="blockstyle__style--years">2026</h3>
          </div>
        </div>
        <div class="home-tab">
          <div class="tab-item tab-item-1">
            <img class="tab-img-dance" src="@/assets/img/img1.png" alt="img" />
            <div class="tab-number">Хип-хоп</div>
            <div class="tab-title"><span>Уровень:</span> начинающий</div>
            <div class="tab-title-hover">продолжающий</div>
            <div class="tab-description"><span>Кол-во курсов:</span> 2</div>
            <p @click="goToPage('catalog')">
              узнать больше
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="16"
                viewBox="0 0 25 16"
                fill="none"
              >
                <path
                  d="M24.3212 8.325C24.7239 7.92222 24.7239 7.26919 24.3212 6.86641L17.7575 0.302735C17.3547 -0.100045 16.7017 -0.100045 16.2989 0.302735C15.8961 0.705514 15.8961 1.35855 16.2989 1.76133L22.1333 7.5957L16.2989 13.4301C15.8961 13.8329 15.8961 14.4859 16.2989 14.8887C16.7017 15.2915 17.3547 15.2915 17.7575 14.8887L24.3212 8.325ZM0 7.5957L0 8.62708H23.5919V7.5957V6.56432H0L0 7.5957Z"
                  fill="#11243F"
                />
              </svg>
            </p>
          </div>
          <div class="tab-item tab-item-1">
            <img class="tab-img-dance" src="@/assets/img/img3.png" alt="img" />
            <div class="tab-number">Контемп</div>
            <div class="tab-title"><span>Уровень:</span> начинающий</div>
            <div class="tab-title-hover">продолжающий</div>
            <div class="tab-description"><span>Кол-во курсов:</span> 1</div>
            <p @click="goToPage('catalog')">
              узнать больше
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="16"
                viewBox="0 0 25 16"
                fill="none"
              >
                <path
                  d="M24.3212 8.325C24.7239 7.92222 24.7239 7.26919 24.3212 6.86641L17.7575 0.302735C17.3547 -0.100045 16.7017 -0.100045 16.2989 0.302735C15.8961 0.705514 15.8961 1.35855 16.2989 1.76133L22.1333 7.5957L16.2989 13.4301C15.8961 13.8329 15.8961 14.4859 16.2989 14.8887C16.7017 15.2915 17.3547 15.2915 17.7575 14.8887L24.3212 8.325ZM0 7.5957L0 8.62708H23.5919V7.5957V6.56432H0L0 7.5957Z"
                  fill="#11243F"
                />
              </svg>
            </p>
          </div>
          <div class="tab-item tab-item-1">
            <img class="tab-img-dance" src="@/assets/img/img2.png" alt="img" />
            <div class="tab-number">Хаус</div>
            <div class="tab-title"><span>Уровень:</span> начинающий</div>
            <br />
            <div class="tab-description"><span>Кол-во курсов:</span> 2</div>
            <p @click="goToPage('catalog')">
              узнать больше
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="16"
                viewBox="0 0 25 16"
                fill="none"
              >
                <path
                  d="M24.3212 8.325C24.7239 7.92222 24.7239 7.26919 24.3212 6.86641L17.7575 0.302735C17.3547 -0.100045 16.7017 -0.100045 16.2989 0.302735C15.8961 0.705514 15.8961 1.35855 16.2989 1.76133L22.1333 7.5957L16.2989 13.4301C15.8961 13.8329 15.8961 14.4859 16.2989 14.8887C16.7017 15.2915 17.3547 15.2915 17.7575 14.8887L24.3212 8.325ZM0 7.5957L0 8.62708H23.5919V7.5957V6.56432H0L0 7.5957Z"
                  fill="#11243F"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Header from "../component/header/header.vue";
import Footer from "../component/footer/footer.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTooltip = ref(null);

const tooltipStyles = reactive({
  privol: { top: "0%", left: "0%" },
  america1: { top: "35%", left: "30%" },
  america2: { top: "67%", left: "55%" },
  africa: { top: "18%", left: "30%" },
  europa: { top: "35%", left: "33%" },
  asia: { top: "25%", left: "30%" },
  kavkaz: { top: "0%", left: "0%" },
  west: { top: "50%", left: "25%" },
  center: { top: "30%", left: "10%" },
  australia: { top: "18%", left: "15%" },
});

const showTooltip = (region) => {
  activeTooltip.value = region;
};

const hideTooltip = (region) => {
  if (activeTooltip.value === region) {
    activeTooltip.value = null;
  }
};

const goToPage = (page) => {
  router.push(`/${page}`);
};
</script>

<style lang="scss">
// ============================================
// 1. КОНТЕЙНЕРЫ И ОСНОВНЫЕ БЛОКИ
// ============================================
.home-container {
  background-color: #fff;
  overflow-x: hidden;
}

.home {
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
}

.blockstyle{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 48px;
  font-family: "BergamascoThin", sans-serif;
  font-weight: 800;
  color: #11243f;
  text-transform: uppercase;
  &__popular{
    font-size: 48px;
    margin: 0;
  }
  &__style{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    &--style{
      font-size: 48px;
      margin: 0;
    }
    &--years{
      font-size: 48px;
      margin: 0;
    }
  }
  @media (min-width: 1400px) {
    display: none;
  }
}
@media (max-width: 1400px) {
  .home-block5 {
    h1 {
      display: none;
    }

    h2 {
      display: none;
    }
  }
}
// ============================================
// 2. BLOCK 1 (TERRA + Danza)
// ============================================
.home-block1 {
  position: relative;
  color: #11243f;
  overflow: hidden;

  &__background-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 0;

    .bg-row {
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      animation: scrollRow 20s linear infinite;
      line-height: 0.8;
      margin: -10px 0;

      &:nth-child(even) {
        animation-direction: reverse;
        animation-duration: 25s;
      }
    }

    .bg-word {
      font-family: "Luckiest", sans-serif;
      font-weight: 600;
      font-size: 300px;
      color: #fff;
      line-height: 1;
      letter-spacing: -2px;
      text-transform: uppercase;
      letter-spacing: 5px;
      display: inline-block;
      -webkit-text-stroke: 3px #e7e8e8;
      text-stroke: 2px #e7e8e8;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  span {
    color: #c65d3b;
  }

  h1 {
    font-size: 379.38px;
    font-weight: 600;
    font-family: "Luckiest", sans-serif;
    line-height: 0.8;
    margin: 319.85px 0 148px 0;
  }

  p {
    margin: 0;
    font-size: 73.5px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    width: 44%;
    margin-left: auto;
  }

  &__danza {
    display: flex;
    justify-content: center;
  }

  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@keyframes scrollRow {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

// ============================================
// 3. BLOCK 2 (КАРТА)
// ============================================
.home-block2 {
  margin-top: 100px;

  h1 {
    text-transform: uppercase;
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin: 0;
  }
}

.home-map {
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  aspect-ratio: 22 / 11;
  overflow: visible;

  .map-item {
    position: absolute;
    cursor: pointer;

    img {
      width: 100%;
      height: auto;
      display: block;
      transition: opacity 0.3s ease;
    }

    .default-img {
      opacity: 1;
    }

    .hover-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      opacity: 0;
    }

    &:hover {
      .default-img {
        opacity: 0;
      }
      .hover-img {
        opacity: 1;
      }
    }
  }

  .map-tooltip {
    position: absolute;
    z-index: 100000;
    border-radius: 12px;
    padding: 12px 16px;
    transition: all 0.2s ease;
    text-align: center;

    .tooltip-content {
      color: white;

      .tooltip-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        font-family: "Inter", sans-serif;
        text-shadow: 3px 3px 5px black;
      }

      .tooltip-dances {
        font-size: 13px;
        margin: 0 0 10px 0;
        font-family: "Inter", sans-serif;
        text-shadow: 3px 3px 5px black;

        span {
          font-weight: 700;
          color: white;
        }
      }

      .tooltip-button {
        background: none;
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        font-family: "Inter", sans-serif;
        width: 100%;
        text-shadow: 3px 3px 5px black;
      }
    }
  }

  .america-tooltip-1,
  .america-tooltip-2 {
    position: absolute;
  }

  // Позиционирование регионов на карте
  .america {
    width: 30%;
    left: 5%;
    top: 6%;
  }
  .africa {
    width: 15%;
    left: 47%;
    top: 60%;
  }
  .europa {
    width: 18%;
    left: 43.355%;
    top: 26.6%;
  }
  .asia {
    width: 30.059375%;
    left: 57.4%;
    top: 34.8%;
  }
  .kavkaz {
    width: 5%;
    left: 57.3%;
    top: 40.1%;
    z-index: 1004;
  }
  .center {
    width: 11.3%;
    left: 58.5%;
    top: 23.2%;
  }
  .privol {
    width: 5.5%;  
    left: 61.1%;
    top: 34.7%;
    z-index: 1004;
  }
  .west {
    width: 23.26%;
    left: 63.9%;
    top: 8.9%;
    z-index: 998;
  }
  .australia {
    width: 11%;
    left: 75%;
    top: 84%;
  }
}

// ============================================
// 4. BLOCK 3 (О НАС + КНОПКА)
// ============================================
.home-block3 {
  margin-top: 100px;

  h1 {
    text-transform: uppercase;
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin-bottom: 50px;
    margin: 0;
  }

  .home-tab {
    display: flex;
    flex-direction: row;
    gap: 22px;
    width: 100%;
    padding: 0 100px;
    box-sizing: border-box;
    color: #fffcf6;
    margin-top: 50px;

    .tab-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      min-width: 0;
      border-radius: 40px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
      padding: 2px;
      height: 477px;
      font-family: "Inter", sans-serif;
      border: 15px solid #fff;
      outline: 3px solid #11243f;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #fff;
        outline-color: #11243f;

        .tab-number {
          opacity: 0;
          visibility: hidden;
        }
        .tab-title {
          opacity: 0;
          visibility: hidden;
        }
        .tab-description {
          opacity: 1;
          visibility: visible;
        }
        .tab-title-hover {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .tab-number {
      font-weight: 500;
      font-size: 86px;
      opacity: 1;
      visibility: visible;
      text-align: center;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      margin: 0;
      position: relative;
      margin-top: 50%;
    }

    .tab-title {
      font-size: 48px;
      text-align: center;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      opacity: 1;
      visibility: visible;
      margin-top: auto;
      margin-bottom: 10%;
      position: relative;
    }

    .tab-description {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      text-align: center;
      font-size: 24px;
      position: absolute;
      top: 55%;
      left: 20px;
      right: 20px;
    }

    .tab-title-hover {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      font-weight: 700;
      font-size: 48px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
    }

    .tab-item-1 {
      background-image: url("@/assets/img/Rectangle1.png");
    }
    .tab-item-2 {
      background-image: url("@/assets/img/Rectangle2.png");
    }
    .tab-item-3 {
      background-image: url("@/assets/img/Rectangle3.png");
    }
    .tab-item-4 {
      background-image: url("@/assets/img/Rectangle4.png");
    }
  }

  .home-view-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
    border: 2px solid #11243f;
    padding: 15px 25px;
    border-radius: 35px;
    margin-top: 50px;

    h1 {
      font-size: 40px;
      font-weight: 500;
      text-align: center;
      width: 50%;
      font-family: "Inter", sans-serif;
      text-transform: none !important;
    }

    h2 {
      font-size: 24px;
      color: #fffcf6;
      text-align: center;
      background-color: #c65d3b;
      width: 40%;
      font-weight: 400;
      padding: 20.5px 30px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 9999px;
      font-family: "Inter", sans-serif;
      transition: transform 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #7c351f;
      }
    }
  }
}

// ============================================
// 5. BLOCK 4 (ПОЧЕМУ МЫ - ИКОНКИ)
// ============================================
.home-block4 {
  margin-top: 100px;

  h1 {
    text-transform: uppercase;
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin-bottom: 50px;
    margin: 0;
  }

  .home-tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    padding: 0 148px;

    > img {
      width: 20%;
    }
  }
}

.home-block5 {
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: clip;

  h1 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin-bottom: 50px;
    margin: 0;
    text-transform: uppercase;
  }

  h2 {
    font-size: 140px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    margin: -20px 0 0 55%;
    font-style: italic;
  }

  .home-tab {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    max-width: 1400px;
    margin: 50px auto 0;
    gap: 100px;
    padding: 0 20px;
    box-sizing: border-box;

    .tab-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      position: relative;
      border-radius: 15px;
      border: 2px solid #11243f;
      padding: 24px 27px;
      color: #11243f;
      height: auto;
      overflow: visible;

      .tab-number {
        font-size: 67px;
        font-family: "BergamascoThin", sans-serif;
        font-weight: 800;
      }

      .tab-title {
        font-size: 25.46px;
        font-weight: 400;
        font-family: "Inter", sans-serif;
        span {
          font-weight: 600;
        }
      }

      .tab-title-hover {
        font-size: 18px;
        font-weight: 400;
        font-family: "Inter", sans-serif;
        text-align: right;
        width: 65%;
      }

      .tab-description {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 400;
        font-family: "Inter", sans-serif;
        span {
          font-weight: 600;
        }
      }

      p {
        font-size: 18px;
        font-weight: 700;
        padding: 5px 10px;
        border-radius: 999px;
        margin: 35px 0 0 0;
        border: 2px solid #11243f;
        font-family: "Inter", sans-serif;
        text-align: center;
        width: 52%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        transition: all 0.1s ease;
        cursor: pointer;

        &:hover {
          color: #fffcf6;
          border: 2px solid #c65d3b;
          background-color: #c65d3b;
        }

        svg {
          cursor: pointer;
          path {
            transition: fill 0.1s ease;
          }
        }

        &:hover svg path {
          fill: #fffcf6;
        }
      }

      .tab-img-dance {
        position: absolute;
        right: -113px;
        top: -18px;
        width: 220px;
      }
    }
  }
}

@media (max-width: 1400px) {
  .home {
    padding: 0;
  }

  // ========== BLOCK 1 ==========
  .home-block1 {
    h1 {
      font-size: 78px;
      margin: 70px 0 30px 0;
    }

    p {
      margin: 0 0 0 auto;
      font-size: 16px;
      width: 40%;
      text-align: left;
    }

    .bg-word {
      font-size: 60px;
      font-weight: 500;
      -webkit-text-stroke: 2px #e7e8e8;
    }

    .bg-row {
      line-height: 0.8;
      margin: -5px 0;
    }
  }

  // ========== BLOCK 2 (КАРТА) ==========
  .home-block2 {
    margin-top: 15px;

    h1 {
      font-size: 50px;
      margin: 0 0;
    }
  }

  .home-map {
    width: 143%;
    aspect-ratio: 18 / 9;
    left: 47%;
    transform: translateX(-50%);
    .america {
      width: 30%;
      left: 12%;
      top: 0%;
    }
    .africa {
      width: 15%;
      left: 47%;
      top: 56%;
    }
    .europa {
      width: 18%;
      left: 43.355%;
      top: 19.6%;
    }
    .asia {
      width: 30.059375%;
      left: 57.4%;
      top: 28.5%;
    }
    .kavkaz {
      width: 5%;
      left: 57.3%;
      top: 33.4%;
      z-index: 1004;
    }
    .center {
      width: 11.3%;
      left: 58.5%;
      top: 16.6%;
    }
    .privol {
      width: 5.5%;
      left: 61.1%;
      top: 28.3%;
      z-index: 1004;
    }
    .west {
      width: 23.26%;
      left: 63.9%;
      top: 2.6%;
      z-index: 998;
    }
    .australia {
      width: 11%;
      left: 73%;
      top: 78%;
    }

    .map-tooltip {
      padding: 8px 12px;
      min-width: 120px;

      .tooltip-content {
        .tooltip-title {
          font-size: 12px;
          margin-bottom: 4px;
        }
        .tooltip-dances {
          font-size: 10px;
          margin-bottom: 6px;
        }
        .tooltip-button {
          font-size: 10px;
          padding: 4px 8px;
        }
      }
    }
  }

  // ========== BLOCK 3 (О НАС) ==========
  .home-block3 {
    margin-top: 50px;

    h1 {
      font-size: 50px;
      margin-bottom: 20px;
    }

    .home-tab {
      gap: 16px;
      padding: 0 16px;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;

      .tab-item {
        height: 190px;
        flex: 0 1 calc(50% - 16px);
        min-width: 140px;
        max-width: calc(50% - 16px);
        border-width: 8px;
        border-radius: 24px;
        box-sizing: border-box;

        .tab-number {
          font-size: 34px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
        }

        .tab-title {
          font-size: 20px;
          position: absolute;
          top: 78%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
        }

        .tab-title-hover {
          font-size: 20px;
          width: 90%;
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
        }

        .tab-description {
          font-size: 12px;
          position: absolute;
          top: 65%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
        }
      }
    }

    .home-view-button {
      padding: 12px 8px;
      margin-top: 30px;
      margin-left: 20px;
      margin-right: 20px;
      flex-direction: row;
      width: auto;
      display: flex;
      
      h1 {
        font-size: clamp(14px, 1.5vw, 24px);
        width: 50%;
        margin: 0;
        font-weight: 600;
      }

      h2 {
        font-size: clamp(14px, 1.5vw, 24px);
        width: 50%;
        padding: 12px 20px;
        font-weight: 600;
      }
    }
  }

  // ========== BLOCK 4 (ПОЧЕМУ МЫ) ==========
  .home-block4 {
    margin-top: 50px;

    h1 {
      font-size: 50px;
      margin-bottom: 20px;
    }

    .home-tab {
      padding: 0 20px;
      margin-top: 20px;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;

      > img {
        width: calc(25% - 15px);
        min-width: 80px;
        margin-bottom: 0;
      }
    }
  }

  // ========== BLOCK 5 (ПОПУЛЯРНЫЕ СТИЛИ) ==========
  .home-block5 {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-size: 48px;
      margin-bottom: 10px;
      text-align: center;
    }

    h2 {
      font-size: 48px;
      margin: -10px 0 0 auto;
      text-align: right;
      padding-right: 20px;
    }

    .home-tab {
      margin-top: 30px;
      padding: 0 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 30px;
      width: 80%;
      @media (max-width: 700px) {
        flex-direction: column;
        width: 100%;
      }
      .tab-item {
        width: 300px;
        padding: 20px;
        position: relative;
        margin: 0 auto;
        overflow: visible;
        box-sizing: border-box;

        .tab-number {
          font-size: 36px;
        }

        .tab-title {
          font-size: 13px;
        }

        .tab-title-hover {
          font-size: 14px;
          width: 80%;
        }

        .tab-description {
          font-size: 14px;
          margin-top: 8px;
        }

        p {
          font-size: 14px;
          width: 70%;
          padding: 8px 12px;
          margin-top: 20px;

          svg {
            width: 18px;
            height: 12px;
          }
        }

        .tab-img-dance {
          position: absolute;
          width: 140px;
          top: -10px;
          right: -65px;
          z-index: 10;
        }
      }
    }
  }
}
</style>
