# 演示

<vuep template="#demo1"></vuep>

<script type="text/x-template" id="demo1">
<style>
  .main {
    color: #2c3e50;
  }
  .text {
    color: #4fc08d;
  }
</style>

<template>
  <div class="main">
    <h2> Hello <span class="text">{{ name }}</span>!</h2>
    <h2>Features</h2>
    <ul>
      <li v-for="text in features">{{ text }}</li>
    </ul>
  </div>
</template>

<script>
  module.exports ={
    data () {
      return {
        name: '名称',
        features: [
          'Vue component spec',
          'Scoped style',
          'UMD and CommonJS build'
        ]
      }
    }
  }
</script>

</script>
