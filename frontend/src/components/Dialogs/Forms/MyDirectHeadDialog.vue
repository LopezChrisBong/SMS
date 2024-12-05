<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New</span>
          <span v-if="action == 'Update'">Update</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="MyDirectHeadFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col>
                  <v-autocomplete
                    v-model="head_userID"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Direct Head"
                    color="#93CB5B"
                    :items="users"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="action == 'Add'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#5a67da" class="white--text" @click="add()">
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#5a67da" class="white--text" @click="update()">
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      users: [],
      dialog: false,
      head_userID: null,
      headID: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data) {
          this.getUsers();
          this.dialog = true;
          if (data.id != null) {
            console.log(data);
            this.headID = data.id;
            this.head_userID = data.userID;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeMyDirectHeadDialog", false);
    },
    getUsers() {
      this.loading = true;
      this.axiosCall("/user-details/getAllUserExceptCurrentUser", "GET").then(
        (res) => {
          if (res) {
            console.log(res.data);
            this.users = res.data;
            this.loading = false;
          }
        }
      );
    },
    add() {
      if (this.$refs.MyDirectHeadFormref.validate()) {
        let data = {
          head_userID: this.head_userID,
        };
        this.axiosCall("/my-direct-head", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.MyDirectHeadFormref.reset();
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyDirectHeadFormref.reset();
            this.close();
            // this.$emit("reloadTable");
          }
        });
      }
    },
    update() {
      if (this.$refs.MyDirectHeadFormref.validate()) {
        console.log(this.headID);
        let data = {
          head_userID: this.head_userID,
        };
        this.axiosCall("/my-direct-head/" + this.headID, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.MyDirectHeadFormref.reset();
              this.close();
            }
          }
        );
      }
    },
  },
};
</script>
