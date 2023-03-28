const Verify = {
  template: `
  <div class="d-flex align-items-center justify-content-center" id="login" style="min-height: 100vh">
    <form class="card p-5 mx-3 w-50 dim-bg">
      <div class="text-center display-6 mb-4">We've sent an OTP to your mail</div>
      <div class="mb-3 mx-3">
        <label for="otp" class="form-label">Enter OTP</label>
        <input type="text" class="form-control" id="otp" name="otp" required v-model="otp" />
      </div>
      <div class="text-danger mb-3 mx-3">{{ error }}</div>
      <button type="submit" class="btn btn-primary mx-3" @click.prevent="verify">Verify</button>
    </form>
  </div>
  `,
  data: function() {
    return {otp: '', error: ''}
  },
  beforeCreate: function() {
    cookieStore.get("User").then(user_id => {
      fetch(`http://127.0.0.1:5000/api/${user_id.value}/verify`).then(res => {
        switch(res.status) {
          case 200:
            res.text().then(msg => { 
              if (msg != "") {
                // alert(msg)
                // this.$router.back()
              }
            })
            break;
          case 400:
            res.text().then(msg => this.error = msg).then(() => this.$router.push('/login'))
            break;
        }
      })
    })
  },
  methods: {
    verify: function() {
      cookieStore.get('User').then(user_id => {
        fetch('http://127.0.0.1:5000/api/'+user_id.value+'/verify', {
          method: "POST",
          body: JSON.stringify({otp: this.otp}),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          switch(res.status) {
            case 200:
              res.text().then(token => document.cookie = "Token="+token.replaceAll('"', '')).then(() => this.$router.push("/"))
            case 400:
              res.text().then(msg => this.error = msg).then(() => this.$router.push("/signup"))
          }
        })
      })
    },
  },
}