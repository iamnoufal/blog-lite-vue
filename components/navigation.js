export default Vue.component('navigation', {
  template: `
  <nav class="navbar transparent navbar-expand bg-light">
    <div class="container-fluid">
      <div class="navbar-brand h4 mx-4 my-0">Blog Lite</div>
    </div>
    <ul class="navbar-nav fs-5">
      <a class="nav-item me-5 text-black" href='#' data-bs-toggle="modal" data-bs-target="#search"><i class="bi bi-search"></i></a>
      <a class="nav-item me-5 text-black" href='#' data-bs-toggle="modal" data-bs-target="#uploadPost"><i class="bi bi-plus-square"></i></a>
      <router-link class="nav-item text-black" to="/profile"><i class="bi bi-person-circle"></i></router-link>
      <a class="nav-item mx-5 text-black" href='#' @click='logout'><i class="bi bi-box-arrow-right"></i></a>
    </ul>
  </nav>
  `,
  methods: {
    logout: function() {
      cookieStore.delete('Token')
      cookieStore.delete('User')
      this.$router.push('login')
    }
  },
})