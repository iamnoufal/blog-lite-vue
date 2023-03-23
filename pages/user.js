const User = {
  template: `
  <div>
    <navigation />

    <!-- profile -->
    <div class="container-md dim-bg my-3 p-3 rounded">
      <div class="row">
        <div class='col-sm-4 col-md-2 px-4'>
          <img :src='image' :alt='name' style="width:100px;height:100px;border-radius:50%" />
        </div>
        <div class='col d-flex justify-content-between align-items-start'>
          <div class="">
            <h4>{{ name }}</h4>
            <p>{{ about }}</p>
            <a href="#" class="text-black" data-bs-toggle="modal" data-bs-target="#Followers">{{ followers_list.length }} followers</a>
            <a href="#" class="text-black ms-3" data-bs-toggle="modal" data-bs-target="#Following">{{ following_list.length }} following</a>
          </div>
          <button class="btn btn-outline-dark" v-if='following' @click="unfollow(user_id, name)">Unfollow</button>
          <button class="btn btn-primary" v-else @click='follow(user_id, name)'>Follow</button>
        </div>
      </div>
    </div>

    <!-- posts -->
    <div class="container-md px-0">
      <div class="row">

        <!-- post -->
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
                  <button type="button" class="btn-close" :id="i.post_id+'-dismiss'" data-bs-dismiss="modal" aria-label="Close"></button>
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
        <!-- end of posts loop -->
      </div>
    </div>
    <!-- end of posts -->

    <upload-post />
    <search />
    <user-list :list="followers_list" type="Followers" />
    <user-list :list="following_list" type="Following" />
  </div>
  `,
  data: function() {
    return {
      user_id: "",
      email: "",
      created_on: "",
      followers_list: [],
      following_list: [],
      last_login: "",
      posts: [],
      name: '',
      image: '',
      about: '',
      following: false
    }
  },
  beforeCreate: function() {
    cookieStore.get("Token").then(token => {
      if (token.value == '0') {
        this.$router.push('/verify')
      } else {
        cookieStore.get('User').then(data => {
          if (data != null && data.value == this.$route.params.user_id) {
            this.$router.push('/profile')
          } else {
            fetch('http://127.0.0.1:5000/api/user/'+this.$route.params.user_id)
              .then(res => {
                switch (res.status) {
                  case 200:
                    res.json().then(data => {
                      this.created_on = data.created_on
                      this.email = data.email
                      this.followers_list = data.followers_list
                      this.following_list = data.following_list
                      this.last_login = data.last_login
                      this.name = data.name
                      this.posts = data.posts
                      this.user_id = data.user_id
                      this.image = data.image
                      this.about = data.about
                    })
                    break;
                  case 400:
                    res.text().then(msg => alert(msg))
                    break;
                  case 401:
                    res.text().then(msg => alert(msg))
                    break;
                }
              })
              .then(() => {
                cookieStore.get("User").then(user_id => {
                  fetch('http://127.0.0.1:5000/api/profile', {credentials: 'include'})
                    .then(res => {
                      switch (res.status) {
                        case 200:
                          res.json().then(data => {
                            let default_user_followers = []
                            let followers = []
                            let following = []
                            for (let i of data.following_list) {
                              default_user_followers.push(JSON.stringify(i))
                            }
                            if (default_user_followers.indexOf(JSON.stringify({
                              'user_id': this.user_id,
                              'name': this.name,
                              'email': this.email
                            })) != -1) {
                              this.following = true
                            }
                            for (let i of this.followers_list) {
                              if (default_user_followers.indexOf(JSON.stringify(i)) != -1) {
                                i['following'] = true
                              } else {
                                i['following'] = false
                              }
                              followers.push(i)
                            }
                            for (let i of this.following_list) {
                              if (default_user_followers.indexOf(JSON.stringify(i)) != -1) {
                                i['following'] = true
                              } else {
                                i['following'] = false
                              }
                              following.push(i)
                            }
                            this.followers_list = followers
                            this.following_list = following
                          })
                          break;
                      }
                    })
                })
              })
          }
        })
      }
    }).catch(err => this.$router.push('/login'))
  },
  created: function() {
    try {
      document.getElementById("dismissSearchModal").click()
      document.getElementById("Followers").click()
      document.getElementById("Following").click()
    } catch {}  
    this.$watch(
      () => this.$route.params,
      (to, from) => {
        window.location.reload()
      }
    )
  },
  methods: {
    follow: function(user_id, name) {
      fetch('http://127.0.0.1:5000/api/user/follow', {
        method: "POST",
        body: JSON.stringify({ 'follow': user_id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        switch(res.status) {
          case 200:
            alert('You are following '+name);
            break
          case 400:
            res.text().then(msg => alert(msg))
            break
        }
      })
    },
    unfollow: function(user_id, name) {
      fetch('http://127.0.0.1:5000/api/user/follow', {
        method: "PUT",
        body: JSON.stringify({ 'unfollow': user_id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        switch(res.status) {
          case 200:
            alert('You are not following '+name+' anymore.');
            break
          case 400:
            res.text().then(msg => alert(msg))
            break
        }
      })
    },
  },
  components: {
    'upload-post': () => import('../components/upload-post.js'),
    'navigation': () => import('../components/navigation.js'),
    'search': () => import('../components/search.js'),
    'user-list': () => import('../components/user-list.js'),
  }
}