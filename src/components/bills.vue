<template>
  <div class="bills">
    <div :class="['table_container']">
      <div class="select_container">
        <select class="month" v-model="currentMonth">
          <option v-for="(item,index) of monthArray" :key="index" :value="item">{{ item }}</option>
        </select>
        <select class="year" v-model="currentYear">
          <option v-for="(item,index) of yearArray" :key="index" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="wrapper">
        <table border="1" class="residents_list">
          <tr>
            <th>ФИО</th>
            <th>Цена за куб</th>
            <th>Количество кубов</th>
            <th>Оплачено</th>
            <th>Начало периода</th>
            <th>Конец периода</th>
          </tr>
          <tr class="resident" v-for="(resident) of residentsList" :key="resident.id">
            <td>{{ resident.fio }}</td>
            <td>{{
                resident.amount_rub / resident.amount_volume
              }}
            </td>
            <td>{{ resident.amount_volume }}</td>
            <td>{{ resident.amount_rub }}</td>
            <td>{{ resident.begin_date }}</td>
            <td>{{ resident.end_date }}</td>
          </tr>
        </table>
      </div>
      <input type="button" value="Обновить" @click="getResidentsWithBills">
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";


export default {
  name: "bills",
  data() {
    return {
      residents: [],
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
    this.setupDateSelector();
    this.getResidentsWithBills();
  },

  methods: {
    getResidentsWithBills: function () {
      //console.log('get bills');
      this.$http.get('/residentsWithBills', {params: {date: this.date}}).then((r) => {
        this.residents = r.data;
      })
    },

    setupDateSelector: function () {
      let currentDate = new Date();
      let currentMonth = currentDate.getMonth() + 1;
      let currentYear = currentDate.getFullYear();
      this.monthArray.splice(currentMonth, 12 - currentMonth);
      for (let i = this.startMonth; i <= currentYear; i++) {
        this.yearArray.push(i);
      }
      this.currentYear = currentYear;
      this.currentMonth = this.monthArray[currentMonth - 1];
    }
  },
  watch: {
    currentYear() {
      this.getResidentsWithBills();
    }
    ,
    currentMonth() {
      this.getResidentsWithBills();
    }

  },
  computed: {
    ...mapGetters(['GRAPH']),

    date() {
      return this.currentYear + '-' + (this.monthArray.findIndex((item) => item == this.currentMonth) + 1) + '-01';
    },

    residentsList() {
      return this.residents;
    }
  }
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
  flex-direction: column;
  align-items: center;
}

table {
  border-collapse: collapse;
  border-style: hidden;
  border-spacing: 0;
  border-radius: 15px;
}

.wrapper {
  margin-top: 30px;
  overflow: auto;
  border-radius: 6px;
  border: 3px solid #42b983;
}

.table_container {
  height: 700px;
  overflow-y: hidden;
}

input[type=button] {
  margin-top: 30px;
  background: rgb(48, 140, 102);
  border-radius: 15px;
  font-size: 20px;
  color: #e2e8f0;
  border: none;
  padding: 10px 30px;
}

th {
  padding: 10px;
}

td {
  padding: 10px;
}
</style>