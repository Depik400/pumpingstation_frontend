<template>
  <div class="singin_component">
    <div class="singin_container">
      <input placeholder="login" v-model.trim="email" type="text">
      <input placeholder="password" v-model.trim="password" type="password">
      <input type="button" value="Войти" @click="singin">
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "singin",
  data() {
    return {
      name: '',
      password: '',
      email: ''
    }
  },
  methods: {
    ...mapActions(['AUTHSTATE']),
    singin: function () {
      let form = new FormData();
      form.append('name', this.email);
      form.append('password', this.password);
      this.$http.defaults.headers.common["Authorization"] = localStorage.getItem("access_key");
      this.$http.post('/login', form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((result) => {
        //console.log(result);
        localStorage.setItem('access_key', result.data.token);
        this.$router.push('/');
      });
    }
  }
}
</script>

<style scoped>
.singin_component {
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.singin_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

input[type=text], input[type=password] {
  margin: 10px 0;
  padding: 10px;
  text-indent: 10px;
  border-radius: 15px;
  border: 1px solid #42b983;
}

input[type=button] {
  background: rgb(48, 140, 102);
  border-radius: 15px;
  font-size: 20px;
  color: #e2e8f0;
  border: none;
  padding: 10px 30px;
}

input[type=button]:hover {
  background: #42b983;
  transition: all 0.3s linear;
}

input[type=button]:focus {
  outline: none;
}

input[type=text]:focus, input[type=password]:focus {
  outline: none;
  background: rgba(66, 185, 131, 0.37);
}

</style>
