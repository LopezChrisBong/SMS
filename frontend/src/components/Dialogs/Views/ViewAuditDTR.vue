<template>
  <div>
    <v-dialog v-model="dialog" scrollable persistent fullscreen>
      <v-card>
        <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
          <span>Employee DTR</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 800px;" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-center font-weight-bold">
                  Davao del Norte State College
                </div>
                <div class="text-center" style="font-size:12px">
                  Brgy. New Visayas, Panabo City, Philippines 8105
                </div>
                <div class="text-center" style="font-size:12px">
                  Website: <span style="color:blue">www.dnsc.edu.ph</span> |
                  Email: <span style="color:blue">hrmo@dnsc.edu.ph</span>
                </div>
                <div class="text-center mt-2 font-weight-bold">
                  Daily Time Record for the period of
                  {{ periodDate ? periodDate : "" }}
                </div>
                <div class="d-flex mt-4">
                  <div
                    style="font-size:12px;width:20%"
                    class="text-left  font-weight-bold"
                  >
                    Legend
                  </div>
                  <div
                    style="font-size:12px;width:60%"
                    class="font-weight-bold d-flex justify-space-between"
                  >
                    <div style="font-size:12px;" class="">
                      <span class="font-weight-bold">AHW</span> -Actual Hours
                      Worked
                    </div>
                    <div style="font-size:12px;" class=" ">
                      <span class="font-weight-bold">OHW</span> -Official Hours
                      Worked
                    </div>
                    <div style="font-size:12px; " class=" ">
                      <span class="font-weight-bold">OT</span> - Overtime
                    </div>

                    <div style="font-size:12px; " class=" ">
                      <span class="font-weight-bold">LT</span> - Lates
                    </div>
                    <div style="font-size:12px; " class=" ">
                      <span class="font-weight-bold">UT</span> - Undertime
                    </div>
                  </div>
                </div>
                <div class="d-flex mt-4">
                  <div style="font-size:12px;width:40%" class="text-left  ">
                    Employee No. &nbsp; &nbsp; &nbsp;<span
                      class="font-weight-bold"
                      style="text-decoration : underline"
                      >{{ empID ? empID : "" }}</span
                    >
                  </div>
                  <div
                    style="font-size:12px;width:30%"
                    class="d-flex justify-space-between"
                  >
                    <div style="font-size:12px;" class="">
                      Name:
                      <span class="ml-6 font-weight-bold">
                        {{ name ? name.toUpperCase() : "" }}</span
                      >
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <table>
                  <tr>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Date
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Day
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      In
                    </td>
                    <td
                      colspan="2"
                      width="10%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Break
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Out
                    </td>
                    <td
                      colspan="2"
                      width="10%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Overtime
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      AHW
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      OHW
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      OT
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      LT
                    </td>
                    <td
                      rowspan="2"
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      UT
                    </td>
                    <td
                      rowspan="2"
                      colspan="2"
                      width="20%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Remarks
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Out
                    </td>
                    <td
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      In
                    </td>
                    <td
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      In
                    </td>
                    <td
                      width="5%"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Out
                    </td>
                  </tr>
                  <tr v-for="item in dtrData" :key="item.date_no">
                    <td align="center" class="text-caption ">
                      {{ item.date_no }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.day_of_week }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.amIn }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.amOut }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.pmIn }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.pmOut }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.otIn }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.otOut }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.HW ? parseFloat(item.HW).toFixed(2) : "" }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{ item.OHW ? parseFloat(item.OHW).toFixed(2) : "" }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{
                        item.OT && item.OT != "0.00" && item.OT != null
                          ? item.OT
                          : ""
                      }}
                    </td>

                    <td align="center" class="text-caption ">
                      {{
                        item.LATE && item.LATE != "0.00" && item.LATE != null
                          ? item.LATE
                          : ""
                      }}
                    </td>
                    <td align="center" class="text-caption ">
                      {{
                        item.UT && item.UT != "0.00" && item.UT != null
                          ? item.UT
                          : ""
                      }}
                    </td>
                    <td colspan="2" align="center" class="text-caption "></td>
                  </tr>

                  <tr>
                    <td
                      colspan="14"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Gross
                    </td>
                  </tr>

                  <tr>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Actual Hours Worked (AHW):
                    </td>
                    <td
                      colspan="3"
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_AHW ? gross_AHW.toFixed(2) : "0.00" }}
                    </td>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Late (LT):
                    </td>
                    <td
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_LT ? gross_LT.toFixed(2) : "0.00" }}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Office Hours Worked (OHW):
                    </td>
                    <td
                      colspan="3"
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_OHW ? gross_OHW.toFixed(2) : "0.00" }}
                    </td>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Undertime (UT)
                    </td>
                    <td
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_UT ? gross_UT.toFixed(2) : "0.00" }}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Overtime (OT):
                    </td>
                    <td
                      colspan="3"
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_OT ? gross_OT.toFixed(2) : "0.00" }}
                    </td>
                    <td align="center" colspan="5" class="text-caption  pa-1">
                      Days Present (DP)
                    </td>
                    <td
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ gross_DaysPresent }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="14"
                      align="center"
                      class="text-caption font-weight-bold"
                    >
                      Net
                    </td>
                  </tr>
                  <tr>
                    <td align="center" colspan="3" class="text-caption  pa-1">
                      Total Hours Worked
                      {{ employee_status > 2 ? "[(DPx8)+OT]" : "(OHW + OT)" }}
                    </td>
                    <td
                      colspan="2"
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ total_HW ? total_HW.toFixed(2) : "0.00" }}
                    </td>
                    <td align="center" colspan="3" class="text-caption  pa-1">
                      Total Deductions (LT+UT)
                    </td>
                    <td
                      colspan="2"
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{
                        total_deductions ? total_deductions.toFixed(2) : "0.00"
                      }}
                    </td>
                    <td align="center" colspan="3" class="text-caption  pa-1">
                      Total Days Present
                    </td>
                    <td
                      align="center"
                      class="text-caption font-weight-bold  pa-1"
                    >
                      {{ total_days_present }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colspan="14"
                      align="left"
                      class="text-caption font-weight-bold pl-4 py-2"
                    >
                      Remarks
                    </td>
                  </tr>
                </table>
              </v-col>
              <v-col cols="12">
                <div class="text-caption font-weight-bold d-flex">
                  Approved Coretime: <span style="visibility:hidden">X</span>
                  <div class="text-caption">
                    {{ formatDate(coretime.AY_FROM) }} To
                    {{ formatDate(coretime.AY_TO) }}
                  </div>
                </div>
                <div class="text-caption">
                  <div
                    v-for="(item, i) in coretime.sched"
                    :key="i"
                    class=" d-inline"
                  >
                    <span class="font-weight-medium">{{ item.core_day }}</span>
                    {{ item.core_time }};
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="text-center">
                  I certify that the entries on this record, which were made by
                  myself daily at the time of arrival at and departure from
                  office are true and correct.
                </div>

                <div
                  class=" d-flex justify-space-around "
                  style="margin-top:60px"
                >
                  <div style="width:40%">
                    <div style="border-bottom:1px solid black"></div>
                    <div class="text-caption text-center">
                      Employee's Signature
                    </div>
                  </div>

                  <div style="width:40%">
                    <div style="border-bottom:1px solid black"></div>
                    <div class="text-caption text-center">
                      Authorized Official
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <!-- <v-btn
            outlined
            :loading="isLoading"
            :disabled="isLoading"
            color="#5a67da"
            @click="printDTR()"
            >Print</v-btn
          > -->
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
    tab: null,
  },
  components: {
    // ViewFileDialog: () => import("../Views/ViewFileDialog.vue"),
    // ViewEmployeeLeaveDialog: () =>
    //   import("../Views/ViewEmployeeLeaveDialog.vue"),
  },
  data() {
    return {
      isLoading: false,
      addRemarksDialog: false,
      filename: null,
      empID: null,
      id: null,
      name: null,
      gross_AHW: null,
      gross_OHW: null,
      gross_OT: null,
      gross_LT: null,
      gross_UT: null,
      gross_DaysPresent: null,
      total_HW: null,
      total_deductions: null,
      total_days_present: null,
      coretime: null,
      employee_status: null,
      dialog: false,
      period: null,
      dtrData: [],
      mnthyr: null,
      periodDate: null,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],

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
        console.log("heere", data);
        this.empID = data.empID;
        this.id = data.id;
        this.mnthyr = data.monthyr;
        this.name = data.name;
        this.period = data.period;
        this.loadEmployeeDTR();
        this.getDtrPeriod();
      },
      deep: true,
    },
  },

  methods: {
    printDTR() {
      let url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/generateDTR/" +
        this.id +
        "/" +
        this.mnthyr +
        "/" +
        this.period;

      let token = localStorage.getItem("token");
      const tab = window.open("about:blank");
      this.isLoading = true;
      fetch(url, { headers: { Authorization: `Bearer ${token}` } }) // FETCH BLOB FROM IT
        .then((response) => response.blob())
        .then((blob) => {
          // RETRIEVE THE BLOB AND CREATE LOCAL URL
          var _url = window.URL.createObjectURL(blob);

          tab.location = _url;
          tab.focus();
          // window.open(_url, "_blank").focus();
          this.isLoading = false; // window.open + focus
        })
        .catch((err) => {
          console.log(err);
        });
      // window.open(url);
    },
    computeAnnual(value) {
      var annual = 0;
      for (let index = 0; index < 12; index++) {
        annual += parseFloat(value);
      }
      return annual;
    },
    confirmDialogBtn(action) {
      this.confirmAction = action;
      this.confirmDialog = true;
    },
    viewEmpLeave() {
      this.empIDToView = null;
      setTimeout(() => {
        this.empIDToView = { empID: this.empID, id: this.id };
      }, 50);
    },

    getDtrPeriod() {
      let d = new Date(this.mnthyr);
      if (this.period == 1) {
        this.periodDate =
          this.months[d.getMonth()] + " 1 to 15, " + d.getFullYear();
      } else if (this.period == 2) {
        let lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        this.periodDate =
          this.months[d.getMonth()] +
          " 16 to " +
          lastDay.getDate() +
          ", " +
          d.getFullYear();
      } else if (this.period == 3) {
        let lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        this.periodDate =
          this.months[d.getMonth()] +
          " 1 to " +
          lastDay.getDate() +
          ", " +
          d.getFullYear();
      }
    },

    addRemarks() {
      this.addRemarksDialog = true;
      this.$refs.RemarksFormref.reset();
    },
    viewFile(file) {
      this.filename = null;
      setTimeout(() => {
        this.filename = file;
      }, 50);
    },

    loadEmployeeDTR() {
      this.axiosCall(
        "/dtr/getEmployeeDtr/" +
          this.id +
          "/" +
          this.mnthyr +
          "/" +
          this.period,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data.dtr);
          this.dtrData = res.data.dtr;
          this.gross_AHW = res.data.gross_AHW;
          this.gross_OHW = res.data.gross_OHW;
          this.gross_OT = res.data.gross_OT;
          this.gross_LT = res.data.gross_LT;
          this.gross_UT = res.data.gross_UT;
          this.gross_DaysPresent = res.data.gross_DaysPresent;
          this.total_HW = res.data.total_HW;
          this.total_deductions = res.data.total_deductions;
          this.total_days_present = res.data.total_days_present;
          this.coretime = res.data.coretime;
          this.employee_status = res.data.employee_status;
        }
      });
    },

    editItem(index, item) {
      this.addRemarksDialog = true;
      this.remarks = item.remarks;
      // if (
      //   item.appointment_status == "Casual" ||
      //   item.appointment_status == "Job Order"
      // ) {
      //   this.isSalaryEditable = true;
      // } else {
      //   this.isSalaryEditable = false;
      // }

      this.indexToUpdate = index;
      this.$refs.RemarksFormref.reset();
      console.log(index, item);
    },

    saveUpdate() {
      if (this.$refs.RemarksFormref.validate()) {
        this.serviceRecordData[this.indexToUpdate].remarks = this.remarks;
        this.serviceRecordData[this.indexToUpdate].rate_per_day = this.salary;
        this.addRemarksDialog = false;
      }
    },

    savePendingRemarks() {
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          leaveID: this.id,
          remarksMsg: this.remarksMsg,
        };
        this.axiosCall("/leaves/pendingBy/certify", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.addRemarksDialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      }
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/LEAVE", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewEmployeeDTRDialog", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.line_border {
  border-bottom: 1px solid darkgray;
}
table {
  width: 100%;
}
td {
  padding: 2px;
}

table,
td {
  border-collapse: collapse !important;
  border: 1px solid grey;
}
::v-deep .centered-input input {
  text-align: center;
}
</style>
