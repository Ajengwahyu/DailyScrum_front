<template>
  <div id="app">
    <div class="container-scroller">
      <router-view name="header" />
      <div class="wrapper">
      <router-view />
    </div>
    <router-view name="footer" />
  </div>
  </div>
</template>

<script>
// import Navbar from "./views/layouts/Navbar.vue";

export default {
  name: "App",
  // components: { "Navbar":Navbar },

  data: function() {
    return {
      status_login: ""
    };
  }
  // computed: {
  //   loaded() {
  //     return this.$store.state.loadState == "loaded";
  //   }
  // }
};
</script>
