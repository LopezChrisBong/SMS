<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    width="500px"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title dark class="dialog-header">
        <h2 class="mt-1 text-h6 white--text">Faculty Information</h2>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="my-4">
        <v-container>
          <v-row>
            <v-col cols="12" class="px-2">
              <v-row>
                <v-col cols="6" class="py-1"
                  ><p class="text-body-1 font-weight-bold">
                    Faculty Name:
                  </p></v-col
                >
                <v-col cols="6" class="py-1"
                  ><div
                    class="text-body-1"
                    style="width:100%; border-bottom:1px solid grey"
                  >
                    {{ name }}
                  </div>
                </v-col>
                <v-col cols="6" class="py-1"
                  ><p class="text-body-1 font-weight-bold">
                    Contact Number:
                  </p></v-col
                >
                <v-col cols="6" class="py-1"
                  ><div
                    class="text-body-1"
                    style="width:100%; border-bottom:1px solid grey"
                  >
                    <span v-if="!contact_no" style="visibility:hidden">X</span>
                    {{ contact_no }}
                  </div></v-col
                >
              </v-row>
            </v-col>

            <v-col>
              <!-- <v-tabs v-model="activeTab" color="#5A67DA" align-tabs="left">
                <v-tab
                  v-for="tab in tabList"
                  :key="tab.id"
                  @click="changeTab(tab)"
                  >{{ tab.name }}</v-tab
                >
              </v-tabs> -->
            </v-col>
          </v-row>

          <!-- <v-row class="ml-2 mr-2">
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium">Employee Name</span>
              <v-text-field
                v-model="name"
                dense
                readonly
                required
                color="#93CB5B"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium"> Date Hired </span>
              <v-text-field
                v-model="date_hired"
                dense
                readonly
                required
                color="#93CB5B"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium"> Employee ID </span>
              <v-text-field
                v-model="date_hired"
                dense
                readonly
                required
                color="#93CB5B"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="ml-2 mr-2">
            <v-col cols="3">
              <span class="text-body-1 font-weight-medium"
                >Status of Appointment</span
              >
              <v-autocomplete
                v-model="empStatusID"
                :rules="[formRules.required]"
                dense
                class="rounded-lg"
                item-text="description"
                item-value="id"
                readonly
                color="#93CB5B"
                :items="empStatusList"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="3">
              <span class="text-body-1 font-weight-medium"> Position </span>
              <v-autocomplete
                v-model="positionID"
                :rules="[formRules.required]"
                dense
                readonly
                class="rounded-lg"
                item-text="description"
                item-value="id"
                color="#93CB5B"
                :items="positionList"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="3">
              <span class="text-body-1 font-weight-medium"> Designation </span>
              <v-autocomplete
                v-model="designationID"
                :rules="[formRules.required]"
                dense
                class="rounded-lg"
                item-text="description"
                item-value="id"
                readonly
                color="#93CB5B"
                :items="designationList"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="3">
              <span class="text-body-1 font-weight-medium"> Office </span>
              <v-autocomplete
                v-model="officeID"
                :rules="[formRules.required]"
                dense
                class="rounded-lg"
                item-text="name"
                item-value="id"
                readonly
                color="#93CB5B"
                :items="officeList"
              >
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="ml-2 mr-2">
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium"
                >Baccalaureate Degree Program</span
              >
              <v-text-field
                dense
                v-model="educBacc"
                class="rounded-lg"
                item-text="description"
                item-value="id"
                readonly
                color="#93CB5B"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium"
                >Master's Degree Program</span
              >
              <v-text-field
                dense
                v-model="educMst"
                class="rounded-lg"
                item-text="description"
                item-value="id"
                readonly
                color="#93CB5B"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <span class="text-body-1 font-weight-medium"
                >Doctorate Degree Program</span
              >
              <v-text-field
                dense
                v-model="educDoc"
                class="rounded-lg"
                item-text="description"
                item-value="id"
                readonly
                color="#93CB5B"
              >
              </v-text-field>
            </v-col>
          </v-row> -->
        </v-container>
      </v-card-text>
    </v-card>
    <!-- <CoreTimeDesignationDialog :action="action" :data="coreTimeDesData" /> -->
    <ViewEmployeeCoreTimeDialog :data="viewData" />
  </v-dialog>
</template>

<script>
// import CoreTimeDesignationDialog from "../Forms/CoreTimeDesignationDialog.vue";

import ViewEmployeeCoreTimeDialog from "../Views/ViewEmployeeCoreTimeDialog.vue";

