<template>
  <div id="app">
    <main-header/>
    <keep-alive>
      <router-view class="main_container">

      </router-view>
    </keep-alive>

  </div>
</template>

<script>
import vHeader from './components/header'
import {mapActions} from "vuex";

export default {
  name: 'main',
  components: {
    'main-header': vHeader
  },
  beforeMount() {
    this.checkToken();
  },

  updated() {
    this.checkToken();
  },

  methods: {
    ...mapActions(['setAuthentificatedState', 'setOrganizationName', 'setName', 'setGraph']),
    setPriceArray: function () {
      this.$http.get('/getCurrentPricePair').then((r) => {
        let gr = JSON.parse(r.data.price_pairs);
        let price = [];
        for (let i = 0; i < 12; i++) {
          price.push({index: i, price: gr[i].price});
          this.setGraph(price);
        }
      }).catch(() => {
        let price = [];
        for (let i = 0; i < 12; i++) {
          price.push({index: i, price: 0});
          this.setGraph(price);
        }
      })
    },
    checkToken: function () {
      let token = localStorage.getItem('access_key');
      //console.log(token);
      this.$http.get('/testtoken', {
        headers: {
          'Authorization': token
        }
      }).then(result => {
        if (result.data.status == 201) {
          this.setAuthentificatedState(true);
          this.setOrganizationName(result.data.name);
          this.setName(result.data.name);
          this.$http.defaults.headers.common['Authorization'] = token;
          this.setPriceArray();
        } else {
          this.setAuthentificatedState(false);
        }
      }).catch(() => {
        this.setAuthentificatedState(false);
      });

    }

  }
}

</script>

<style>

body {
  margin: 0;
}

.main_container {
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
