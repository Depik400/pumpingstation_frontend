<template>
  <div class="recording">
    <div class="table_container" v-if="periodOfResidends.length > 0">
      <div class="select_container">
        <select class="month" v-model="currentMonth">
          <option v-for="(item,index) of monthArray" :key="index" :value="item">{{ item }}</option>
        </select>
        <select class="year"  v-model="currentYear">
          <option v-for="(item,index) of yearArray" :key="index" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="wrapper">
        <table border="1" class="residents_list">
          <tr>
            <th>id</th>
            <th>ФИО</th>
            <th>Цена</th>
            <th>Показания</th>
          </tr>
          <tr class="resident" v-for="(resident,index) of FilteredArray" :key="resident.id"
              :style="(resident.selected && twoStepCheck)?{background:'#F6CD9FFF'}:''">
            <td>{{ resident.id }}</td>
            <td>{{ resident.fio }}</td>
            <td>{{ GRAPH[monthIndex].price }}</td>
            <td><input type="number" value="" placeholder="0"
                       @change="writeAmount($event.target.value,resident.id,index)"
                       :style="(resident.selected && twoStepCheck)?{background:'#F6CD9FFF'}:''"></td>
          </tr>
        </table>
      </div>
    </div>
    <h4 v-if="periodOfResidends.length <= 0" style="margin-top: 50px;">Показания за этот месяц уже внесены</h4>
    <input type="button" value="Подтвердить" v-if="!twoStepCheck"
           :style="periodOfResidends.length <= 0?{display:'none'}:''" @click="twoStepCheck = true">
    <input type="button" value="Я уверен" v-if="twoStepCheck" @click="setDataToServer">
    <input type="button" value="Нет" v-if="twoStepCheck" @click="twoStepCheck = false">
    <p v-if="twoStepCheck">Вы собираетесь записать выделенные записи</p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Recording",
  data() {
    return {
      periodOfResidends: [],
      residentsAmount: [],
      twoStepCheck: false,
      startMonth: 2020,
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
      yearArray: [],
      currentYear: '',
      currentMonth: ''
    }
  },

  mounted() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    this.monthArray.splice(currentMonth, 12 - currentMonth);
    for (let i = this.startMonth; i <= currentYear; i++) {
      this.yearArray.push(i);
    }
    this.currentYear = currentYear;
    this.currentMonth = this.monthArray[currentMonth - 1];
    this.setupArray();
  },

  methods: {
    setupArray: function () {
      //console.log(this.date);
      this.$http.get('/residentsPumpMeter', {
        params: {date: this.date}
      }).then(r => {
        this.periodOfResidends = r.data
        this.periodOfResidends.forEach(item => {
          item.selected = false;
        })
      });
    },

    setDataToServer: function () {
      let form = new FormData();
      form.append('residentsAmount', JSON.stringify(this.residentsAmount));
      form.append('date', this.date)
      //console.log(JSON.stringify(this.residentsAmount));
      this.$http.post('/addPumpRecord', form, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => this.setupArray()).catch(err => console.log(err));
      this.twoStepCheck = false;
    },

    writeAmount: function (value, id, index) {
      //console.log(value, id, index)
      let tmp = this.residentsAmount.findIndex(value => {
        return value.residentIndex == id
      })
      //console.log(tmp);
      if (tmp != -1) {
        //console.log('here');
        this.residentsAmount[index].amount = value;
      } else {
        this.residentsAmount.push({residentIndex: id, amount: value});
      }
      if (value != '')
        this.periodOfResidends[index].selected = true;
      else {
        this.periodOfResidends[index].selected = false;
      }
    },
  },
  watch: {
    currentYear() {
      this.setupArray();
    },
    currentMonth() {
      this.setupArray();
    }
  },
  computed: {
    FilteredArray() {
      return this.periodOfResidends;
    },
    ...mapGetters(['GRAPH']),
    date() {
      return this.currentYear + '-' + (this.monthArray.findIndex((item) => item == this.currentMonth) + 1) + '-01';
    }
    ,
    monthIndex(){
      return this.monthArray.findIndex((item) => item == this.currentMonth);
    }
  },

}
</script>

<style scoped>

.select_container {
  margin-top: 50px;
  display: flex;
}

select {
  outline: none;
  font-size: 16px;
}

.month {
  padding: 10px;
  color: #e2e8f0;
  border-radius: 15px 0 0 15px;
  border: #42b983 1px solid;
  background: #42b983;
}

.month:focus {
  border-radius: 15px 0 0 0;
}

.year {
  padding: 10px;
  border-radius: 0 15px 15px 0;
  border: #42b983 1px solid;
}

.year:focus {
  border-radius: 0 15px 0 0;
}

.table_container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 700px;
  overflow-y: hidden;
}

::-webkit-scrollbar {
  display: none;
}

input[type=button] {
  margin-top: 30px;
  background: rgb(48, 140, 102);
  border-radius: 15px;
  font-size: 20px;
  color: #e2e8f0;
  border: none;
  padding: 10px 30px;
  transition: all 0.2s ease-in-out;
}

input[type=button]:hover {
  font-size: 22px;
}

.wrapper {
  margin-top: 30px;
  overflow: auto;
  border-radius: 6px;
  border: 3px solid #42b983;
}

table {
  border-collapse: collapse;
  border-style: hidden;
  border-spacing: 0;
  border-radius: 15px;
}

input[type="number"] {
  padding: 15px;
  font-size: 16px;
  width: 40px;
  text-align: center;
  border: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:focus {
  border: none;
  outline: none;
  border-bottom: 1px solid #42b983;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

th {
  padding: 10px;
}

td {
  padding: 10px;
}
</style>