export default {
  props: {
    data: null,
  },
  components: {
    // CoreTimeDesignationDialog,
    ViewEmployeeCoreTimeDialog,
  },
  data() {
    return {
      dialog: false,
      viewData: null,
      name: null,
      position: null,
      office: null,
      designation: null,
      userID: null,
      institute: null,
      empStatus: null,
      empID: null,
      employeeID: null,
      date_hired: null,
      contact_no: null,
      isActive: null,
      email: null,
      educBg: [],
      educBacc: "",
      educMst: "",
      educDoc: "",
      loading: false,
      table_data: [],
      action: null,
      coreTimeDesData: [],
      coretime_table_data: [],
      designation_table_data: [],
      designation_headers: [
        {
          text: "Designation",
          value: "designation.description",
          align: "start",
          valign: "center",
        },
        {
          text: "Office",
          value: "office.name",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Units Deload",
          value: "units",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "SO number",
          value: "specialOrderNo",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Effectivity Date",
          value: "effectivityDate",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Status",
          value: "isActive",
          align: "center",
          valign: "center",
        },
      ],
      coretime_headers: [
        {
          text: "Calendrical Type",
          value: "ctType",
          align: "start",
          valign: "center",
          sortable: false,
        },
        {
          text: "Academic Year/Calendar Year",
          value: "SY",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Semester",
          value: "sem",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Status",
          value: "isActive",
          align: "center",
          valign: "center",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
        },
      ],

      options: {},
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data) {
          this.userID = data.id;
          this.getEmploymentDetail(data);
          this.loadCoreTime(data.id);
          this.loadDesignation(data.id);
          // this.getEducBg(data.id);
          this.dialog = true;
        }
      },
      deep: true,
    },
    options: {
      handler() {},
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeViewEmployeeCoreTimeDialog", () => {
      this.loadCoreTime(this.userID);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewEmployeeCoreTimeDialog");
  },
  methods: {
    close() {
      this.eventHub.$emit("closeViewEmployeeDetailDialog", false);
      this.dialog = false;
    },

    loadCoreTime(id) {
      this.axiosCall("/my-core-time/getByUser/" + id, "GET").then((res) => {
        if (res) {
          this.coretime_table_data = res.data;
        }
      });
    },

    loadDesignation(id) {
      this.axiosCall("/my-designation/getByUser/" + id, "GET").then((res) => {
        if (res) {
          this.designation_table_data = res.data;
        }
      });
    },

    // initialize(empID) {
    //   this.loading = true;
    //   this.axiosCall("/core-time-designation/getCTDByID/" + empID, "GET").then(
    //     (res) => {
    //       if (res) {
    //         console.log(res.data);
    //         this.table_data = res.data;
    //         this.loading = false;
    //       }
    //     }
    //   );
    // },

    // addCoreTimeDesignation() {
    //   this.coreTimeDesData = {
    //     id: null,
    //     name: this.name,
    //     empID: this.employeeID,
    //   };
    //   this.action = "Add";
    // },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
    },

    // updateCoreTimeDesignation(item) {
    //   this.coreTimeDesData = {
    //     id: item.id,
    //     name: this.name,
    //     empID: item.employeeID,
    //     coreTimeFrom: item.coreTimeFrom,
    //     coreTimeTo: item.coreTimeTo,
    //     schoolYearFrom: item.schoolYearFrom,
    //     schoolYearTo: item.schoolYearTo,
    //     sem: item.sem,
    //     designationID: item.designationID,
    //     wfh: item.wfh,
    //   };
    //   this.action = "Update";
    // },
    getEmploymentDetail(data) {
      this.axiosCall("/employee/user/" + data.id, "GET").then((res) => {
        console.log("ssss", res.data);

        this.employeeID = res.data.id;
        this.name = data.mname
          ? data.fname + " " + data.mname[0] + ". " + data.lname
          : data.fname + " " + data.lname;
        this.officeID = res.data.officeID;
        this.designationID = res.data.designationID;
        this.empStatusID = res.data.empStatusID;
        this.positionID = res.data.positionID.toString();
        this.empID = res.data.empID;
        this.date_hired = res.data.date_hired;
        this.institute = res.data.institute ? res.data.institute.name : null;
        // this.designation = res.data.designation
        //   ? res.data.designation.description
        //   : null;
        this.empStatus = res.data.empStat.description;
        (this.position = res.data.position.description),
          (this.office = res.data.office.name);
        this.email = res.data.user.email;
        this.isActive = res.data.isActive;
        this.contact_no = res.data.user.mobile_no;
        // this.initialize(res.data.id);
      });
    },

    viewItem(item) {
      console.log(item);
      this.viewData = item;
    },

    // getEducBg(id) {
    //   this.educBacc = "";
    //   this.educMst = "";
    //   this.educDoc = "";

    //   this.axiosCall("/educ-background/getByGraduateStudy/" + id, "GET").then(
    //     (res) => {
    //       this.educBg = res.data;

    //       for (let i = 0; i < res.data.length; i++) {
    //         const element = res.data[i];

    //         if (element.level == "College") {
    //           if (this.educBacc == "") {
    //             this.educBacc += element.educ_course;
    //           } else {
    //             this.educBacc += ", " + element.educ_course;
    //           }
    //         } else if (element.level == "Graduate Studies") {
    //           if (element.grad_study_type == "Masteral") {
    //             if (this.educMst == "") {
    //               this.educMst += element.educ_course;
    //             } else {
    //               this.educMst += ", " + element.educ_course;
    //             }
    //           } else if (element.grad_study_type == "Doctorate") {
    //             if (this.educDoc == "") {
    //               this.educDoc += element.educ_course;
    //             } else {
    //               this.educDoc += ", " + element.educ_course;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   );
    // },
  },
};
</script>
