<template>
    <div class="container-fluid page-body-wrapper">
      <div class="main-panel">
        <div class="content-wrapper">
          <div class="row">
            <div class="col-lg-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title float-left"><i class="mdi mdi-format-list-bulleted menu-icon"></i></p>
                  <p class="card-description float-right">
                    <b-button variant="success" v-b-modal.modalScrum v-on:click="Add">
                      <i class="mdi mdi-plus btn-icon-prepend"></i>
                        Add Activity
                      </b-button>
                  </p>
                  <div class="table-responsive">
                   <b-table striped hover :items="my_daily_scrum" :fields="fields">
                  <template v-slot:cell(team)="data">
                    <b-badge variant="warning">{{ data.item.team }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
                  </template>
                </b-table>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <b-modal id="modalScrum" @submit="Submit">
          <template v-slot:modal-title>
            Add Activity
          </template>
          <form ref="form">
          <div class="form-group">
            <label for="id_users" class="col-form-label">Your Team</label>
            <select class="form-control" name="team" id="team" v-model="team">
               <option value="BEON" checked>BEON</option>
                      <option value="DDS">DDS</option>
                      <option value="DOT">DOT</option>
                      <option value="node1">Node 1</option>
                      <option value="node2">Node 2</option>
                      <option value="react1">React 1</option>
                      <option value="react2">React 2</option>
                      <option value="laravel">Laravel</option>
                      <option value="laravel_vue">Laravel & Vue</option>
                      <option value="android">Android</option>
            </select>
          </div>
          <div class="form-group">
            <label for="activity_yesterday" class="col-form-label">Yesterday Activity</label>
            <textarea name="activity_yesterday" id="activity_yesterday" class="form-control" rows="7" cols="10"></textarea>
          </div>
          <div class="form-group">
            <label for="activity_today" class="col-form-label">Today Activity</label>
            <textarea name="activity_today" id="activity_today" class="form-control" rows="7" cols="10"></textarea>
          </div>
          <div class="form-group">
            <label for="problem_yesterday" class="col-form-label">Yesterday Problem</label>
            <textarea name="problem_yesterday" id="problem_yesterday" class="form-control" rows="7" cols="10"></textarea>
          </div>
          <div class="form-group">
             <label for="solution" class="col-form-label">Your Solution</label>
             <textarea name="solution" id="solution" class="form-control" rows="7" cols="10"></textarea>
          </div>
         <!-- <div class="form-group">
             <button type="button" class="btn btn-md btn-success">Submit</button>
             <button type="button" class="btn btn-md btn-light" data-dismiss="modal">Cancel</button>
          </div> -->
        </form>
        </b-modal>
      </div>
</template>

<script>
module.exports = {
    data : function(){
        return {
            id: "",
            id_users: "",
            team: "",
            activity_yesterday: "",
            activity_today: "",
            problem_yesterday: "",
            solution: "",
            action: "",
            tanggal: "",
            message: "",
            my_daily_scrum: [],
            fields: ["tanggal", "yesterday", "today", "problem", "solution", "action"]
        }
    },

    methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/my_daily_scrum" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.status == 1){
          this.$bvToast.hide("loadingToast");
          this.user = response.data.user;
          this.rows = response.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    // pagination : function(){
    //   if(this.search == ""){
    //     this.getData();
    //   } else {
    //     this.searching();
    //   }
    // },

    Add : function(){
      this.action = "insert";
      this.team = "";
      this.activity_yesterday = "";
      this.activity_today = ""; 
      this.problem_yesterday = "";
      this.solution = "";
    },
    Submit : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        // form.append("tanggal", this.tanggal);
        form.append("team", this.team);
        form.append("activity_yesterday", this.activity_yesterday);
        form.append("activity_today", this.activity_today);
        form.append("problem_yesterday", this.problem_yesterday);
        form.append("solution", this.solution);

        this.axios.post("/my_daily_scrum", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        let form = {
          tanggal: this.tanggal,
          team: this.team,
          activity_yesterday: this.activity_yesterday,
          activity_today: this.activity_today,
          problem_yesterday: this.problem_yesterday,
          solution: this.solution,
        }
        this.axios.put("/my_daily_scrum" + this.id, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/my_daily_scrum" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>
