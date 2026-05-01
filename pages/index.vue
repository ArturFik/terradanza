<template>
  <div class="home-container">
    <Header />
    <div class="home">
      <div class="home-block1">
        <div class="home-block1__danza">
          <h1>D <span>A </span>N <span>Z </span>A</h1>
        </div>
        <div class="home-block1__text">
          <img src="@/assets/img/terra.png" alt="" />
          <p>
            История мирового танца <span>в единой системе</span>
            Terra Danza
          </p>
        </div>
      </div>
      <div class="home-block2">
        <h1>Карта</h1>
        <div class="home-map">
          <div class="map-item privol" @click.stop="openContinent('privol')">
            <img
              src="@/assets/img/privol.png"
              alt="privol"
            />
          </div>
          <div class="map-item america" @click.stop="openContinent('america')">
            <img
              src="@/assets/img/america.png"
              alt="America"
            />
          </div>
          <div class="map-item africa" @click.stop="openContinent('africa')">
            <img
              src="@/assets/img/africa.png"
              alt="Africa"
            />
          </div>
          <div class="map-item europa" @click.stop="openContinent('europa')">
            <img
              src="@/assets/img/europa.png"
              alt="Europa"
            />
          </div>
          <div class="map-item asia" @click.stop="openContinent('asia')">
            <img src="@/assets/img/asia.png" alt="Asia" />
          </div>
          <div class="map-item kavkaz" @click.stop="openContinent('kavkaz')">
            <img
              src="@/assets/img/kavkaz.png"
              alt="Kavkaz"
            />
          </div>
          
          <div class="map-item west" @click.stop="openContinent('west')">
            <img
              src="@/assets/img/west.png"
              alt="west"
            />
          </div>
          <div class="map-item center" @click.stop="openContinent('center')">
            <img
              src="@/assets/img/center.png"
              alt="center"
            />
          </div>
          <div class="map-item australia" @click.stop="openContinent('australia')">
            <img
              src="@/assets/img/avstralia.png"
              alt="Australia"
            />
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
        <div class="home-tab">
          <div class="tab-item tab-item-1">
            <img class="tab-img-dance" src="@/assets/img/img1.png" alt="img" />
            <div class="tab-number">Хип-хоп</div>
            <div class="tab-title"><span>Уровень:</span> начинающий</div>
            <div class="tab-title-hover">продолжающий</div>
            <div class="tab-description"><span>Кол-во курсов:</span> 2</div>
            <p @click="goToPage('encyclopedia')"> узнать больше
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
            <p @click="goToPage('encyclopedia')"> узнать больше
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
            <p @click="goToPage('encyclopedia')">
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

    <!-- Модальное окно с континентом -->
    <div v-if="activeContinent" class="continent-overlay" @click="closeContinent">
      <div class="continent-modal" @click.stop>
        <img :src="getContinentImage(activeContinent)" :alt="activeContinent" />
        <div class="continent-info">
          <template v-if="activeContinent === 'america'">
            <div class="continent-text north-america">
              <p>Кол-во танцев: 24</p>
              <span @click="goToPage('encyclopedia')">Узнать больше →</span>
            </div>
            <div class="continent-text south-america">
              <p>Кол-во танцев: 18</p>
              <span @click="goToPage('encyclopedia')">Узнать больше →</span>
            </div>
          </template>
          <template v-else>
            <div class="continent-text">
              <p>Кол-во танцев: {{ getDancesCount(activeContinent) }}</p>
              <span @click="goToPage('encyclopedia')">Узнать больше →</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from "../component/header/header.vue";
import Footer from "../component/footer/footer.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const activeContinent = ref(null)

const continentImages = {
  america: new URL('@/assets/img/americawhite.png', import.meta.url).href,
  africa: new URL('@/assets/img/africawhite.png', import.meta.url).href,
  europa: new URL('@/assets/img/europawhite.png', import.meta.url).href,
  asia: new URL('@/assets/img/asiawhite.png', import.meta.url).href,
  kavkaz: new URL('@/assets/img/kavkazwhite.png', import.meta.url).href,
  privol: new URL('@/assets/img/privolwhite.png', import.meta.url).href,
  west: new URL('@/assets/img/westwhite.png', import.meta.url).href,
  center: new URL('@/assets/img/centerwhite.png', import.meta.url).href,
  australia: new URL('@/assets/img/avstraliawhite.png', import.meta.url).href,
}

