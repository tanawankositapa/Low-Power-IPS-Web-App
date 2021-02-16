import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue"
import Map from "./views/Map.vue"
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
    
  },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
