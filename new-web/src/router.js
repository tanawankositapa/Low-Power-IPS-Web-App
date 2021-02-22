import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue"
import Map from "./views/Map.vue"
import Register from "./views/Register.vue"
import Information from "./views/Information.vue"
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
    meta: {requiresAuth: true}
    
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    
  },
  {
    path: "/information",
    name: "Information",
    component: Information,
    
  },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