const dancesCount = {
  america: 42,
  africa: 35,
  europa: 28,
  asia: 31,
  kavkaz: 15,
  privol: 12,
  west: 20,
  center: 18,
  australia: 10,
}

const openContinent = (continent) => {
  activeContinent.value = continent
  document.body.style.overflow = 'hidden'
}

const closeContinent = () => {
  activeContinent.value = null
  document.body.style.overflow = ''
}

const getContinentImage = (continent) => {
  return continentImages[continent] || ''
}

const getDancesCount = (continent) => {
  return dancesCount[continent] || 0
}

const goToPage = (page) => {
  closeContinent()
  router.push(`/${page}`)
}
</script>

<style lang="scss">
.home-container {
  background-color: #fff;
}

.home {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
}

.home-block1 {
  position: relative;
  color: #11243f;
  span {
    color: #c65d3b;
  }

  h1 {
    font-size: 160px;
    font-weight: 600;
    font-family: "Luckiest", sans-serif;
    line-height: 0.8;
    margin: 150px 0 50px 0;
  }

  p {
    margin: 0;
    font-size: 36px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    width: 30%;
    margin-right: 12%;
  }
  &__danza {
    display: flex;
    justify-content: center;
    background-image: url("@/assets/img/terra.png");
    background-repeat: repeat;
    background-size: auto;
    background-size: 50% auto;
  }
  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    img {
      width: 50%;
    }
  }
}

.home-block2 {
  margin-top: 100px;

  h1 {
    font-size: 96px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin-bottom: 50px;
    margin: 0;
  }
}

.home-map {
  position: relative;
  width: 100%;
  max-width: 1234px;
  margin: 0 auto;
  aspect-ratio: 16 / 11;
  overflow: hidden;

  .map-item {
    position: absolute;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .america {
    width: 40%;
    left: -2%;
    top: 2%;
  }

  .africa {
    width: 20%;
    left: 38%;
    top: 52%;
  }

  .europa {
    width: 22%;
    left: 38.8%;
    top: 16.5%;
  }

  .asia {
    width: 40%;
    left: 54.2%;
    top: 21.8%;
  }

  .kavkaz {
    width: 7%;
    left: 54.8%;
    top: 28.2%;
  }

  .center {
    width: 15%;
    left: 56.1%;
    top: 13.37%;
  }

  .privol {
    width: 7%;
    left: 59.9%;
    top: 23.9%;
    z-index: 999;
  }

  .west {
    width: 31%;
    left: 62.7%;
    top: 0%;
    z-index: 999;
  }

  .australia {
    width: 22%;
    left: 74%;
    top: 70%;
  }
}

// Модальное окно
.continent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 252, 246, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.continent-modal {
  position: relative;
  max-width: 600px;
  width: 90%;
  cursor: default;
  animation: fadeInScale 0.3s ease;

  img {
    width: 75%;
    height: auto;
    display: block;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15));
  }
}

.continent-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .continent-text {
    position: absolute;
    pointer-events: all;
    text-align: center;

    p {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 8px 0;
      font-family: "Inter", sans-serif;
      text-shadow: 0 1px 3px rgba(255, 252, 246, 0.8);
    }

    span {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      font-family: "Inter", sans-serif;
      transition: color 0.2s ease;

      &:hover {
        color: #b6b6b6;
        text-decoration: underline;
      }
    }
  }

  // Северная Америка
  .north-america {
    top: 37%;
    left: 35%;
    transform: translateX(-50%);
    z-index: 99999;
  }

  // Южная Америка
  .south-america {
    top: 66%;
    left: 51%;
    transform: translateX(-50%);
    z-index: 99999;
  }

  // Для остальных континентов — текст по центру
  .continent-text:not(.north-america):not(.south-america) {
    top: 50%;
    left: 45%;
    transform: translate(-50%, -50%);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .home {
    padding: 0 20px;
  }

  .home-block1 {
    h1 {
      font-size: 80px;
      margin: 80px 0 30px 0;
    }

    p {
      font-size: 20px;
      width: 50%;
    }
  }

  .home-map {
    aspect-ratio: 4 / 3;

    .america {
      width: 40%;
      left: -2%;
      top: 2%;
    }

    .africa {
      width: 20%;
      left: 38%;
      top: 49%;
    }

    .europa {
      width: 25%;
      left: 37%;
      top: 24.5%;
    }

    .asia {
      width: 25%;
      left: 55%;
      top: 34%;
    }

    .west {
      width: 47%;
      left: 56%;
      top: 6%;
    }

    .australia {
      width: 16%;
      left: 65%;
      top: 62%;
    }
  }

  .continent-modal {
    max-width: 90%;
  }

  .continent-info {
    .north-america {
      top: 15%;
      left: 12%;
    }

    .south-america {
      top: 55%;
      left: 28%;
    }

    .continent-text p {
      font-size: 14px;
    }

    .continent-text span {
      font-size: 12px;
    }
  }
}

