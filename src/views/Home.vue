<template>
  <div class="home">
    <div class="start-page_container">
      <start-page class="start_page"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import startPage from '@/components/startPage.vue'
import {mapActions} from 'vuex'

export default {
  name: 'Home',
  components: {
    'start-page': startPage
  },
  mounted() {

  },
  methods: {
    ...mapActions(['setName'])
  }
}
</script>

<style>
.home {
  height: 100%;
}

.start-page_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

@media screen and (max-width: 500px) {
  .start-page_container {
    margin-top: 50px;
  }
}
</style>
