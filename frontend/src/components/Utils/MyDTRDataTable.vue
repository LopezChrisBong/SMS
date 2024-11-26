<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="5" class="d-flex">
        <!-- <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
        <v-autocomplete
          :items="monthsArr"
          v-model="selectedMnth"
          item-text="mnth"
          item-value="val"
          outlined
          dense
          label="Month"
          class="rounded-lg mx-1"
        ></v-autocomplete>
        <v-autocomplete
          v-if="!isPlantilla"
          :items="dtr_filter"
          v-model="selectedDtrFilter"
          item-text="description"
          item-value="id"
          outlined
          dense
          label="Period"
          class="rounded-lg mx-1"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" class="d-flex justify-end">
        <v-btn @click="getDTR()" color="#519043" class="white--text mx-1">
          Select
        </v-btn>
        <v-btn
          v-if="dtrData.length > 0"
          @click="printDTR()"
          color="#519043"
          class="white--text mx-1"
        >
          Print
        </v-btn>
      </v-col>
    </v-row>

    <v-card style=" max-height: 800px;" class="my-4" elevation="0" outlined>
      <div
        class="px-5 elevation-1"
        style=" max-height: 600px; overflow:hidden; overflow-y:auto"
      >
        <v-row v-if="dtrData.length > 0">
          <v-col cols="12">
            <div class="text-center font-weight-bold">
              Davao del Norte State College
            </div>
            <div class="text-center" style="font-size:12px">
              Brgy. New Visayas, Panabo City, Philippines 8105
            </div>
            <div class="text-center" style="font-size:12px">
              Website: <span style="color:blue">www.dnsc.edu.ph</span> | Email:
              <span style="color:blue">hrmo@dnsc.edu.ph</span>
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
                  <span class="font-weight-bold">AHW</span> -Actual Hours Worked
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
            <table class="table">
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
                  {{ item.HW }}
                </td>
                <td align="center" class="text-caption ">
                  {{ item.OHW }}
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
                <td align="center" class="text-caption font-weight-bold  pa-1">
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
                <td align="center" class="text-caption font-weight-bold  pa-1">
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
                <td align="center" class="text-caption font-weight-bold  pa-1">
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
                  {{ employee_status > 2 ? "[(DPx8)+OT]" : "(OHW+OT)" }}
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
                  {{ total_deductions ? total_deductions.toFixed(2) : "0.00" }}
                </td>
                <td align="center" colspan="3" class="text-caption  pa-1">
                  Total Days Present
                </td>
                <td align="center" class="text-caption font-weight-bold  pa-1">
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
          <v-col cols="12" class="">
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
          <v-col cols="12" class="mt-2">
            <div class="text-center text-caption">
              I certify that the entries on this record, which were made by
              myself daily at the time of arrival at and departure from office
              are true and correct.
            </div>

            <div class=" d-flex justify-space-around " style="margin-top:60px">
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

        <v-row v-if="dtrData.length == 0">
          <v-col cols="12" class="text-center">
            <div class="text-caption">No data found.</div>
          </v-col>
        </v-row>
      </div>

      <!-- <v-data-table
        :headers="headers"
        :items="employees"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-btn x-small color="grey" outlined @click="viewItem(item)">
            <v-icon size="14">mdi-eye</v-icon>
            View
          </v-btn>
        </template>
      </v-data-table> -->
    </v-card>
    <!-- <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            color="#519043"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>
      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          color="#519043"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row> -->

    <!-- <DTRDialog :data="addData" />
    <ViewEmployeeDTRDialog :data="viewData" />
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to {{ confirmAction }} this locator slip?
            </p>
          </div>
        </div>

   
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="confirmAction == 'approve'"
            color="green"
            class="white--text"
            @click="approve()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'deny'"
            color="green"
            class="white--text"
            @click="deny()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
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
  components: {
    // DTRDialog: () => import("../../components/Dialogs/Forms/DTRDialog.vue"),
    // ViewEmployeeDTRDialog: () =>
    //   import("../../components/Dialogs/Views/ViewEmployeeDTRDialog.vue"),
  },
  data: () => ({
    search: "",
    underDevtoDisplay: false,
    headers: [
      {
        text: "Date",
        value: "name",
        align: "start",
        valign: "start",
      },
      {
        text: "Employee ID",
        value: "empID",
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
    isPlantilla: false,
    dtr_filter: [
      {
        id: 1,
        description: "1st Quincena",
      },
      {
        id: 2,
        description: "2nd Quincena",
      },
      // {
      //   id: 3,
      //   description: "Whole Month",
      // },
    ],
    selectedDtrFilter: null,
    selectedMnth: null,
    monthsArr: [
      {
        val: "01",
        mnth: "January",
      },
      {
        val: "02",
        mnth: "February",
      },
      {
        val: "03",
        mnth: "March",
      },
      {
        val: "04",
        mnth: "April",
      },
      {
        val: "05",
        mnth: "May",
      },
      {
        val: "06",
        mnth: "June",
      },
      {
        val: "07",
        mnth: "July",
      },
      {
        val: "08",
        mnth: "August",
      },
      {
        val: "09",
        mnth: "September",
      },
      {
        val: "10",
        mnth: "October",
      },
      {
        val: "11",
        mnth: "November",
      },
      {
        val: "12",
        mnth: "December",
      },
    ],
    empID: null,
    name: null,
    totalHours: null,
    totalOT: null,
    totalUT: null,
    totalLT: null,
    id: null,
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

    data: [],

    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "My Leave Credits" },
    tab: 1,
    tabList: [
      { id: 1, name: "My Leave Credits" },
      { id: 2, name: "My Leave Application" },
      { id: 3, name: "My Leave Card" },
      { id: 4, name: "My CTO" },
    ],
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],

    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  watch: {
    options: {
      handler() {
        // console.log(this.activeTab);
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          console.log(oldData, newData);
          this.initialize();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  mounted() {
    // this.loadLeaveCredits();
    this.initialize();
    // this.eventHub.$on("closeDTRDialog", () => {
    //   this.initialize();
    // });
    // this.eventHub.$on("closeViewEmployeeDTRDialog", () => {
    //   this.initialize();
    // });
  },
  beforeDestroy() {
    // this.eventHub.$off("closeDTRDialog");
    // this.eventHub.$off("closeViewEmployeeDTRDialog");
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize(tab.id);
    },

    initialize() {
      this.getMyEmploymentStatus();
      // this.axiosCall("/dtr/getActiveEmployees", "GET").then((res) => {
      //   if (res) {
      //     this.employees = res.data;
      //     this.loading = false;
      //   }
      // });
    },

    getDtrPeriod(date, period) {
      if (date && period) {
        console.log(date, period);
        let d = new Date(date);
        // console.log(d);
        if (period == "1") {
          this.periodDate =
            this.monthsArr[d.getMonth()].mnth + " 1 to 15, " + d.getFullYear();
        } else if (period == "2") {
          let lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);

          this.periodDate =
            this.monthsArr[d.getMonth()].mnth +
            " 16 to " +
            lastDay.getDate() +
            ", " +
            d.getFullYear();
        } else if (period == "3") {
          let lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          this.periodDate =
            this.monthsArr[d.getMonth()].mnth +
            " 1 to " +
            lastDay.getDate() +
            ", " +
            d.getFullYear();
        }
      }
    },

    getDTR() {
      let mnthyr;
      let period;
      if (this.filterYear != "All") {
        if (this.isPlantilla) {
          if (this.selectedMnth) {
            mnthyr = this.filterYear + "-" + this.selectedMnth + "-01";
          }
          period = 3;
        } else {
          if (this.selectedMnth && this.selectedDtrFilter) {
            period = this.selectedDtrFilter;
            mnthyr = this.filterYear + "-" + this.selectedMnth + "-01";
          }
          // else {
          //   period = 1;
          //   let d = new Date();
          //   let mm = this.monthsArr[d.getMonth()].val;
          //   let yy = d.getFullYear();
          //   mnthyr = yy + "-" + mm + "-01";
          // }
        }

        if (mnthyr && period) {
          this.getDtrPeriod(mnthyr, period);

          this.axiosCall("/dtr/getMyDtr/" + mnthyr + "/" + period, "GET").then(
            (res) => {
              if (res) {
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
                this.name = res.data.name;
                this.empID = res.data.employee_id;
                this.id = res.data.id;
              }
            }
          );
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          if (this.isPlantilla) {
            this.fadeAwayMessage.message = "Please select month to generate!";
          } else {
            this.fadeAwayMessage.message =
              "Please select month and period to generate!";
          }
        }
      }
    },

    getMyEmploymentStatus() {
      this.axiosCall("/employee/getMyEmploymentStatus", "GET").then((res) => {
        if (res) {
          if (res.data.id == 1 || res.data.id == 2 || res.data.id == 6) {
            this.isPlantilla = true;
          } else {
            this.isPlantilla = false;
          }
        }
      });
    },

    printDTR() {
      let mnthyr;
      let period;
      if (this.filterYear != "All") {
        if (this.selectedMnth && this.selectedDtrFilter) {
          mnthyr = this.filterYear + "-" + this.selectedMnth + "-01";
          if (this.isPlantilla) {
            period = 3;
          } else {
            period = this.selectedDtrFilter;
          }
        } else {
          if (this.isPlantilla) {
            period = 3;
          } else {
            period = 1;
          }

          let d = new Date();
          // let mm = this.monthsArr[d.getMonth()].val;
          let mm = this.selectedMnth;
          let yy = d.getFullYear();
          mnthyr = yy + "-" + mm + "-01";
        }
        let url =
          process.env.VUE_APP_SERVER +
          "/pdf-generator/generateDTR/" +
          this.id +
          "/" +
          mnthyr +
          "/" +
          period;

        window.open(url);
      }
    },

    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      this.updateData = [{ id: null }];
      setTimeout(() => {
        this.updateData = item;
        this.action = "Update";
      }, 100);
    },
    confirm(action, item) {
      // console.log(item);
      this.confirmAction = action;
      this.confirmDialog = true;
      this.confirmApprovalID = item.id;
    },
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
tr:first-child th:last-child {
  border-top-right-radius: 10px;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}

/* tr:nth-child(2) th:first-child {
  border-top-left-radius: none;
}
tr:nth-child(2) th:last-child {
  border-top-right-radius: none;
} */

tr td {
  border: 1px solid rgb(206, 202, 202);
}
</style>
