import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/show/:showid',
    name: 'seat',
    meta: {login : true},
    component: () => import('../views/Seat.vue')
  },
  {
    path: '/ticket/:orderid',
    name: 'ticket',
    meta: {login : true},
    component: () => import('../views/Ticket.vue')
  },
  {
    path: '/profile/:cid',
    name: 'profile',
    meta: {login : true},
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/user/signup',
    name: 'signup',
    meta: { guess: true },
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/user/login',
    name: 'login',
    meta: { guess: true },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/addmovie',
    name: 'addmovie',
    meta: { login: true },
    component: () => import('../views/AddMovie.vue')
  },
]

const router = new VueRouter({ routes })
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.login && !isLoggedIn) {
    alert('Please login first!')
    next({ path: '/user/login' })
  }

  if (to.meta.guess && isLoggedIn) {
    alert("You've already logged in")
    next({ path: '/' })
  }

  next()
})

export default router
