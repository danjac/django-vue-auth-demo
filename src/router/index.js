import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/Signup.vue")
  },
  {
    path: "/submit",
    name: "SubmitPost",
    component: () =>
      import(/* webpackChunkName: "submitPost" */ "../views/SubmitPost.vue"),
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: () =>
      import(/* webpackChunkName: "postDetail" */ "../views/PostDetail.vue")
  },
  {
    path: "/post/:id/~update",
    name: "PostUpdate",
    component: () =>
      import(/* webpackChunkName: "postUpdate" */ "../views/PostUpdate.vue"),
    meta: {
      requireAuth: true
    }
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.getters.isLoggedIn) {
      next();
    } else {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router;
