const SignUp = {
  template: `
  <div class="d-flex align-items-center justify-content-center py-4" id="signup" style="min-height: 100vh">
    <form class="card p-5 w-50 dim-bg">
      <div class="text-center display-6 mb-4">Welcome to Blog Lite!</div>
      <div class="d-md-flex">
        <div class="mb-3 mx-3 col">
          <label for="fname" class="form-label">First Name</label>
          <input type="text" class="form-control" v-model="fname" name="fname" required />
        </div>
        <div class="mb-3 mx-3 col">
          <label for="lname" class="form-label">Last Name</label>
          <input type="text" class="form-control" v-model="lname" name="lname" required />
        </div>
      </div>
      <div class="mb-3 mx-3">
        <label for="user_id" class="form-label">User ID</label>
        <input type="text" class="form-control" v-model="user_id" name="user_id" required />
      </div>
      <div class="mb-3 mx-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" class="form-control" v-model="email" name="email" required />
      </div>
      <div class="mb-3 mx-3">
        <label for="pwd" class="form-label">Password</label>
        <input type="password" class="form-control" v-model="pwd" name="pwd" required />
      </div>
      <div class="mb-3 mx-3">
        <label for="about" class="form-label">About</label>
        <textarea class="form-control" id="about" name="about" v-model="about" required></textarea>
      </div>
      <div class="mb-3 mx-3">
        <label for="image" class="form-label">Upload photo</label>
        <input class="form-control" type="file" id="image" v-on:change="imageUpload">
      </div>
      <div class="text-danger mb-3 mx-3">{{ error }}</div>
      <router-link class="text-muted mb-3 mx-3" to="/login">Already have an account? Log in here</router-link>
      <button type="submit" class="btn btn-primary border-0 p-0 mx-3" @click.prevent="signup">
        <div class="btn w-100 dim-bg h-100">Sign me up</div>
      </button>
    </form>
  </div>
  `,
  data: function() {
		return {
			user_id: "",
      fname: "",
      lname: "",
      email: "",
			pwd: "",
			error: "",
      image: "",
      about: ""
		}
	},
  methods: {
    validate: function() {
      if (this.user_id!="" && this.fname!="" && this.email!="" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) && this.pwd!="" && this.pwd.length>=8) {
        return true
      } else {
        this.error = ""
        if (this.user_id=="") {
          this.error += "Please enter Valid User ID. "
        }
        if (this.fname=="") {
          this.error += "Please enter valid name. "
        }
        if (this.email=="" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
          this.error += "Please enter valid Email. "
        }
        if (this.pwd=="") {
          this.error += "Please enter password. "
        }
        if (this.pwd.length < 8) {
          this.error += "Password should be atleast 8 characters long. "
        }
      }
    },
    signup: function() {
      if (this.validate()) {
        fetch("http://127.0.0.1:5000/api/user", {
          method: 'POST',
          body: JSON.stringify({
            user_id: this.user_id,
            name: this.fname+" "+this.lname,
            email: this.email,
            password: this.pwd,
            image: this.image,
            about: this.about
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          switch (res.status) {
            case 200:
              res.json().then(token => {
                document.cookie = "Token="+token.replaceAll('"', '')
                document.cookie = "User="+this.user_id
                this.$router.push('/')
              })
              break
            case 400:
              res.text().then(data => this.error = data)
              break
          }
        })
      }
    },
    imageUpload: function(e) {
      const el = document.getElementById("image");
      const file = el.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        this.image = reader.result
      }
      reader.readAsDataURL(file)
    },
  }
}