import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import vStore from "../store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/singin',
    name:'singin',
    component: (() => import('../views/singin'))
  },
  {
    path:'/singup',
    name:'singup',
    component: (() => import('../views/singup'))
  },
  {
    path:'/profile/:id',
    name:'profile',
    component: (() => import('../views/profile')),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if(to.name == 'profile'){
    if(vStore.getters['AUTHSTATE'] && to.params.id == vStore.getters['NAME']){
      next();
    }
    else{
      next('/')
    }
  }
  next();
})

export default router
