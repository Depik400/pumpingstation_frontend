<template>
  <div class="tariffs">
    <div :style="successWindow?{filter:'blur(4px)'}:{}">
    <graph ref="graph"/>
    <div class="price_input">
      <select name="" id="select" class="month" @change="updateIndex">
        <option value="Январь" selected>Январь</option>
        <option value="Ферваль">Февраль</option>
        <option value="Март">Март</option>
        <option value="Апрель">Апрель</option>
        <option value="Май">Май</option>
        <option value="Июнь">Июнь</option>
        <option value="Июль">Июль</option>
        <option value="Август">Август</option>
        <option value="Сентябрь">Сентябрь</option>
        <option value="Октябрь">Октябрь</option>
        <option value="Ноябрь">Ноябрь</option>
        <option value="Декабрь">Декабрь</option>
      </select>
      <input type="number" v-model="currentPrice" @keyup.enter="updatePrice">
    </div>
    </div>
    <input type="button" class="sumbit_btn" @click="sendNewPriceToServer" value="Подвердить изменения">
    <div class="success_window" v-if="successWindow">
      <p>Вы успешно обновили цены</p>
      <input type="button" value="Закрыть" @click="successWindow = false">
    </div>
  </div>
</template>

<script>
import vGraph from '../components/graph'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "tariffs",
  components:
      {graph: vGraph},
  data() {
    return {
      pairs: [],
      currentPrice: 0,
      currentIndex: 0,
      check: true,
      price: [],
      successWindow: false
    }
  },
  mounted() {
    this.$http.get('/getCurrentPricePair').then((r) => {
      let gr = JSON.parse(r.data.price_pairs);
      for (let i = 0; i < 12; i++) {
        this.price.push({index: i, price: gr[i].price});
      }
      this.$refs.graph.setPairPrice(this.price);
    }).catch(() => {
      for (let i = 0; i < 12; i++) {
        this.price.push({index: i, price: 0});
      }
      this.setGraph(this.price);
      this.$refs.graph.setPairPrice(this.price);
    })

  },

  computed: {
    ...
        mapGetters(['GRAPH']),
  }
  ,

  watch: {
    currentPrice: function () {
      this.updatePrice();
    }
  }
  ,

  methods: {
    ...
        mapActions(['setGraph']),


    sendNewPriceToServer: function () {
      let data = new FormData();
      let updatedGraph = this.price.map(item => {
        return {month: item.index, price: item.price};
      });
      data.append('price_pair', JSON.stringify(updatedGraph));

      this.$http.post('/updateCurrentPricePair', data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(() => {
          this.successWindow = true;
      })
    }

    ,

    updateIndex: function (e) {
      this.currentIndex = e.target.options.selectedIndex;
    }
    ,
    updatePrice: function () {
      this.setGraph(this.price);
      if (this.currentIndex != -1 && this.currentPrice != '') {
        let index = this.price.findIndex(item => item.index == this.currentIndex);
        if (index != -1) {
          this.price[index].price = this.currentPrice - 1 + 1;
        } else {
          this.price.push({index: this.currentIndex, price: this.currentPrice});
        }
        this.$refs.graph.setPairPrice(this.price);
      }
    }
  }

}
</script>

<style scoped>

.price_input {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

select {
  border-radius: 15px 0 0 15px;
  padding: 15px;
  font-size: 16px;
  background: #e2e8f0;
  border: #42b983 1px solid;
}

input[type=button] {
  margin-top: 30px;
  background: rgb(48, 140, 102);
  border-radius: 15px;
  font-size: 20px;
  color: #e2e8f0;
  border: none;
  padding: 10px 30px;
  transition: all 0.2s ease;
}

input[type=button]:hover {
  font-size: 22px;
}

input[type="number"] {
  padding: 15px;
  font-size: 16px;
  width: 40px;
  text-align: center;
  border: #42b983 1px solid;
  border-radius: 0 15px 15px 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.success_window{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: white;
  border: 2px solid #42b983;
  padding: 10px;
  border-radius: 15px;
}

.success_window > p{
  font-size: 18px;
}
</style>