<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable max-width="700px">
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
          <v-alert
            v-if="!hasDirectHead"
            dense
            border="right"
            color="red"
            dismissible
            type="warning"
            class="text-caption"
          >
            You haven't set who's your direct head yet. Click
            <span @click="redirectTo()" class="clickme">here</span> to
            set.</v-alert
          >
          <v-form ref="MyLocatorSlipFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="6" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    label="PERSONAL TRANSACTION"
                    color="#6DB249"
                    :rules="[formRules.required]"
                    :value="1"
                    :checked="locatorModel.type == 1 ? true : false"
                  ></v-checkbox>
                </v-col>
                <!-- <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    label="OFFICIAL TIME"
                    color="#6DB249"
                    :rules="[formRules.required]"
                    :value="2"
                    :checked="locatorModel.type == 2 ? true : false"
                  ></v-checkbox>
                </v-col> -->
                <v-col cols="6" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    :rules="[formRules.required]"
                    label="OFFICIAL BUSINESS"
                    color="#6DB249"
                    :value="3"
                    :checked="locatorModel.type == 3 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.destination"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Destination"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-textarea
                    v-model="locatorModel.purpose"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Purpose(s)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-menu
                    ref="inclusiveDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="locatorModel.date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="locatorModel.date"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Inclusive Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="locatorModel.date"
                      no-title
                      :min="nowDate"
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.inclusiveDateMenu.save(locatorModel.date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- <v-col cols="6" class="py-0">
                  <v-text-field
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Out"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="In"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
                <!-- <v-col cols="12" class="py-0">
                  <v-checkbox
                    class="pa-0"
                    color="#6DB249"
                    v-model="locatorModel.is_requested_by_me"
                    label="Requested by me"
                  ></v-checkbox>
                  <v-text-field
                    v-if="locatorModel.is_requested_by_me == false"
                    v-model="locatorModel.requestedBy"
                    dense
                    outlined
                    required
                    label="Requested By"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
                <!-- <v-col cols="12" class="py-0">
                  <v-autocomplete
                    v-model="locatorModel.recommendingApproval"
                    dense
                    outlined
                    required
                    label="OIC"
                    :items="recommendingApprovalList"
                    item-text="name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.approvedBy"
                    readonly
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Approved"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12" class="py-0">
                  <v-autocomplete
                    v-model="approved_by_userID"
                    dense
                    outlined
                    required
                    label="Approver"
                    :items="approverList"
                    item-text="name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
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
          <v-btn
            color="#5a67da"
            class="white--text"
            @click="checkValidate('ADD')"
          >
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
          <v-btn
            color="#5a67da"
            class="white--text"
            @click="checkValidate('UPDATE')"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- confirmation -->
    <v-dialog v-model="confirmDialog" persistent max-width="400">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>

          <!-- error message-->
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; You
              have already reached the maximum number of Personal Locator Slips
              for this month.
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>

          <!-- <v-btn
            v-if="!confirmSubmit.error && confirmSubmit.type == 'UPDATE'"
            color="green"
            class="white--text"
            :loading="submitBtnLoading"
            :disabled="submitBtnLoading"
           
          >
            Yes
          </v-btn> -->
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
      confirmDialog: false,
      dialog: false,
      nowDate: new Date().toISOString().slice(0, 10),
      locatorModel: {
        id: null,
        name: null,
        position: null,
        purpose: null,
        date: null,
        out: null,
        in: null,
        requestedBy: null,
        recommendingApproval: null,
        approvedBy: null,
        approvedByID: null,
        type: null,
        is_requested_by_me: true,
      },
      selected: 1,
      hasDirectHead: null,
      recommendingApprovalList: [],
      approverList: [],
      approved_by_userID: null,
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
          this.dialog = true;
          if (data.id != null) {
            console.log(data);
            this.locatorModel.id = data.id;
            this.locatorModel.purpose = data.purpose;
            this.locatorModel.destination = data.destination;
            this.locatorModel.date = data.inclusive_date;
            this.locatorModel.requestedBy = data.requested_by;
            this.locatorModel.recommendingApproval = data.recommending_approval;
            this.locatorModel.type = data.locator_type;
            this.selected = data.locator_type;
            this.locatorModel.is_requested_by_me = data.is_requested_by_me;
            this.approved_by_userID = parseInt(data.approved_by_userID);
          }
          // this.getDirectHead();
          // this.getOIC();
          this.getMyHeadAndOIC(data.id);
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.MyLocatorSlipFormref.reset();
      this.eventHub.$emit("closeMyLocatorSlipDialog", false);
    },

    redirectTo() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/my-direct-head");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/my-direct-head");
      }
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          if (res.data.length == 0) {
            this.hasDirectHead = false;
          } else {
            this.hasDirectHead = true;
            this.locatorModel.approvedBy = this.toTitleCase(res.data[0].name);
            this.locatorModel.approvedByID = res.data[0].userID;
          }
        }
      });
    },
    getMyHeadAndOIC(id) {
      this.axiosCall("/my-oic/getMyHeadAndOIC", "GET").then((res) => {
        if (res.data) {
          this.hasDirectHead = res.data.length > 0;
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
          }

          if (!id) {
            this.approved_by_userID = data[0].id;
          }

          this.approverList = data;
        }
      });
    },

    getOIC() {
      this.axiosCall("/user-details/OIC", "GET").then((res) => {
        if (res) {
          //oic
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.recommendingApprovalList = data;
        }
      });
    },

    checkValidate(action) {
      if (this.$refs.MyLocatorSlipFormref.validate()) {
        let data = {
          locator_type: this.locatorModel.type,
          destination: this.locatorModel.destination,
          purpose: this.locatorModel.purpose,
          inclusive_date: this.locatorModel.date,
          requested_by: this.locatorModel.requestedBy,
          recommending_approval: this.locatorModel.recommendingApproval,
          approved_by_userID: this.approved_by_userID,
          is_requested_by_me: true,
        };
        this.axiosCall(
          "/my-locator-slip/checkLocatorValidation",
          "POST",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            if (action == "ADD") {
              this.add();
            } else if (action == "UPDATE") {
              this.update();
            }
          } else if (res.data.status == 400) {
            this.confirmDialog = true;
          }
        });
      }
    },

    add() {
      // if (this.$refs.MyLocatorSlipFormref.validate()) {
      let data = {
        locator_type: this.locatorModel.type,
        destination: this.locatorModel.destination,
        purpose: this.locatorModel.purpose,
        inclusive_date: this.locatorModel.date,
        requested_by: this.locatorModel.requestedBy,
        recommending_approval: this.locatorModel.recommendingApproval,
        approved_by_userID: this.approved_by_userID,
        is_requested_by_me: true,
      };
      this.axiosCall("/my-locator-slip", "POST", data).then((res) => {
        if (res.data.status == 201) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.message = res.data.msg;
          this.fadeAwayMessage.header = "System Message";
          this.close();
          // this.$emit("reloadTable");
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          // this.close();
          // this.$emit("reloadTable");
        }
      });
      // }
    },
    update() {
      // if (this.$refs.MyLocatorSlipFormref.validate()) {
      let data = {
        locator_type: this.locatorModel.type,
        destination: this.locatorModel.destination,
        purpose: this.locatorModel.purpose,
        inclusive_date: this.locatorModel.date,
        requested_by: this.locatorModel.requestedBy,
        recommending_approval: this.locatorModel.recommendingApproval,
        approved_by_userID: this.approved_by_userID,
        is_requested_by_me: true,
      };

      this.axiosCall(
        "/my-locator-slip/" + this.locatorModel.id,
        "PATCH",
        data
      ).then((res) => {
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
          // this.close();
        }
      });
      // }
    },
  },
};
</script>
<style scoped>
.clickme {
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;
}
</style>
