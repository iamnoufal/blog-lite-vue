const Profile = {
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
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfile">Edit</button>
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
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#'+i.post_id+'-edit'"><i class="bi bi-pencil-square"></i></button>
                  <button type="button" class="btn btn-danger" @click="deletePost(i.post_id)"><i class="bi bi-trash3"></i></button>
                </div>
              </div>
            </div>
          </div>
          <!-- end of post modal -->

          <edit-post :post='i' />

        </div>
        <!-- end of posts loop -->
      </div>
    </div>
    <!-- end of posts -->

    <!-- edit profile modal -->
    <div class="modal fade" id="editProfile" tabindex="-1" aria-labelledby="editProfileLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form method="post">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="editProfileLabel">Edit Profile</h1>
              <button type="button" class="btn-close" href="#/" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">  
              <div class="mb-3 mx-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" v-model="name" />
              </div>
              <div class="mb-3 mx-3">
                <label for="user_id" class="form-label">User ID</label>
                <input type="text" class="form-control" id="user_id" name="user_id" v-model="user_id" />
              </div>
              <div class="mb-3 mx-3">
                <label for="about" class="form-label">About</label>
                <textarea class="form-control" id="about" name="about" v-model="about"></textarea>
              </div>
              <div class="mb-3 mx-3">
                <label for="image" class="form-label">Upload photo</label>
                <input class="form-control" type="file" id="image" v-on:change="editProfileImage">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" href="#/" id='cancelEditProfile' data-bs-dismiss="modal">Cancel</button>
              <input type="submit" class="btn btn-primary" value="Update Profile" @click.prevent="editProfile" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- end of edit profile modal -->
    <search />
    <upload-post />
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
      error: ''
    }
  },
  beforeCreate: function() {
    cookieStore.get("Token").then(token => {
      if (token.value == '0') {
        this.$router.push('/verify')
      } else {
        fetch('http://127.0.0.1:5000/api/profile', {credentials: 'include'})
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
      }
    }).catch(err => this.$router.push('/login'))
  },
  methods: {
    fetchData: function() {
      fetch('http://127.0.0.1:5000/api/profile', {credentials: 'include'})
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
    },
    editProfileImage: function(e) {
      const el = document.getElementById("image");
      const file = el.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        this.image = reader.result
      }
      reader.readAsDataURL(file)
    },
    editProfile: function() {
      fetch('http://127.0.0.1:5000/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          name: this.name,
          image: this.image,
          user_id: this.user_id,
          about: this.about
        }),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        switch(res.status) {
          case 200:
            alert('User Profile Updated')
            document.getElementById("cancelEditProfile").click()
            break;
          case 400:
            res.text().then(msg => this.error = msg)
            break;
          case 401:
            res.text().then(msg => this.error = msg)
            break;
        }
      })
    },
    editPost: function(post_id) {
      let title = document.getElementById(post_id+'-edit-post-title').value
      let description = document.getElementById(post_id+'-edit-post-description').value
      let image = ''
      let el = document.getElementById(post_id+"-edit-post-image");
      let file = el.files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        image = reader.result
      }
      reader.readAsDataURL(file)
      setTimeout(() => {
        fetch('http://127.0.0.1:5000/api/post/'+post_id, {
          method: "PUT",
          body: JSON.stringify({
            title: title,
            description: description, 
            image: image
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          switch(res.status) {
            case 200:
              alert("Post edited successfully!");
              this.fetchData()
              document.getElementById(post_id+'-dismiss-edit-post').click()
              break;
            case 400:
              res.text().then(msg => this.error = msg)
              break;
            case 401:
              res.text().then(msg => this.error = msg)
              break;
          }
        })
      }, 1000)
    },
    deletePost: function(post_id) {
      fetch('http://127.0.0.1:5000/api/post/'+post_id, {
        method: 'DELETE',
        credentials: 'include'
      }).then(res => {
        switch(res.status) {
          case 200:
            alert("Post deleted successfully")
            document.getElementById(post_id+'-dismiss').click();
            this.fetchData()
          case 400:
            res.text().then(msg => this.error = msg)
            break;
          case 401:
            res.text().then(msg => this.error = msg)
            break;
        }
      })
    },
  },
  components: {
    'upload-post': () => import('../components/upload-post.js'),
    'navigation': () => import('../components/navigation.js'),
    'search': () => import('../components/search.js'),
    'user-list': () => import('../components/user-list.js'),
    'edit-post': () => import('../components/edit-post.js'),
  }
}