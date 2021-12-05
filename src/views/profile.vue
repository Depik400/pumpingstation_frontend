<template>
  <div class="profile">
    <div class="profile_button_container">
      <input class="profile_button" @click="currentState = 1" type="button" value="Контроль тарифов">
      <input class="profile_button" @click="currentState = 2" type="button" value="Резиденты">
      <input class="profile_button" @click="currentState = 3" type="button" value="Оплаченные квитанции">
      <input class="profile_button" @click="currentState = 4" type="button" value="Внесение показаний">
    </div>
    <tariffs :style="currentState == 1 ? {display:'block'}:{display: 'none'}"/>
    <residents :style="currentState == 2 ? {display:'block'}:{display: 'none'}"/>
    <bills :style="currentState == 3 ? {display:'block'}:{display: 'none'}"/>
    <recording :style="currentState == 4 ? {display:'block'}:{display: 'none'}"/>
  </div>
</template>

<script>
import vTariffs from "../components/tariffs";
import vResidents from "../components/residents";
import vRecording from "../components/recording";
import vBills from '../components/bills';

export default {
  name: "profile",
  components:
      {
        tariffs: vTariffs,
        residents: vResidents,
        recording: vRecording,
        bills: vBills
      },
  data() {
    return {
      currentState: 1
    }
  }
}
</script>

<style scoped>

.profile_button_container {
  display: inline-flex;
  margin: 30px 0 auto;
  flex-wrap: wrap;
}

.profile_button {
  padding: 30px;
  font-size: 16px;
  margin: 10px 15px;
  color: white;
  font-size: 16px;
  background: #42b983;
  border-radius: 15px;
  border: none;
  transition: all 0.15s linear;
}

@media screen and (max-width: 400px) {
  .profile_button_container {
    flex-direction: column;
  }
}

.profile_button:hover {
  font-size: 18px;
  box-shadow: 0px 0px 15px #42b983;
}

</style>