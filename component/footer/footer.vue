<template>
  <div class="footer-container">
    <div class="footer">
      <div class="footer-1">
        <h1 class="footer-logo">TerraDanza</h1>
        <p>+1 (7635) 547-12-97</p>
        <p>support@TerraDanza</p>
      </div>
      <div class="footer-2">
        <div class="">
          <a href="">Правовая инф.</a>
          <a href="">Права</a>
          <a href="">Политика конф.</a>
        </div>
        <div class="">
          <a href="">Система<br />информирования</a>
          <a href="">Cookie</a>
          <a href="">Использование<br />файлов cookie</a>
        </div>
      </div>
      <div class="footer-3">
        <p>Подпишитесь на наши новости</p>
        <div class="footer-3-view">
          <input type="text" placeholder="Ваша почта" />
          <div class="footer-3-button">-></div>
        </div>
        <p>
          Хотите быть в курсе новых направлений, получать ссылки на полезные
          видео и узнавать о выходе курсов первыми? Оставьте email — мы будем
          писать только по делу.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss">
@font-face {
  font-family: "NicoMoji";
  src: url("@/assets/fonts/NicoMoji-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.footer-container {
  width: 100%;
  background-color: #11243f;
  padding: 20px 0;
  color: #fffcf6;
  margin-top: 100px;
}

.footer {
  padding: 0 75px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1234px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
}

.footer-1,
.footer-3 {
  font-family: "Inter", sans-serif;
  text-decoration: none;
  color: #fffcf6;
  width: 30%;
}

.footer-2 {
  width: 40%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 100;
    width: 100%;
    gap: 20px;
    > a {
      width: 100%;
      font-weight: 100;
      font-family: "Inter", sans-serif;
      text-decoration: none;
      color: #fffcf6;
    }
  }
}

.footer-3 {
  .footer-3-view {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  input {
    padding: 15px 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    width: 50%;
    border: 2px solid white;
  }
  .footer-3-button {
    padding: 15px 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: auto;
    width: 10%;
    background-color: #c65d3b;
  }
}

.footer-logo {
  font-family: "NicoMoji", sans-serif;
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 140px;
  padding: 0;
}
</style>
