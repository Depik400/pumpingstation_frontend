<template>
  <div class="singup_component">
    <div class="singup_container">
      <p class="error" v-if="error.length > 0">{{ error }}</p>
      <input placeholder="email" v-model.trim="email" type="text">
      <input placeholder="login" v-model.trim="name" type="text">
      <input placeholder="password" v-model.trim="password" type="password">
      <input placeholder="Name of the organization" v-model="name_of_org" type="text">
      <input type="button" value="Зарегистрироваться" @click="singup">
    </div>
  </div>
</template>

<script>
export default {
  name: "singup",
  data() {
    return {
      error: '',
      name: '',
      password: '',
      email: '',
      name_of_org: ''
    }
  },
  methods: {
    singup: function () {
      let form = new FormData();
      form.append('name', this.name);
      form.append('password', this.password);
      form.append('email', this.email);
      form.append('name_of_org', this.name_of_org)
      this.$http.post('/register', form, {headers: {"Content-Type": "multipart/form-data"}}).then(r => {
            if (r.data.status == 201) {
             // console.log(r.data);
              localStorage.setItem('access_key', r.data.token)
              this.$router.push('/');
            }
            if (r.data.status == 202) {
              //console.log(r.data);
              this.error = `Данный ${r.data.error == 'name' ? "логин" : 'почтовый ящик'} уже занят`;
              let tempTimeout = setTimeout(() => {
                this.error = '';
                clearTimeout(tempTimeout)
              }, 3000);
            }
          }
      )
    }
  }
}
</script>

<style scoped>
.singup_component {
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.singup_container {
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