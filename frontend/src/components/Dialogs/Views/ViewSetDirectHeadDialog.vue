<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      scrollable
      persistent
      max-width="600px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="SetDirectHeadFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-1 pb-1 pl-6">
            <span>Confirm</span>
            <v-spacer></v-spacer>
            <!-- <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn> -->
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" v-if="has_userHead">
                  <div class="text-body-1" v-if="!notMyDirecthead">
                    Is
                    <span class="font-weight-bold">{{ userhead_name }}</span>
                    your direct head? Please click
                    <span class="font-weight-bold">CONFIRM</span> to save or
                    click
                    <span class="font-weight-bold">NOT MY DIRECT HEAD</span> to
                    select your direct head.
                  </div>
                  <div v-if="notMyDirecthead">
                    <div class="text-body-1">
                      Please select your direct head on the dropdown below.
                    </div>
                    <v-autocomplete
                      v-model="userhead_userID"
                      :rules="notMyDirecthead ? [formRules.required] : []"
                      dense
                      outlined
                      class="rounded-lg mt-4"
                      item-text="name"
                      item-value="id"
                      label="Direct Head"
                      color="#93CB5B"
                      :items="usersList"
                    >
                    </v-autocomplete>
                  </div>
                </v-col>
                <v-col cols="12" v-if="!has_userHead">
                  <div class="text-body-1">
                    The system cannot find your direct head. Please choose in
                    the dropdown selection for your direct head.
                  </div>
                  <v-autocomplete
                    v-model="userhead_userID"
                    :rules="!has_userHead ? [formRules.required] : []"
                    dense
                    outlined
                    class="rounded-lg mt-4"
                    item-text="name"
                    item-value="id"
                    label="Direct Head"
                    color="#93CB5B"
                    :items="usersList"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions class="py-2 px-5">
            <v-spacer></v-spacer>

            <v-btn color="#519043" class="white--text" @click="save()">
              <v-icon>mdi-check-circle</v-icon>
              Confirm
            </v-btn>
            <v-btn
              v-if="!notMyDirecthead && has_userHead"
              color="warning"
              class="white--text"
              @click="NotMyDHead()"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Not My Direct head
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
  components: {
    // ViewTOAttachments: () => import("../Views/ViewTOAttachments.vue"),
  },
  data() {
    return {
      dialog: false,

      id: null,
      userhead_name: null,
      userhead_userID: null,
      notMyDirecthead: null,
      has_userHead: null,
      usersList: [],
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
        console.log(data);

        this.dialog = data.should_open;
        this.userhead_name = data.has_userHead ? data.name : null;
        this.userhead_userID = data.has_userHead ? data.userID : null;
        this.has_userHead = data.has_userHead;
        this.initialize();
        // this.$refs.TOApprovalFormref.reset();
        // this.$refs.TOApprovalFormref.resetValidation();
      },
      deep: true,
    },
  },
  computed: {
    getRecommendingApprovalListLength() {
      return this.recommending_approval_list.length - 1;
    },
  },
  methods: {
    initialize() {
      this.getUsers();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },

    NotMyDHead() {
      this.notMyDirecthead = true;
    },

    getTOAttachments(id) {
      this.axiosCall("/to-attachments/" + id, "GET").then((res) => {
        if (res.data) {
          this.files_to_display = res.data;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewSetDirectHeadDialog", false);
      this.dialog = false;
    },

    getUsers() {
      this.loading = true;
      this.axiosCall("/user-details/getAllUserExceptCurrentUser", "GET").then(
        (res) => {
          if (res) {
            this.usersList = res.data;
            this.loading = false;
          }
        }
      );
    },
    save() {
      if (this.$refs.SetDirectHeadFormref.validate()) {
        let data = {
          head_userID: this.userhead_userID,
        };
        this.axiosCall("/my-direct-head", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";

            this.closeD();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closeD();
            // this.$emit("reloadTable");
          }
        });
      }
    },
  },
};
</script>
