export default Vue.component('search', {
  template: `
  <!-- search -->
  <div class="modal fade" id="search" tabindex="-1" aria-labelledby="searchLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="searchLabel">Search:</h1>
          <button type="button" class="btn-close" href="#/" data-bs-dismiss="modal" id="dismissSearchModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">  
          <div class="mb-3">
            <input type="text" class="form-control" id="search" name="search" v-model="search" />
          </div>
          <div class="list-group" v-for="i in users">
            <router-link :to="'/user/'+i.user_id" class="mb-2 list-group-item list-group-item-action d-flex justify-content-between">
              <h5>{{ i.name }}</h5>
              <small>{{ i.user_id }}</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end of search -->
  `,
  data: function() {
    return {
      search: '',
      users: []
    }
  },
  watch: {
    search(a, b) {
      fetch('http://127.0.0.1:5000/api/search/'+this.search).then(res => res.json().then(res => this.users = res['users']))
    }
  }
})