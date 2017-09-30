<template>
    <div id="homepage">
        <header-bar></header-bar>
        <router-view></router-view>
    </div>
</template>

<script>
    import headerBar from '../common/headerBar/HeaderBar.vue'
    export default {
      created() {
          
      },
      components: {
        headerBar
      },
      data: function() {
          return {
            
          }
      }
    }
</script>

<style lang="scss" scoped="" type="text/css">

</style>
