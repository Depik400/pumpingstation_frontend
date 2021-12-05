doc
<template>
  <div class="start_page">
    <h1>Ты хозяин водокачки? Хочешь облегчить себе жизнь?</h1>
    <h3>Тогда позволь стать твоим помощником</h3>
    <h3>Удобные графики для контроля цены кубометра воды</h3>
    <graph state="auto"></graph>
  </div>
</template>

<script>
import graph from './graph'

export default {
  name: 'StartPage',
  components: {
    graph
  },
  props: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
