export default Vue.component('upload-post', {
  template: `
  <!-- upload post modal -->
  <div class="modal fade" id="uploadPost" tabindex="-1" aria-labelledby="uploadPostLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <form method="post" id="uploadpost">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="uploadPostLabel">Upload Post:</h1>
            <button type="button" class="btn-close" href="#/" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">  
            <div class="mb-3 mx-3">
              <label for="uploadTitle" class="form-label">Title</label>
              <input type="text" class="form-control" id="uploadTitle" name="uploadTitle" v-model="uploadTitle" />
            </div>
            <div class="mb-3 mx-3">
              <label for="uploadDescription" class="form-label">Description</label>
              <textarea class="form-control" id="uploadDescription" name="uploadDescription" v-model="uploadDescription"></textarea>
            </div>
            <div class="mb-3 mx-3">
              <label for="uploadImage" class="form-label">Upload photo</label>
              <input class="form-control" type="file" id="uploadImage" v-on:change="imageUpload">
            </div>
            <p class="text-danger">{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" href="#/" data-bs-dismiss="modal">Cancel</button>
            <input type="submit" class="btn btn-primary" value="Create Post" data-bs-dismiss="modal" @click.prevent="uploadPost" />
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- end of upload post modal -->
  `,
  data: function() {
    return {
      uploadTitle: "",
      uploadDescription: "",
      uploadImage: "",
      error: '',
    }
  },
  methods: {
    uploadPost: function() {
      const data = {
        title: this.uploadTitle,
        description: this.uploadDescription,
        image: this.uploadImage,
      }
      console.log(data)
      fetch('http://127.0.0.1:5000/api/post', {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        console.log(res)
        switch (res.status) {
          case 200:
            alert("Post uploaded successfully")
            window.location.reload()
            break
          case 401:
            res.text().then(err => alert(err))
            break
          case 404:
            res.text().then(err => alert(err))
            break
        }
      })
    },
    imageUpload: function() {
      const el = document.getElementById("uploadImage");
      const file = el.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        this.uploadImage = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
});