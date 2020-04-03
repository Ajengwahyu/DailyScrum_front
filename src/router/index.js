import Vue from "vue";
import VueRouter from "vue-router";
import My_Daily_Scrum from "../views/My_Daily_Scrum.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Navbar from "../views/layouts/Navbar.vue";
import Footer from "../views/layouts/Footer.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: { default: Login }
  },
  {
    path: "/register",
    name: "register",
    component: { default: Register}
  },
  {
    path: "/",
    name: "My_Daily_Scrum",
    components: { default: My_Daily_Scrum, header: Navbar, footer: Footer },
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (store.getters.isLoggedIn) {
//       next();
//       return;
//     }
//     next("/login");
//   } else {
//     next();
//   }
// });

export default router;
