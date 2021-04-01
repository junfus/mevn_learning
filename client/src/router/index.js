import Vue from "vue";
import VueRouter from "vue-router";
import Category from "../views/Category.vue";
import Record from "../views/Record.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/category",
    name: "category",
    component: Category,
  },
  {
    path: "/record/:cid",
    name: "record",
    component: Record,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
