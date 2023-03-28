export default Vue.component('user-list', {
  props: ['list', 'type'],
  template: `
  <!-- user list -->
  <div class="modal fade" :id="type" tabindex="-1" :aria-labelledby="type+'Label'" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="type+'Label'">{{ type }}</h1>
          <button type="button" class="btn-close" href="#/" data-bs-dismiss="modal" :id="'dismiss'+type+'Modal'" aria-label="Close"></button>
        </div>
        <div class="modal-body">  
          <div class="list-group" v-for="i in list">
            <div class="mb-2 list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <router-link :to="'/user/'+i.user_id" class="text-black text-decoration-none">
                <div>
                  <h5>{{ i.name }}</h5>
                  <small>{{ i.user_id }}</small>
                </div>
              </router-link>
              <button style="z-index:4000" class="btn btn-outline-dark" v-if='i.following' @click="unfollow(i.user_id, i.name)">Unfollow</button>
              <button style="z-index:4000" type='button' v-else class="btn btn-primary" @click='follow(i.user_id, i.name)'>Follow</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end of user list -->
  `,
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
            document.getElementById('dismiss'+this.type+'Modal').click()
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
            document.getElementById('dismiss'+this.type+'Modal').click()
            break
          case 400:
            res.text().then(msg => alert(msg))
            break
        }
      })
    },
  },
})