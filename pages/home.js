const Home = {
  template: `
  <div>
    <navigation />
    <div class="container-md my-4">
      <div class="row">
        <div class='col-md-4 col-sm-6' v-for="i in posts">

        <!-- card -->
        <div class='card' data-bs-toggle="modal" :data-bs-target="'#'+i.post_id">
          <img :src="i.image" :alt="i.title" class="card-img-top" />
          <div class="card-body">
            <h4 class="card-title">{{ i.title }}</h4>
          </div>
        </div>

        <!-- post modal -->
        <div class="modal fade" :id="i.post_id" tabindex="-1" :aria-labelledby="i.post_id+'label'" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" :id="i.post_id+'label'">{{ i.title }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body card">
                <img :src="i.image" :alt="i.title" class="card-img-top" />
                <div class="card-body">
                  <p class="card-text">{{ i.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end of post modal -->
        </div>
      </div>
    </div>
    <upload-post />
    <search />
  </div>
  `,
  data: function() {
    return {
      posts: []
    }
  },
  beforeCreate: function() {
    cookieStore.get("Token").then(token => {
      if (token.value == '0') {
        this.$router.push('/verify')
      } else {
        fetch('http://127.0.0.1:5000/api/auth', {credentials: 'include'})
          .then(res => {
            switch (res.status) {
              case 200:
                res.json().then(posts => this.posts = posts.posts)
                break;
              case 400:
                res.text().then(msg => alert(msg))
                this.$router.push('login')
                break;
              case 401:
                res.text().then(msg => alert(msg))
                this.$router.push('login')
                break;
            }
          })
      }
    }).catch(err => this.$router.push('/login'))
  },
  methods: {
    logout: function() {
      document.cookie = ''
      window.location.href = '#/login'
    }
  },
  components: {
    'upload-post': () => import('../components/upload-post.js'),
    'navigation': () => import ('../components/navigation.js'),
    'search': () => import('../components/search.js'),
  }
}