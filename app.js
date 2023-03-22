const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/signup",
    component: SignUp
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/user/:user_id',
    component: User
  },
  {
    path: "/verify",
    component: Verify
  }
]

const router = new VueRouter({routes})

const app = new Vue({
  el: "#app",
  router
})