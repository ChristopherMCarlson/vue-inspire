<template>
  <v-app :style="{ backgroundImage: 'url(' + bgImg + ')' }" style="background-size: cover; ">
    <v-content class="test-colors" :style="{ backgroundColor: 'rgba(0, 0, 0, ' + opacity + ')' } ">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

  export default {
    name: 'App',
    data() {
      return {

      }
    },
    computed: {
      bgImg() {
        return this.$store.state.bgImg
      },
      opacity() {
        return this.$store.state.opacity
      }
    }
  }
</script>

<style>
  .test-colors {
    height: 100%;
    width: 100%;
  }
</style>