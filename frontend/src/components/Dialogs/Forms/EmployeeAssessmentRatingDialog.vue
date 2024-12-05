<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-form
        ref="RatingAssessmentFormref"
        enctype="multipart/form-data"
        @submit.prevent
      >
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Employee Assessment </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text
            style="max-height: 900px; max-width: 1500px; margin:20px auto"
            class="my-1"
          >
            <v-container>
              <v-row>
                <v-col cols="12" class="text-center">
                  <h3 class="text-h4 font-weight-bold">
                    Employee Assessment Form
                  </h3>
                  <p class="text-subtitle-1">
                    (After 3-4 Months attendance to Seminar/Trainings)
                  </p>
                </v-col>
                <!-- <v-col cols="12">
                  <div style=" display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      NAME OF SUPERVISOR/RATER:
                    </div>
                    <div
                      class=" text-subtitle-1"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ rater }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div style="display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      POSITION/DESIGNATION:
                    </div>
                    <div
                      class=" text-subtitle-1"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ raterPos }}
                    </div>
                  </div>
                </v-col> -->

                <v-col cols="12">
                  <p class="text-subtitle-1">
                    Dear <i><b>Rater,</b></i>
                  </p>
                  <p class="text-subtitle-1 text-justify">
                    In order to continue and improve the quality of services,
                    the HUMAN RESOURCE MANAGEMENT OFFICE, would appreciate you
                    taking a few minutes of your time to complete this
                    assessment.
                  </p>

                  <p class="text-subtitle-1 text-justify">
                    Please rate the employee's performance if there are
                    improvement or none to his/her assigned responsibilities
                    after attending the seminar or training. (Please check the
                    blank space (checkbox))
                  </p>
                </v-col>

                <v-col cols="12">
                  <div style=" display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      EMPLOYEE NAME:
                    </div>
                    <div
                      class=" text-subtitle-1"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ name }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div style="display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      POSITION/DESIGNATION:
                    </div>
                    <div
                      class=" text-subtitle-1"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ assessed_user_position }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div style=" display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      TITLE OF SEMINAR/TRAINING ATTENDED:
                    </div>
                    <div
                      class="text-subtitle-1"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ title }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div style=" display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      SPONSORING AGENCY:
                    </div>
                    <div
                      v-if="tab != 1"
                      class=" text-subtitle-1 font-weight-bold"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ sponsoring_agency }}
                    </div>
                    <v-text-field
                      v-if="tab == 1"
                      v-model="sponsoring_agency"
                      :rules="tab == 1 ? [formRules.required] : []"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div style="display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      DATE ATTENDED:
                    </div>
                    <div
                      class=" text-subtitle-1 font-weight-bold"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{ attended_date }}
                    </div>
                  </div>
                </v-col>

                <!-- <v-col cols="12" v-if="tab != 3">
                  <div style="display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      DATES TO BE ASSESSED:
                    </div>
                    <div style="width:70%">
                      <v-menu
                        ref="AssessmentDateFrom"
                        :close-on-content-click="false"
                        :return-value.sync="assessment_date_from"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            v-model="assessment_date_from"
                            chips
                            small-chips
                            label="From"
                            color="#6DB249"
                            :rules="[formRules.required]"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="#6DB249"
                          v-model="assessment_date_from"
                          :min="travel_date_to ? travel_date_to : ''"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>

                          <v-btn
                            text
                            color="#6DB249"
                            @click="
                              $refs.AssessmentDateFrom.save(
                                assessment_date_from
                              )
                            "
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>

                      <v-menu
                        ref="AssessmentDateTo"
                        :close-on-content-click="false"
                        :return-value.sync="assessment_date_to"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            v-model="assessment_date_to"
                            :rules="[formRules.required]"
                            chips
                            small-chips
                            label="To"
                            color="#6DB249"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="#6DB249"
                          v-model="assessment_date_to"
                          :min="
                            assessment_date_from ? assessment_date_from : ''
                          "
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>

                          <v-btn
                            text
                            color="#6DB249"
                            @click="
                              $refs.AssessmentDateTo.save(assessment_date_to)
                            "
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" v-if="tab != 3">
                  <div style="display:flex">
                    <div
                      class="font-weight-bold text-subtitle-1"
                      style="width:30%"
                    >
                      DATES TO BE ASSESSED:
                    </div>
                    <div
                      class=" text-subtitle-1 font-weight-bold"
                      style="border-bottom:1px solid grey;width:70%"
                    >
                      {{
                        formatDate(assessment_date_from) +
                          " - " +
                          formatDate(assessment_date_to)
                      }}
                    </div>
                  </div>
                </v-col> -->

                <v-col cols="12" class="pa-2 mt-2">
                  <div class="elevation-4 rounded-lg">
                    <div class="d-flex ">
                      <div
                        style="width: 60%"
                        class=" font-weight-bold text-subtitle-1 pa-1 text-center"
                      >
                        Performance Category
                      </div>
                      <div
                        style="width:40%"
                        class="font-weight-bold text-subtitle-1 pa-1 text-center"
                      >
                        Rating
                      </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="d-flex" v-for="(item, i) in pcList" :key="i">
                      <div
                        style="width: 60%;border-right:1px solid grey; border-bottom:1px solid grey "
                        class="pa-2"
                      >
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ item.header }}
                        </div>
                        <div class="text-subtitle-1 ">{{ item.details }}</div>
                      </div>
                      <div
                        style="width: 40%; border-bottom:1px solid grey"
                        class="font-weight-bold text-subtitle-1 pa-1 text-center"
                      >
                        <v-checkbox
                          label="Exceeds Expectation"
                          class="pa-0"
                          v-model="item.rating"
                          :value="4"
                          :readonly="tab == 2"
                          :checked="item.rating == 4 ? true : false"
                          :rules="[formRules.required]"
                        ></v-checkbox>
                        <v-checkbox
                          class="pa-0"
                          v-model="item.rating"
                          :value="3"
                          :readonly="tab == 2"
                          :checked="item.rating == 3 ? true : false"
                          :rules="[formRules.required]"
                          label="Meets Expectation"
                        ></v-checkbox>
                        <v-checkbox
                          class="pa-0"
                          v-model="item.rating"
                          :value="2"
                          :readonly="tab == 2"
                          :checked="item.rating == 2 ? true : false"
                          :rules="[formRules.required]"
                          label="Needs Expectation"
                        ></v-checkbox>
                        <v-checkbox
                          class="pa-0"
                          v-model="item.rating"
                          :value="1"
                          :readonly="tab == 2"
                          :checked="item.rating == 1 ? true : false"
                          :rules="[formRules.required]"
                          label="Unacceptable"
                        ></v-checkbox>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <h3 class="text-h6">COMMENT AND SUGGESTIONS</h3>
                  <p class="text-subtitle-1">
                    (Please assess if there are improvement or none to the
                    performance of the concerned employee/s after attending the
                    seminar or training. You can also include suggestions for
                    future development of concerned employee under your unit or
                    office.)
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    name="input-7-4"
                    outlined
                    dense
                    placeholder="Type here..."
                    color="#5a67da"
                    :readonly="tab == 2"
                    :rules="[formRules.required]"
                    v-model="comment_sgt"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn
              color="#5a67da"
              v-if="tab == 1"
              class="white--text"
              @click="save()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>

            <!-- <v-btn
              color="#5a67da"
              v-if="tab == 2"
              class="white--text"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- <v-dialog v-model="pcDialog" persistent max-width="800">
      <v-card color="white">
        <v-form ref="PCFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ innerAction }} Performance Category</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="pcDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :rules="[formRules.required]"
                    v-model="pcHeader"
                    dense
                    color="#5a67da"
                    outlined
                    label="Performance Category Header"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    name="input-7-4"
                    outlined
                    dense
                    color="#5a67da"
                    :rules="[formRules.required]"
                    label="Performance Category Details"
                    v-model="pcDetails"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="pcDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="innerAction == 'Add'"
              color="green"
              class="white--text"
              @click="savePC()"
            >
              Add
            </v-btn>

            <v-btn
              v-if="innerAction == 'Edit'"
              color="green"
              class="white--text"
              @click="updatePC()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog> -->

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

    tab: null,
  },
  data() {
    return {
      dialog: false,
      pcDialog: false,
      pcHeader: null,
      pcDetails: null,
      pcList: [],
      comment_sgt: null,
      TO_ID: null,
      tarID: null,

      emp_assID: null,
      title: null,
      name: null,
      assessed_userID: null,
      assessed_user_posID: null,
      assessed_user_position: null,
      assessment_date_from: null,
      assessment_date_to: null,

      sponsoring_agency: null,
      attended_date: null,
      travel_date_to: null,

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
        console.log(data);
        this.getUserPosition(data.assessed_userID);
        this.getPerformanceCategory(data.id);
        this.title = data.tar_title;
        this.name = data.name;
        this.emp_assID = data.id;
        this.tarID = data.tar_ID;
        this.comment_sgt = data.comment_sgt;
        this.sponsoring_agency = data.sponsoring_agency;
        this.attended_date =
          this.formatDate(data.travel_date_from) +
          " - " +
          this.formatDate(data.travel_date_to);
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.$refs.AddTARFormref.resetValidation();
    },

    closeD() {
      this.eventHub.$emit("closeEmployeeAssessmentRatingDialog", false);
      this.dialog = false;
    },

    getUserPosition(id) {
      this.axiosCall(
        "/my-direct-head/getPersonnelNameandPos/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.assessed_user_posID = res.data.positionID;
          this.assessed_user_position = res.data.position;
        }
      });
    },

    getPerformanceCategory(id) {
      this.axiosCall(
        "/employee-assessment-performance-category/getPerformanceCategories/" +
          id,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.pcList = res.data;
        }
      });
    },

    getPersonnelNameandPos(id) {
      this.axiosCall(
        "/my-direct-head/getPersonnelNameandPos/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          //   console.log(res.data);

          this.assessed_user_position = res.data.position;
        }
      });
    },

    addMonth(num_month, date) {
      let d = new Date(date);
      return new Date(d.setMonth(d.getMonth() + num_month));
    },

    save() {
      if (this.$refs.RatingAssessmentFormref.validate()) {
        let data = {
          emp_assID: this.emp_assID,
          tar_ID: this.tarID,
          pcList: this.pcList,
          comment_sgt: this.comment_sgt,
        };

        this.axiosCall(
          "/employee-assessment/save-assessment-rating",
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

    update() {
      if (this.$refs.AssessmentFormref.validate()) {
        if (this.pcList.length == 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Performance Category is Empty!";
        } else {
          let data = {
            sponsoring_agency: this.sponsoring_agency,
            pcList: this.pcList,
            removedPCList: this.removedPCList,
            comment_sgt: this.comment_sgt,
            assessment_date_from: this.assessment_date_from,
            assessment_date_to: this.assessment_date_to,
          };

          this.axiosCall(
            "/employee-assessment/" + this.emp_assid,
            "PATCH",
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
      }
    },

    // pending() {
    //   this.remarksDialog = true;
    //   this.$refs.RemarksFormref.resetValidation();
    // },

    // savePending() {
    //   var data;
    //   if (this.isHRApproval) {
    //     data = {
    //       tarID: this.tarID,
    //       pendingBy: "HR personnel",
    //     };
    //   } else {
    //     if (this.$store.state.user.id == this.immHead_user_detailID) {
    //       if (this.$store.state.user.id == this.HRM_user_detailID) {
    //         data = {
    //           tarID: this.tarID,
    //           pendingBy: "Immediate head / HRM Dir",
    //         };
    //       } else {
    //         data = {
    //           tarID: this.tarID,
    //           pendingBy: "Immediate head",
    //         };
    //       }
    //     } else if (this.$store.state.user.id == this.REPDir_user_detailID) {
    //       data = {
    //         tarID: this.tarID,
    //         pendingBy: "REP Dir",
    //       };
    //     } else if (this.$store.state.user.id == this.HRM_user_detailID) {
    //       data = {
    //         tarID: this.tarID,
    //         pendingBy: "HRM Director",
    //       };
    //     }
    //   }
    //   // console.log(data);
    //   this.axiosCall("/tar/pending", "POST", data).then((res) => {
    //     if (res.data.status == 200) {
    //       this.closeD();
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "success";
    //       this.fadeAwayMessage.header = "System Message";
    //       this.fadeAwayMessage.message = res.data.msg;
    //     } else if (res.data.status == 400) {
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.header = "System Message";
    //       this.fadeAwayMessage.message = res.data.msg;
    //     }
    //   });
    // },

    // loadRemarks(id) {
    //   this.axiosCall("/remarks/" + id + "/TAR", "GET").then((res) => {
    //     if (res.data) {
    //       this.remarksData = res.data;
    //     }
    //   });
    // },

    addPC() {
      this.innerAction = "Add";
      this.pcDialog = true;
      this.$refs.PCFormref.reset();
      this.$refs.PCFormref.resetValidation();
    },

    editPC(item, index) {
      this.innerAction = "Edit";
      this.indexToUpdate = index;
      this.pcDetails = item.details;
      this.pcHeader = item.header;
      this.pcDialog = true;
    },

    updatePC() {
      if (this.$refs.PCFormref.validate()) {
        this.pcList[this.indexToUpdate].header = this.pcHeader;
        this.pcList[this.indexToUpdate].details = this.pcDetails;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "success";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Performance Category saved!";
        this.pcDialog = false;
      }
    },

    removePC(index) {
      if (this.pcList[index].id) {
        this.removedPCList.push(this.pcList[index]);
        this.pcList.splice(index, 1);
      } else {
        this.pcList.splice(index, 1);
      }

      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "success";
      this.fadeAwayMessage.header = "System Message";
      this.fadeAwayMessage.message = "Performance Category removed!";
      this.pcDialog = false;
    },

    savePC() {
      if (this.$refs.PCFormref.validate()) {
        this.pcList.push({
          header: this.pcHeader,
          details: this.pcDetails,
        });
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "success";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Performance Category saved!";
        this.pcDialog = false;
      }
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
.grid {
  display: grid;
  row-gap: 2px;
}
#table {
  width: 100%;
  border-collapse: collapse;
}
table,
th,
td {
  border: 1px solid rgb(201, 201, 201);
}
.rem_border_btm {
  border-bottom: none !important;
}
.rem_border_top {
  border-top: none !important;
}
.indent {
  text-indent: 20px;
}
td {
  padding: 5px;
}
</style>
