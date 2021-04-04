import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue"
import Map from "./views/Map.vue"
import Register from "./views/Register.vue"
import Information from "./views/Information.vue"

function guardMyroute(to, from, next)
{
 var isAuthenticated= false;

if(localStorage.getItem('Status'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated) 
 {
  next(); 
 } 
 else
 {
  next('/'); 
 }
}
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    
  },
  {
    path: "/map",
    name: "Map",
    beforeEnter : guardMyroute,
    component: Map,
    // meta: {requiresAuth: true}
    
  },
  {
    path: "/information",
    name: "Information",
    beforeEnter : guardMyroute,
    component: Information,
    alias: "/information",
  },
  {
    path: "/register",
    name: "Register",
    beforeEnter : guardMyroute,
    component: Register,
    alias: "/register",
  }
  
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
