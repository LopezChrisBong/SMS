<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} User</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    readonly
                    v-model="verifyModel.name"
                    :rules="[formRules.required]"
                    dense
                    required
                    label="Name"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="verifyModel.empStatusID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Employment Status"
                    color="#6DB249"
                    :items="empStatusList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="verifyModel.positionID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Position"
                    color="#6DB249"
                    :items="positionList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  class="pa-0 pt-2 px-4"
                  v-if="
                    verifyModel.positionID == 2 || verifyModel.positionID == 3
                  "
                >
                  <v-autocomplete
                    v-model="verifyModel.instituteID"
                    :rules="
                      verifyModel.positionID == 2 || verifyModel.positionID == 3
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Institute"
                    color="#6DB249"
                    :items="instituteList"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="verifyModel.designationID"
                    :rules="[]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Designation"
                    color="#6DB249"
                    :items="designationList"
                  >
                  </v-autocomplete>
                </v-col> -->
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="verifyModel.officeID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Office"
                    color="#6DB249"
                    :items="officeList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.usertypeID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="User type"
                    color="#93CB5B"
                    :items="usertypeList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.user_roleID"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="User role"
                    color="#93CB5B"
                    :items="userRoleList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="verifyModel.empID"
                    :rules="[formRules.required]"
                    dense
                    required
                    label="Employee ID"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="dateHiredMenu"
                    :close-on-content-click="false"
                    :return-value.sync="verifyModel.date_hired"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        label="Date hired"
                        dense
                        v-model="verifyModel.date_hired"
                        :rules="[formRules.required]"
                        chips
                        readonly
                        small-chips
                        color="#6DB249"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="verifyModel.date_hired"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.dateHiredMenu.save(verifyModel.date_hired)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.assignedModuleID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Modules to assign"
                    color="#93CB5B"
                    :items="assignedModulesList"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="accept()"
            >
              <v-icon>mdi-check-circle</v-icon>
              {{ action == "Verify" ? "Accept" : "Update" }}
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
  data() {
    return {
      dialog: false,
      verifyModel: {
        id: null,
        userID: null,
        name: null,
        empID: null,
        date_hired: null,
        positionID: null,
        empStatusID: null,
        designationID: null,
        officeID: null,
        usertypeID: null,
        user_roleID: null,
        instituteID: null,
        assignedModuleID: null,
      },
      userRoleList: [],
      usertypeList: [],
      officeList: [],
      designationList: [],
      positionList: [],
      empStatusList: [],
      instituteList: [],
      assignedModulesList: [],
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
        this.dialog = true;
        this.initialize();
        this.$refs.UserVerifyFormref.resetValidation();
        console.log(data);
        if (data.id) {
          this.verifyModel.id = data.id;
          this.verifyModel.userID = data.user_id;
          this.verifyModel.name = data.name;
          this.verifyModel.empID = data.emp_empID;
          this.verifyModel.positionID = data.emp_positionID.toString();
          this.verifyModel.empStatusID = data.emp_empStatusID;
          this.verifyModel.designationID = data.emp_designationID;
          this.verifyModel.officeID = data.emp_officeID;
          this.verifyModel.instituteID = data.emp_instituteID;
          this.verifyModel.usertypeID = data.user_usertypeID.toString();
          this.verifyModel.user_roleID = data.user_user_roleID;
          this.verifyModel.assignedModuleID = data.user_assignedModuleID;
          this.verifyModel.date_hired = data.emp_date_hired;
          // this.verifyModel.userID = data.userID;
          // this.verifyModel.name = data.fname + " " + data.lname;
          // this.verifyModel.empID = data.employee.empID;
          // this.verifyModel.positionID = data.employee.positionID.toString();
          // this.verifyModel.empStatusID = data.employee.empStatusID;
          // this.verifyModel.designationID = data.employee.designationID;
          // this.verifyModel.officeID = data.employee.officeID;
          // this.verifyModel.instituteID = data.employee.instituteID;
          // this.verifyModel.usertypeID = data.user.usertypeID.toString();
          // this.verifyModel.user_roleID = data.user.user_roleID;
          // this.verifyModel.assignedModuleID = data.user.assignedModuleID;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getOffices();
      this.getPositions();
      this.getDesignations();
      this.getEmpStatus();
      this.getInstitutes();
      this.getUserType();
      this.getUseRoles();
      this.getAssignedModules();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeAccountsVerificationDialog", false);
      this.dialog = false;
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let data = {
          id: this.verifyModel.id,
          userID: this.verifyModel.userID,
          positionID: this.verifyModel.positionID,
          empID: this.verifyModel.empID,
          date_hired: this.verifyModel.date_hired,
          officeID: this.verifyModel.officeID,
          designationID: this.verifyModel.designationID,
          empStatusID: this.verifyModel.empStatusID,
          usertypeID: this.verifyModel.usertypeID,
          user_roleID: this.verifyModel.user_roleID,
          assignedModuleID: this.verifyModel.assignedModuleID,
          update_type: this.action == "Verify" ? 1 : 2,
        };

        this.axiosCall("/user-details/updateVerifiedUser", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.PositionFormref.reset();
              this.closeD();
            }
          }
        );
      }
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },
    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },
    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
  },
};
</script>
