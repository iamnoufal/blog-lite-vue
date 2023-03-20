export default Vue.component('edit-post', {
  props: ['post'],
  template: `
  <!-- edit post modal -->
  <div class="modal fade" :id="post.post_id+'-edit'" tabindex="-1" :aria-labelledby="post.post_id+'-edit-label'" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <form method="put">
          <div class="modal-header">
            <h1 class="modal-title fs-5" :id="post.post_id+'-edit-label'">Edit Post:</h1>
            <button type="button" class="btn-close" href="#/" :id="post.post_id+'-dismiss-edit-post'" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">  
            <div class="mb-3 mx-3">
              <label :for="post.post_id+'-edit-post-title'" class="form-label">Title</label>
              <input type="text" class="form-control" name="title" v-model="post.title" />
            </div>
            <div class="mb-3 mx-3">
              <label :for="post.post_id+'-edit-post-description'" class="form-label">Description</label>
              <textarea class="form-control" :id="post.post_id+'-edit-post-description'" name="description" v-model="post.description"></textarea>
            </div>
            <div class="mb-3 mx-3">
              <label :for="post.post_id+'-edit-post-image'" class="form-label">Upload photo</label>
              <input class="form-control" type="file" @change="editPostImage" :id="post.post_id+'-edit-post-image'">
            </div>
            <p class="text-danger">{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" href="#/" data-bs-dismiss="modal">Cancel</button>
            <input type="submit" class="btn btn-primary" value="Confirm" @click.prevent="editPost" />
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- end of edit post modal -->
  `,
  data: function() {
    return {
      error: ''
    }
  },
  methods: {
    editPostImage: function() {
      const el = document.getElementById(this.post.post_id+"-edit-post-image");
      const file = el.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        this.post.image = reader.result
      }
      reader.readAsDataURL(file)
    },
    editPost: function() {
      fetch('http://127.0.0.1:5000/api/post/'+this.post.post_id, {
        method: "PUT",
        body: JSON.stringify({
          title: this.post.title,
          description: this.post.description, 
          image: this.post.image
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        switch(res.status) {
          case 200:
            alert("Post edited successfully!");
            document.getElementById(this.post.post_id+'-dismiss-edit-post').click()
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
  }
})