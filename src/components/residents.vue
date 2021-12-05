<template>
  <div class="residents">
    <div :class="['table_container',windowBlur?'blur':'']">
      <div class="wrapper">
        <table border="1" class="residents_list">
          <tr>
            <th>id</th>
            <th>ФИО</th>
            <th>area</th>
            <th>Дата подключения</th>
          </tr>
          <tr class="resident" v-for="(resident,index) of residents" :key="resident.id"
              @dblclick="updateResident(resident.id,index)">
            <td class="unselectable">{{ resident.id }}</td>
            <td class="unselectable">{{ resident.fio }}</td>
            <td class="unselectable">{{ resident.area }}</td>
            <td class="unselectable">{{ resident.start_date }}</td>
          </tr>
        </table>
      </div>
      <input type="button" value="Подключить нового резидента" @click="addResidentHandlerSetup">
    </div>

    <div class="add_new_resident" v-if="addResidentHandler || updateResidentHandler">
      <p @click="addResidentHandler = false; updateResidentHandler = false">[X]</p>
      <input type="text" v-model="residentName" placeholder="ФИО">
      <input type="text" v-model="residentArea" :style="residentArea > 1000000?{'background':'lightcoral'}:''" placeholder="area">
      <date-picker @selected="updateDate" :language="ru" :value="selectedDate" v-if="updateResidentHandler"/>
      <input type="button" :value="updateWindowText" @click="addNewResident">
    </div>
  </div>
</template>

<script>

import datePicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale'

export default {
  name: "residents",
  data() {
    return {
      residents: [],
      addResidentHandler: false,
      updateResidentHandler: false,
      residentName: '',
      residentArea: '',
      selectedDate: '',
      selectedUser: -1,
      ru: ru
    }
  },

  components: {
    'date-picker': datePicker
  },

  mounted() {
    this.getResidents();
  },

  computed: {
    updateWindowText() {
      if (this.addResidentHandler) {
        return 'Подключить'
      }
      if (this.updateResidentHandler) {
        return 'Обновить'
      }
      return '';
    },

    windowBlur() {
      if (this.addResidentHandler || this.updateResidentHandler) {
        return true;
      } else return false;
    }
  },

  methods: {
    getResidents: function () {
      this.$http.get('/residents').then((result) => {
        this.residents = result.data;
      })
    },

    updateDate: function (date) {
      this.selectedDate = date;
    },

    addResidentHandlerSetup: function () {
      this.residentName = '';
      this.residentArea = '';
      this.addResidentHandler = true;
    },

    updateResident(id, i) {
      this.selectedUser = id;
      this.updateResidentHandler = true;
      let tempDate = this.residents[i].start_date.split(' ')[0].split('-');
      //console.log(tempDate);
      this.selectedDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2]);
      this.residentName = this.residents[i].fio;
      this.residentArea = this.residents[i].area;

    },

    addNewResident: function () {
      let form = new FormData();

      form.append('fio', this.residentName);
      form.append('area', this.residentArea);
      if(!this.addResidentHandler){
        form.append('id',this.selectedUser);
        form.append('date', `${this.selectedDate.getFullYear()}-${this.selectedDate.getMonth() + 1}-${this.selectedDate.getDate()}`);
      }
      let url = this.addResidentHandler?'/addResident':'/updateSelectedResident';

      this.$http.post(url, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(result => {
        if (result.data.status == 201) {
          this.addResidentHandler = false;
          this.updateResidentHandler = false;
          this.getResidents();
        }
      })
    }
  }
}

</script>

<style>
.vdp-datepicker > div > input {
  margin: 10px 0;
  padding: 10px;
  text-indent: 10px;
  border-radius: 15px;
  border: 1px solid #42b983;
}
</style>

<style scoped>

.unselectable {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                         not supported by any browser */
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

.table_container {
  display: flex;
  justify-content: center;
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

th {
  padding: 10px;
}

tr {
  cursor: pointer;
}

td {
  padding: 10px;
}

.blur {
  filter: blur(8px);
}

.add_new_resident {
  background: #e2e8f0;
  padding: 40px 20px;
  border-radius: 15px;
  border: #42b983 2px solid;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  flex-direction: column;
}

.add_new_resident > p {
  position: absolute;
  top: 1px;
  right: 15px;
  cursor: pointer;
}

.add_new_resident > p:hover {
  color: #ffadad;
}

input[type=text] {
  margin: 10px 0;
  padding: 10px;
  text-indent: 10px;
  border-radius: 15px;
  border: 1px solid #42b983;
}

::-webkit-scrollbar {
  display: none;
}

</style>