.home-block3 {
  margin-top: 100px;

  h1 {
    font-size: 96px;
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
    gap: 16px;
    width: 100%;
    padding: 0 16px;
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
      border-radius: 20px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
      padding: 2px;
      height: 300px;
      font-family: "Inter", sans-serif;
      border: 10px solid #fff;
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
      font-size: 48px;
      opacity: 1;
      visibility: visible;
      text-align: center;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      margin: 0;
      position: relative;
    }

    .tab-title {
      font-size: 24px;
      text-align: center;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      opacity: 1;
      visibility: visible;
      margin-top: 20px;
      position: relative;
    }

    .tab-description {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      text-align: center;
      font-size: 12px;
      position: absolute;
      bottom: 100px;
      left: 20px;
      right: 20px;
    }

    .tab-title-hover {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      font-weight: 700;
      font-size: 26px;
      text-align: center;
      position: absolute;
      top: 45%;
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

    @media (max-width: 768px) {
      gap: 12px;
      padding: 0 12px;
    }

    @media (max-width: 640px) {
      flex-wrap: wrap;
      gap: 12px;

      .tab-item {
        flex: 1 1 calc(50% - 12px);
        min-width: calc(50% - 12px);
      }
    }

    @media (max-width: 480px) {
      .tab-item {
        flex: 1 1 100%;
        min-width: 100%;
      }
    }
  }
  .home-view-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
    border: 3px solid #11243f;
    padding: 15px 25px;
    border-radius: 35px;
    margin-top: 50px;

    h1 {
      font-size: 24px;
      text-align: center;
      width: 50%;
      font-family: "Inter", sans-serif;
    }
    h2 {
      font-size: 14px;
      color: #fffcf6;
      text-align: center;
      background-color: #c65d3b;
      width: 40%;
      font-weight: 400;
      padding: 10px 10px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 999px;
      font-family: "Inter", sans-serif;
      transition: transform 0.3s ease;
      cursor: pointer;
      &:hover{
        background-color: #7c351f;
      }
    }
  }
}

.home-block4 {
  margin-top: 100px;

  h1 {
    font-size: 96px;
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
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    > img {
      width: 20%;
    }
  }
}

.home-block5 {
  margin-top: 150px;

  h1 {
    font-size: 96px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: center;
    margin-bottom: 50px;
    margin: 0;
  }
  h2 {
    font-size: 96px;
    font-family: "BergamascoThin", sans-serif;
    font-weight: 800;
    color: #11243f;
    text-align: right;
    margin-bottom: 50px;
    margin: 0;
  }
  .home-tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    gap: 70px;
    .tab-item {
      position: relative;
      border-radius: 15px;
      border: 3px solid #11243f;
      padding: 20px 20px;
      color: #11243f;
      flex: 1;
      height: auto;
      .tab-number {
        font-size: 60px;
        font-family: "BergamascoThin", sans-serif;
        font-weight: 800;
      }
      .tab-title {
        font-size: 18px;
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
        margin-top: 35px;
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
      }
      p:hover {
        color: #fffcf6;
        border: 0px;
        border: 2px solid #c65d3b;
        background-color: #c65d3b;
      }
      p svg {
        cursor: pointer;
      }

      p:hover svg path {
        fill: #fffcf6;
      }

      .tab-img-dance {
        position: absolute;
        width: 230px;
        top: -30px;
        right: -85px;
      }
    }
  }
}
</style>