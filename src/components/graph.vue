<template>
  <div class="graph">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'graph',
  data() {
    return {
      canvas: '',
      ctx: '',
      height: 400,
      width: 600,
      autoInterval: '',
      priceArray: [5, 10, 20, 30, 40, 50, 60, 80],
      monthArray: ['Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      monthPricePair: []
    }
  },
  props: [
    'state',
    'pumpingPrice'
  ],

  created() {
    // window.addEventListener("resize", this.resizeCanvas);
  },
  destroyed() {
    //window.removeEventListener("resize", this.resizeCanvas);
  },

  mounted() {

    this.canvas = document.getElementById('canvas');
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.height = 400;
      this.width = 900;
      this.ctx.canvas.height = this.height
      this.ctx.canvas.width = this.width
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.setupGraph();
    }
    if (this.state == 'auto') {
      this.priceArray.reverse();
      this.generateMonthPricePair();
      this.autoFill();
      this.autoInterval = setInterval(() => {
        this.canvasRecreate();
      }, 5000);
    }
    if (this.state == 'fill77') {
      //
      // console.log('here');
      this.setupGraph();
      this.autoFill(20);
    }
  },

  methods: {

    resizeCanvas: function () {
      this.ctx.canvas.width = 0.6 * document.body.clientWidth;
      this.canvasRecreate();
    },

    canvasRecreate: function () {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.setupGraph();
      this.generateMonthPricePair();
      this.autoFill(10);
    },

    createGraphLines: function (priceStep, monthStep) {
      this.priceArray.forEach((item, index) => {
        // console.log(item);
        this.ctx.font = "16px serif";
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.fillText(item, 10, (1 + index) * priceStep);
      })

      this.monthArray.forEach((item, index) => {
        this.ctx.fillText(item, (1 + index) * monthStep - 40 - 30, this.height - 10);
      });
    },

    autoFill: function (xCorrective) {
      let priceStep = (this.height - 40) / this.priceArray.length;
      let monthStep = (this.width) / this.monthArray.length;

      this.createGraphLines(priceStep, monthStep)
      this.setupBackground(priceStep, monthStep);

      this.ctx.lineWidth = 0;
      this.ctx.moveTo(40, this.height - 40);
      this.monthPricePair.forEach((item) => {
        //console.log(item);
        let x = monthStep * (item.month) + 30 + xCorrective;
        let y = (priceStep) * (item.price + 1);

        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        if (document.body.clientWidth <= 600 && this.priceArray[item.price] != 0) {
          this.ctx.fillStyle = "#000";
          this.ctx.fillText(this.priceArray[item.price], x, y - 15);
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = 'orange';
        this.ctx.arc(x + 1, y, 4, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.strokeStyle = '#42b983';
        this.ctx.lineWidth = 2;
        xCorrective = 0;
      })
    },
    setupGraph: function () {

      this.ctx.strokeStyle = "orange";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(40, 10)
      this.ctx.lineTo(40, this.height - 40);
      this.ctx.lineTo(this.width - 40, this.height - 40);
      this.ctx.stroke();
    },
    setupBackground: function (priceStep, monthStep) {
      this.ctx.strokeStyle = "gray";
      this.ctx.lineWidth = 1;
      for (let i = priceStep; i < this.height - priceStep; i += priceStep) {
        this.ctx.beginPath();
        this.ctx.moveTo(monthStep - 30, i);
        this.ctx.lineTo(this.width - monthStep + 30, i);
        this.ctx.stroke();
      }

      for (let j = monthStep + 30; j < this.width; j += monthStep) {
        this.ctx.beginPath();
        this.ctx.moveTo(j, priceStep)
        this.ctx.lineTo(j, this.height - 40);
        this.ctx.stroke();
      }
    },

    generateMonthPricePair: function () {
      this.monthPricePair.splice(0, this.monthPricePair.length);
      this.monthArray.forEach((month, index) => {
        let randomIndex = Math.floor(Math.random() * this.priceArray.length);
        //console.log(randomIndex + ' ' + this.priceArray[randomIndex]);
        this.monthPricePair.push({month: index, price: randomIndex})
      })
    },

    setPairPrice(price) {
      this.priceArray = [];
      this.monthPricePair = [];

      price.forEach((item) => {
        this.priceArray.push(item.price);
      })
      this.priceArray.push(0);
      this.priceArray = [...new Set(this.priceArray)];
      this.priceArray.sort((a, b) => b - a);
      //console.log(price);
      for (let i = 0; i < 12; i++) {
        if (price[i]?.index == i) {
          //console.log(i);
          let priceIndex = this.priceArray.findIndex((number) => number == price[i].price);
          this.monthPricePair.push({month: i, price: priceIndex});
        } else {
          this.monthPricePair.push({month: i, price: this.priceArray.length - 1});
        }
        //console.log(this.monthPricePair[i]);
      }
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.setupGraph();
      this.autoFill(10);
    }


  },
  computed: {
    ...mapGetters['GRAPH'],
    canvasHeight: function () {
      return this.height
    },

    canvasWidth: function () {
      return this.width;
    }
  },
}
</script>

<style scoped>
#canvas {
  margin: 0 auto;
}

.graph {
  display: inline-flex;
  max-width: 900px;

}

@media screen and (max-width: 900px) {
  .graph {
    max-width: 600px;
    overflow-x: scroll;
  }
}

@media screen and (max-width: 600px) {
  .graph {
    max-width: 400px;
    overflow-x: scroll;
  }
}

</style>