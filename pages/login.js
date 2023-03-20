const Login = {
  template: `
  <div class="d-flex align-items-center justify-content-center" id="login" style="min-height: 100vh">
    <form class="card p-5 mx-3 w-50 dim-bg">
      <div class="text-center display-6 mb-4">Login</div>
      <div class="mb-3 mx-3">
        <label for="user_id" class="form-label">User ID</label>
        <input type="text" class="form-control" id="user_id" name="user_id" required v-model="user_id">
      </div>
      <div class="mb-3 mx-3">
        <label for="pwd" class="form-label">Password</label>
        <input type="password" class="form-control" id="pwd" name="pwd" v-model="password">
      </div>
      <div class="text-danger mb-3 mx-3">{{ error }}</div>
      <router-link class="text-muted mb-3 mx-3" to="/signup">New here? Sign up!</router-link>
      <button type="submit" class="btn btn-primary mx-3" @click.prevent="login">Log me In</button>
    </form>
  </div>
  `,
  data: function() {
		return {
			user_id: "",
			password: "",
			error: ""
		}
	},
  methods: {
    validate: function() {
      this.error = ""
      if (this.user_id!="") {
        return true
      } else {
        this.error += "Please enter valid User ID/Email ID." 
      }
    },
    login: function() {
      if (this.validate()) {
        let data = {}
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user_id)) {
          data = {
            email: this.user_id,
            user_id: "",
            password: this.password
          }
        } else {
          data = {
            email: "",
            user_id: this.user_id,
            password: this.password
          }
        }
        fetch('http://127.0.0.1:5000/api/auth', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(res => {
          switch (res.status) {
            case 200:
              res.text().then(token => {
                document.cookie = "Token="+token.replaceAll('"', '')
                document.cookie = "User="+this.user_id
                this.$router.push('/')
              })
              break
            case 401:
              res.text().then(err => this.error = err)
              break
            case 404:
              res.text().then(err => this.error = err)
              break
          }
        })
      }
    }
  }
}