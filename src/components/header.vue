<template>
  <div class="header_container">
    <header class="main_header">
      <router-link to="/" class="main_link link">Главная</router-link>
        <ul v-if="AUTHSTATE" class="links_container authenticated">
          <li class="authenticated_link">
            <router-link class="link" :to="{name: 'profile', params: {id: NAME}}">Профиль</router-link>
          </li>
          <li class="authenticated_link" @click="logout">
            <router-link class="link" to="#" >Выход</router-link>
          </li>
        </ul>
      <ul class="links_container not_authenticated" v-if="!AUTHSTATE">
        <li class="not_authenticated_link">
          <router-link class="link" to="/singin">Войти</router-link>
        </li>
        <li class="not_authenticated_link">
          <router-link class="link" to="/singup">Зарегистрироваться</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  name: "header",
  computed:{
    ...mapGetters(['AUTHSTATE','NAME'])
  },
  methods:{
    logout: function (){
      //console.log('here');
      this.$http.post('/logout').then(result => {
        if(result.data.status != 500){
          //console.log(result);
          localStorage.removeItem('access_key');
          this.$router.push('/');
        }
      })
    }
  }
}
</script>

<style>
 .header_container{
   background: #42b983;
   font-family: Avenir, Helvetica, Arial, sans-serif;
   color: white;
 }

 .main_header{
   display: flex;
   justify-content: space-between;
   align-items: center;
   max-width: 1014px;
   margin: 0 auto;
 }

 ul{
   list-style: none;
 }

 .links_container > li {
   margin: 0px 10px;
 }

 .link{
   text-decoration: none;
   color: #ffffff;
   font-size: 16px;
 }

 .main_link{
   font-size: 20px;
 }

 .links_container{
   display: flex;
   justify-content: space-between;
 }
</style>