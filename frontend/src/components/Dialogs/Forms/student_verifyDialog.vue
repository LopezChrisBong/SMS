<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action == "Verify" ? "Enroll" : action }} Student</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.lrn"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="LRN Submitted"
                    color="#93CB5B"
                    :items="passedList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.good_moral"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Good Moral Submitted"
                    color="#93CB5B"
                    :items="passedList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.birth_certificate"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Birth Certificate Submitted"
                    color="#93CB5B"
                    :items="passedList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.form137a"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Form 137A Submitted"
                    color="#93CB5B"
                    :items="passedList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.schoo_yearId"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="school_year"
                    item-value="id"
                    label="School Year"
                    color="#93CB5B"
                    :items="year_fromList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.grade_level"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Grade Level:"
                    color="#93CB5B"
                    :items="
                      seniorJunior == 'Junior High' ? juniorList : seniorList
                    "
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
              {{ action == "Verify" ? "Enroll" : "Update" }}
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
        grade_level: null,
        lrn: "No",
        good_moral: "No",
        birth_certificate: "No",
        form137a: "No",
        schoo_year: null,
      },
      seniorJunior: null,
      passedList: ["Yes", "No"],
      userRoleList: [],
      usertypeList: [],
      year_fromList: [],
      juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      seniorList: ["Grade 11", "Grade 12"],
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
        if (data.id) {
          console.log("Love", data.year_from);
          this.verifyModel.id = data.id;
          this.seniorJunior = data.seniorJunior;
          this.verifyModel.grade_level = data.grade_level.toString();
          this.verifyModel.lrn = data.lrn == false ? "No" : "Yes";
          this.verifyModel.good_moral = data.good_moral == false ? "No" : "Yes";
          this.verifyModel.birth_certificate =
            data.birth_certificate == false ? "No" : "Yes";
          this.verifyModel.form137a = data.form137a == false ? "No" : "Yes";
          this.verifyModel.year_from = data.year_from;
          this.verifyModel.year_to = data.year_to;
          // this.verifyModel.date_hired = data.emp_date_hired;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getUserType();
      this.getAssignedModules();
      this.getUseRoles();
      // this.loadYearFrom();
      this.getSchoolYear();
    },

    // loadYearFrom() {
    //   let d = new Date();

    //   let yr = d.getFullYear();

    //   for (let i = yr; i < yr + 10; i++) {
    //     this.year_fromList.push(i);
    //   }
    // },
    // onChangeDateFrom(data) {
    //   this.verifyModel.year_to = data + 1;
    // },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeAccountsVerificationDialog", true);
      this.dialog = false;
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let data = {
          id: this.verifyModel.id,
          grade_level: this.verifyModel.grade_level,
          lrn: this.verifyModel.lrn == "No" ? false : true,
          good_moral: this.verifyModel.good_moral == "No" ? false : true,
          birth_certificate:
            this.verifyModel.birth_certificate == "No" ? false : true,
          form137a: this.verifyModel.form137a == "No" ? false : true,
          schoo_yearId: this.verifyModel.schoo_yearId,
          update_type: this.action == "Verify" ? 1 : 2,
          statusEnrolled: true,
        };

        this.axiosCall(
          "/enroll-student/updateEnrolledStudent",
          "POST",
          data
        ).then((res) => {
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
        });
      }
    },

    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },

    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.year_fromList = res.data;
          this.verifyModel.schoo_yearId = res.data[0].id;
        }
      });
    },
  },
};
</script>
