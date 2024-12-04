<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="AddSubjectDialog" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Subject</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    v-model="room_section"
                    label="Room Name"
                    hide-details
                    required
                  ></v-text-field>
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
              color="#519043"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="checkConflict('UPDATE')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
      :timeout="3000"
    ></fade-away-message-component>
    <!-- schedule day of week  -->
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: null,
    action: null,
    grade: null,
  },
  data() {
    return {
      applicantNumber: null,
      juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      seniorList: ["Grade 11", "Grade 12"],
      seniorJunior: null,
      grade_level: null,
      subject_title: null,
      seniorJuniorList: ["Junior High", "Senior High"],
      unit_departmentlist: [],
      dateFrom: null,
      dateTo: null,
      room_section: null,
      updateID: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      remarksData: [],
      confirmSubmissionDialog: false,
      submitBtnLoading: false,
      schedTimeDialog: false,
      schedDialog: false,

      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      dialog: false,
      timePicker1: null,
      timePicker2: null,

      yearSelection: [],
      confirmSubmit: {
        error: false,
        msg: null,
        type: null,
        show: false,
      },

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  computed: {
    getMinDateFrom() {
      let min;
      let monthArr = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      let d = new Date();
      if (this.ctdModel.ctType && this.ctdModel.ctType == 1) {
        if (this.ctdModel.sem == 1) {
          //min is july
          min = d.getFullYear() + "-" + monthArr[6] + "-01";
        } else if (this.ctdModel.sem == 2) {
          //min is january of current uear
          min = d.getFullYear() + "-" + monthArr[0] + "-01";
        } else if (this.ctdModel.sem == 3) {
          //min is june
          min = d.getFullYear() + "-" + monthArr[5] + "-01";
        }
      } else if (this.ctdModel.ctType && this.ctdModel.ctType == 2) {
        min = d.getFullYear() + "-" + monthArr[0] + "-01";
      }
      return min;
    },
    getMaxDateTo() {
      let max;
      let monthArr = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      let d = new Date();
      if (this.ctdModel.ctType && this.ctdModel.ctType == 1) {
        if (this.ctdModel.sem == 1) {
          //max is december current year
          max = d.getFullYear() + "-" + monthArr[11] + "-31";
        } else if (this.ctdModel.sem == 2) {
          //max is june of current year
          max = d.getFullYear() + "-" + monthArr[5] + "-31";
        } else if (this.ctdModel.sem == 3) {
          //max is june
          max = d.getFullYear() + "-" + monthArr[6] + "-31";
        }
      } else if (this.ctdModel.ctType && this.ctdModel.ctType == 2) {
        max = d.getFullYear() + "-" + monthArr[11] + "-31";
      }
      return max;
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data.subject_title);
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
          this.room_section = data.room_section;
          this.grade_level = data.grade_level;
          this.seniorJunior = data.seniorJunior;
          this.dateFrom = data.date_from;
          this.dateTo = data.date_to;
        } else {
          this.$refs.AddSubjectDialog.reset();
          this.initialize();
          this.subject_title = data.subject_title;
          this.grade_level = data.grade_level;
          this.seniorJunior = data.seniorJunior;
          this.dateFrom = data.date_from;
          this.dateTo = data.date_to;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.loadYearSelection();

      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },

    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },

    closeD() {
      this.confirmSubmissionDialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
      this.eventHub.$emit("closeAddSubjectDialog", false);
      this.dialog = false;
    },

    checkConflict(type) {
      if (type == "ADD") {
        if (this.room_section == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            room_section: this.room_section,
            grade_level: this.grade,
          };
          // console.log(data);
          this.axiosCall("/rooms-section", "POST", data).then((res) => {
            console.log(res.data);
            // alert("Successfully Added");

            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Added Subject!";
              this.closeD();
              // location.reload();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      } else if (type == "UPDATE") {
        // alert("UPDATED");
        if (this.room_section == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            room_section: this.room_section,
            grade_level: this.grade,
          };
          console.log(data);
          this.axiosCall("/rooms-section/" + this.updateID, "PATCH", data).then(
            (res) => {
              console.log(res.data);
              if (res.data.status == 201) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Successfully updated subject!";
                this.closeD();
                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          );
        }
      }
    },
  },
};
</script>
