<template>
  <div>
    <v-dialog fullscreen v-model="dialog" eager scrollable max-width="900px">
      <v-form ref="JobAppFormRef" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span class="text-uppercase" :class="action == 1 ? '' : 'd-none'"
              >List of Applicant in {{ JobName }}</span
            >
            <span class="text-uppercase" :class="action == 2 ? '' : 'd-none'"
              >List of Hired Applicant in {{ JobName }}</span
            >
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-data-table :headers="header" :items="jobApplicantData">
              <template v-slot:[`item.birth`]="{ item }">
                {{ formatDate(item.birth) }}
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <div class="text-no-wrap" style="padding: 4px;">
                  <v-btn
                    x-small
                    class="white--text my-2 rounded-lg"
                    :class="action == 1 ? '' : 'd-none'"
                    color="orange"
                    block
                    @click="hireApplicant(item)"
                  >
                    <v-icon left> mdi-plus-box-outline </v-icon>
                    Hire
                  </v-btn>
                  <v-btn
                    x-small
                    class="white--text my-2 rounded-lg"
                    color="#147452"
                    block
                    @click="viewUserData(item)"
                  >
                    <v-icon left> mdi-eye-outline </v-icon>
                    View
                  </v-btn>
                </div>
              </template>
            </v-data-table>
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
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog fullscreen v-model="dialog2" eager scrollable max-width="900px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ action }} Applicant</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD1()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <iframe :src="text"></iframe>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="450">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">Please Confirm of Hiring</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              {{ applicantFullname }} for the position of: <br /><br />{{
                JobName
              }}
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
            Are you sure you want to proceed?
          </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeD()">
            Close
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="confirmHiring()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <MyJobApplication :data="designationData" :action="action" />
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="5000"
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
    MyJobApplication: () => import("./MyJobApplicationDialog.vue"),
  },
  data() {
    return {
      confirmDialog: false,
      designationData: null,
      header: [
        {
          text: "Fullname",
          value: "fullname",
          align: "start",
          valign: "center",
        },
        {
          text: "Position",
          value: "position",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Email",
          value: "email",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Phone no.",
          value: "phone_number",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Gender",
          value: "gender",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Birth Date",
          value: "birth",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Address",
          value: "address",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Religion",
          value: "relegion",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
          sortable: false,
        },
      ],
      JobName: null,
      jobApplicantData: [],
      position: [],
      postedJob: [],
      positionID: null,
      mi: null,
      suffix: null,
      text: "",
      type: "office",
      urls: null,
      show: false,
      id: null,
      dialog: false,
      dialog2: false,
      birth: null,
      empID: null,
      designationID: null,
      units: null,
      effectivityDate: null,
      specialOrderNo: null,
      assigned_office: null,
      schoolYearFrom: null,
      schoolYearTo: null,
      positionname: null,
      sem: null,
      isActive: null,
      syList: [],

      tapTimePartID: null,
      designationList: [],
      officeList: [],

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      applicantFullname: null,
      applicantFullData: [],
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          this.JobName = data.position_title;
          this.show = 1;
          this.id = data.id;
          this.designationID = parseInt(data.designationID);
          this.getEmpDetails();
          this.units = data.units == 0 ? "0" : data.units;
          this.effectivityDate = data.effectivityDate;
          this.specialOrderNo = data.specialOrderNo;
          this.assigned_office = data.assigned_office;
          this.isActive = data.isActive ? "Active" : "Inactive";

          this.initialize();
        } else {
          this.$refs.JobAppFormRef.reset();
          this.initialize();
          this.getEmpDetails();
          this.units = 0;
          this.empID = data.empID;
          this.effectivityDate = null;
          this.specialOrderNo = null;
          this.designationID = null;
          this.sem = null;
          this.isActive = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    viewUserData(item) {
      this.designationData = item;
      this.action = "View";
    },
    hireApplicant(item) {
      this.axiosCall("/job-posting/findJobInHis/" + this.id, "GET").then(
        (res) => {
          console.log(res.data);
          console.log("Applicant---", item);
          if (res.data.applicant_number != 0) {
            this.confirmDialog = true;
            this.applicantFullname = item.fullname;
            this.applicantFullData = item;
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "This Job is already Filled Up!";
          }
        }
      );
    },
    confirmHiring() {
      console.log("Confirm Applicant", this.applicantFullData.id);
      this.axiosCall(
        "/job-applicant/updatedHiringApplicant/" + this.applicantFullData.id,
        "PATCH"
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          this.axiosCall(
            "/job-posting/updatedNumberOfApplicant/" + this.id,
            "PATCH"
          ).then((res) => {
            this.dialog = false;
            this.closeD();
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message =
              res.data.msg + " " + this.applicantFullname;
            this.$refs.MyDesignationFormref.reset();
          });
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    getJobPostId() {
      if (this.action == 1) {
        this.axiosCall(
          "/job-applicant/getApplicantSpecificJob/" + this.id,
          "GET"
        ).then((res) => {
          console.log("POSTED JOB", res.data);
          this.jobApplicantData = res.data;
        });
      } else {
        this.axiosCall(
          "/job-applicant/getHiredApplicant/" + this.id,
          "GET"
        ).then((res) => {
          console.log("POSTED JOB", res.data);
          this.jobApplicantData = res.data;
        });
      }
    },

    initialize() {
      console.log("Data", this.data);
      //   this.getOffices();
      //   this.getSchoolYear();
      //   this.getDesignations();
      this.getJobPostId();
    },
    getSYItemText(item) {
      return `${item.syFrom} - ${item.syTo}`;
    },
    getPart(id) {
      let prt;
      for (let i = 0; i < this.tapTimeList.length; i++) {
        if (this.tapTimeList[i].id == id) {
          prt = this.tapTimeList[i].title;
        }
      }
      return prt;
    },

    computeDaylist() {
      let days = [];
      for (let i = 0; i < this.schedList.length; i++) {
        let el = this.schedList[i].workSched;
        for (let j = 0; j < el.length; j++) {
          days.push(el[j]);
        }
      }

      // setting disabled property
      if (days.length > 0) {
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < this.dayList.length; j++) {
            let dayListName = this.dayList[j].name;
            if (days[i] == dayListName) {
              this.dayList[j].disabled = true;
            }
          }
        }
      } else {
        for (let i = 0; i < this.dayList.length; i++) {
          this.dayList[i].disabled = false;
        }
      }
    },

    closeSchedDialog() {
      this.$refs.schedDialogRef.resetValidation();
      this.schedDialog = false;
    },

    saveSched() {
      if (this.$refs.schedDialogRef.validate()) {
        if (this.schedTimeList.length > 0) {
          this.schedList.push({
            workSched: this.schedWfh,
            schedTimeList: this.schedTimeList,
            // timeIn: this.timePicker1,
            // timeOut: this.timePicker2,
          });
          this.schedTimeList = [];
          this.schedDialog = false;
          this.computeDaylist();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please add time schedule/s!";
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up all fields!";
      }
    },

    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      //closed
      this.eventHub.$emit("closeApplicantJobList", false);
      this.dialog = false;
      this.dialog2 = false;
      this.confirmDialog = false;
      this.show = false;
    },
    closeD1() {
      this.dialog2 = false;
    },
    addnew() {
      if (
        this.applicationletter &&
        this.pds &&
        this.eligibility &&
        this.tor &&
        this.employment &&
        this.seminars
      ) {
        const fd = new FormData();

        let letter = this.applicationletter;
        let pds = this.pds;
        let performance = this.performance;
        let eligibility = this.eligibility;
        let tor = this.tor;
        let employment = this.employment;
        let seminars = this.seminars;
        const arraaay = [
          letter,
          pds,
          performance,
          eligibility,
          tor,
          employment,
          seminars,
        ];
        console.log("arraaay", arraaay);

        for (let i = 0; i < arraaay.length; i++) {
          const element = arraaay[i];
          fd.append("file", element);
        }
        console.log(fd);

        let gender;
        if (this.gender == 0) {
          gender = "Male";
        } else {
          gender = "Female";
        }

        const data = {
          firstname: this.firstname,
          mi: this.mi,
          suffix: this.suffix,
          position: this.position,
          lastname: this.lastname,
          email: this.email,
          phone_number: this.phone,
          gender: gender,
          country: this.country,
          zip_code: this.zipcode,
        };
        console.log(data);
        fd.append("body", JSON.stringify(data));
        console.log("FD", fd);
        this.axiosCall("/job-applicant/multiple", "POST", fd).then((resp) => {
          this.dialog = false;
          console.log(resp);
          if (resp.status == 201) {
            alert("Succesfully Added:", resp.data.mg);
          } else if (resp.status == 400) {
            alert("not okay");
          }
        });
      } else {
        alert("Please Fill in all data needed");
      }
    },

    update() {
      if (this.$refs.MyDesignationFormref.validate()) {
        let data = {
          designationID: this.designationID,
          effectivityDate: this.effectivityDate,
          specialOrderNo: this.specialOrderNo,
          assigned_office: this.assigned_office,
          units: this.units,
          isActive: this.isActive == "Active" ? true : false,
        };

        this.axiosCall("/my-designation/" + this.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.MyDesignationFormref.reset();
              this.closeD();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      }
    },

    getSchoolYear() {
      this.axiosCall("/school-year", "GET").then((res) => {
        console.log(res.data);
        this.syList = res.data;
      });
    },

    getEmpDetails() {
      this.axiosCall("/employee/my-details", "GET").then((res) => {
        console.log(res.data);
        this.assigned_office = res.data.officeID;
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
  },
};
</script>
