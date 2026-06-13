<template>
  <div class="footer-container">
    <div class="footer">
      <div class="footer-1">
        <h1 class="footer-logo">TerraDanza</h1>
        <div class="footer-data-view">
          <p class="footer-number">+1 (7635) 547-12-97</p>
          <p class="footer-mail">support@TerraDanza</p>
        </div>
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
        <p class="footer-3-sub">Подпишитесь на наши новости</p>
        <div class="footer-3-view">
          <input type="text" placeholder="Ваша почта" />
          <div class="footer-3-button"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5198 17.627L20.1893 10.0724C20.8955 9.37647 20.8955 8.24842 20.1893 7.5546L12.5198 7.05719e-05L9.9631 2.5195L14.546 7.03277H0L0 10.5937H14.546L9.9631 15.1086L12.5198 17.627Z" fill="#FFFEFB"/>
</svg></div>
        </div>
        <p class="footer-3-dis">
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
  color: #fff;
  margin-top: 100px;
}

.footer {
  padding: 45px 103px 70px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1920px;
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
  color: #fff;
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
    font-size: 18.9px;
    font-weight: 100;
    width: 100%;
    gap: 16px;
    margin-top: auto;
    margin-bottom: auto;
    > a {
      width: 100%;
      font-weight: 100;
      font-family: "Inter", sans-serif;
      text-decoration: none;
      color: #a4a9b3;
    }
  }
}

.footer-3 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24.41px;
  .footer-3-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 80%;
  }
  input {
    padding: 15px 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    width: 50%;
    font-size: 18.98px;
    border: 2px solid white;
  }
  .footer-3-button {
    padding: 19px 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: auto;
    display: flex;
    width: 10%;
    background-color: #c65d3b;
    svg{
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.footer-logo {
  font-family: "NicoMoji", sans-serif;
  font-size: 40px;
  font-weight: 300;
  margin-bottom: 102px;
  padding: 0;
}

.footer-number{
  font-size: 23.63px;
  font-weight: 300;
  padding: 0;
  margin: 0;
}
.footer-mail{
  font-size: 18.9px;
  font-weight: 300;
  padding: 0;
  margin: 20px 0 0 0;
}
.footer-3-sub{
  font-size: 21.69px;
  font-weight: 300;
  padding: 0;
  margin: 0;
}
.footer-3-dis{
  font-weight: 100;
  font-family: "Inter", sans-serif;
  color: #a4a9b3;
  margin: 0;
  font-size: 16.27px;
  width: 90%;
}

@media (max-width: 1979px) {
  .footer-container{
    margin: 100px 0 0 0;
    padding: 0;
  }
  .footer{
    padding: 30px 20px;
    flex-direction: column;
    margin: 0;
    .footer-2{
      display: none;
    }
    .footer-1, .footer-3{
      width: 100%;
    }
    .footer-1{
      display: flex;
      flex-direction: row;
      align-items: start;
      justify-content: space-between;
      margin-bottom: 10px;
      .footer-logo{
        font-size: 20px;
        margin: 0;
      }
      .footer-data-view{
        display: flex;
        flex-direction: column;
        text-align: right;
        .footer-number{
          font-size: 14px;
          margin-bottom: 5px;
        }
        .footer-mail{
          margin: 0;
          font-size: 14px;
        }
      }
    }
    .footer-3{
      margin: 0;
      gap: 0;
      .footer-3-sub{
        font-size: 14px;
        
      }
      .footer-3-view{
        width: 100%;
        margin: 10px 0;
        >input{
          width: 80%;
          font-size: 16px;
        }
        .footer-3-button{
          padding: 18.5px 10px;
        }
      }
      .footer-3-dis{
        font-size: 13px;
      }
    }
  }
}

</style>
