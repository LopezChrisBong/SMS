<template>
  <div class="mx-2">
    <v-card class="mt-2 d-flex justify-center">
      <!-- <img src="../../assets/img/Frame_dashboard.jpg" alt="" /> -->
      <v-row no-gutters>
        <!--Left Side of Dashboard-->
        <v-col cols="12" sm="12" md="6"> Sample Chart</v-col>
        <!--Right Side of Dashboard-->
        <v-col cols="12" sm="12" md="6">
          Sample Chart 2
        </v-col>
      </v-row>
    </v-card>
    <ViewSetDirectHeadDialog :data="head_data" />
  </div>
</template>

<script>
// import BarChart from "../../components/Charts/samples/BarChart.vue";
import ViewSetDirectHeadDialog from "../../components/Dialogs/Views/ViewSetDirectHeadDialog.vue";
export default {
  components: {
    //  BarChart
    ViewSetDirectHeadDialog,
  },
  data: () => ({
    mini: false,
    scheduledWorks: null,
    dispatchWorks: null,
    cancelledWorks: null,
    completedWorks: null,
    datas: [],
    locator_slip: [],
    head_data: {},
    label: [],
    top_clients: [],
    userType: null,
    ctType: null,
    year: null,
    range: null,
    ctStatus: null,
    coreTimeSched: null,
    initializeTO: [],
    finalTO: [],
    employee_leave: [],
    leaveDescription: null,
    leaveDate: null,
    leaveApprove: false,
  }),
  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
  watch: {},
  methods: {
    coreTimeData() {
      this.axiosCall("/my-core-time/getMyCoreTime", "GET").then((res) => {
        this.ctType = res.data[0].ctType;
        // console.log("data", res.data);
        // console.log("weekends", res.data);
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].isActive == 1) {
            // console.log("Loop", res.data[index]);
            let data = res.data[index].coreTimeSched;
            for (let j = 0; j < data.length; j++) {
              // console.log("inside loop", data[j].workSched);
              for (let k = 0; k < data[j].workSched.length; k++) {
                // console.log("K", data[j].workSched[k]);

                if (this.coreTimeSched == null) {
                  this.coreTimeSched = data[j].workSched[k].substring(0, 3);
                } else {
                  this.coreTimeSched +=
                    ", " + data[j].workSched[k].substring(0, 3) + " ";
                }
              }
              for (let k = 0; k < data[j].schedTimeList.length; k++) {
                // console.log("K", data[j].workSched[k]);
                if (k == 0) {
                  this.coreTimeSched +=
                    this.formatTime(data[j].schedTimeList[k].timeFrom) +
                    " - " +
                    this.formatTime(data[j].schedTimeList[k].timeTo);
                } else {
                  this.coreTimeSched +=
                    " | " +
                    this.formatTime(data[j].schedTimeList[k].timeFrom) +
                    " - " +
                    this.formatTime(data[j].schedTimeList[k].timeTo);
                }
              }
            }
            if (data.length > 0) {
              this.coreTimeSched += " ; ";
            }
          }
        }
        // console.log("coretime", this.coreTimeSched);
        //From
        var dateFrom = new Date(res.data[0].cyFrom);
        const monthFrom = dateFrom.toLocaleString("default", { month: "long" });
        var ddFrom = String(dateFrom.getDate()).padStart(2, "0");
        //To
        var dateTo = new Date(res.data[0].cyTo);
        const monthTo = dateTo.toLocaleString("default", { month: "long" });
        var ddTo = String(dateTo.getDate()).padStart(2, "0");
        var status = res.data[0].status;
        this.ctStatus = status;
        if (dateFrom.getUTCFullYear() == dateTo.getUTCFullYear()) {
          // this.year = dateFrom.getUTCFullYear();
          this.year = res.data[0].SY;
          this.range =
            monthFrom +
            " " +
            ddFrom +
            ", " +
            dateFrom.getUTCFullYear() +
            " - " +
            monthTo +
            " " +
            ddTo +
            ", " +
            dateTo.getUTCFullYear();
        } else {
          this.year = dateFrom.getUTCFullYear() + "-" + dateTo.getUTCFullYear();
          this.range =
            monthFrom +
            " " +
            ddFrom +
            ", " +
            dateFrom.getUTCFullYear() +
            " - " +
            monthTo +
            " " +
            ddTo +
            ", " +
            dateTo.getUTCFullYear();
        }
      });
    },
    locatorData() {
      this.axiosCall("/my-locator-slip/getAllMyLocators", "GET").then((res) => {
        this.locator_slip = res.data[0];
        // console.log("locator slip", this.locator_slip);
      });
    },
    getFirstDate(data) {
      let dump = JSON.parse(data);
      return dump[0];
    },
    isValidJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    travelorderData() {
      this.axiosCall("/travel-order/getMyTravelOrders", "GET").then((res) => {
        console.log("travel order", res.data);
        if (res.data.length == 0) {
          console.log("IF");
          this.initializeTO = { created_at: "2020-05-21T08:32:40.446Z" };
        } else {
          console.log("Else");
          this.initializeTO = res.data[0];
        }
        this.axiosCall("/travel-order/getTaggedTravelOrders", "GET").then(
          (res) => {
            if (res) {
              console.log("Tagged travel Order", res.data[0]);
              if (this.initializeTO.created_at > res.data[0].createdAt) {
                console.log("TO");
                this.finalTO = this.initializeTO;
              } else {
                console.log("TAG");
                this.finalTO = res.data[0];
              }
            }
          }
        );
      });
    },
    // travelOrderTagged() {
    //   this.axiosCall("/travel-order/getTaggedTravelOrders", "GET").then(
    //     (res) => {
    //       if (res) {
    //         console.log("Tagged travel Order", res.data[0].created);
    //       }
    //     }
    //   );
    // },
    leaveData() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall("/leaves/getMyLeaveApplications/" + filter, "GET").then(
        (res) => {
          this.employee_leave = res.data[0];
          this.leaveDescription = this.employee_leave.types.description;
          console.log("Leave", this.employee_leave);

          const startDateStr = this.employee_leave.inclusive_date_from;
          const endDateStr = this.employee_leave.inclusive_date_to;

          // Convert strings to Date objects
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);

          // Format the output string
          // const options = { month: 'long', day: 'numeric', year: 'numeric' };
          const month = startDate.toLocaleString("default", { month: "long" });
          const startDay = startDate.getDate();
          const endDay = endDate.getDate();
          const year = startDate.getFullYear();
          let output;
          if (startDay == endDay) {
            output = " " + month + " " + startDay + "," + year;
          } else {
            output = " " + month + " " + startDay + "-" + endDay + "," + year;
          }
          this.leaveDate = output;
          console.log("Date leave", output);
        }
      );
    },

    gotoCoretime() {
      // console.log("COreTime");
      this.$router.push("/" + this.userType + "/my-coretime-designation");
    },
    gotoLocatorslip() {
      // console.log("Locator");
      this.$router.push("/" + this.userType + "/my-locator-slip");
    },
    gotoTravelorder() {
      // console.log("Travel Order");
      this.$router.push("/" + this.userType + "/my-travel-order");
    },
    gotoLeave() {
      // console.log("Leave");
      this.$router.push("/" + this.userType + "/my-leave");
    },
    gotoPDS() {
      this.$router.push("/" + this.userType + "/my-pds");
    },
    gotoSaln() {
      this.$router.push("/" + this.userType + "/my-saln");
    },

    loadMenu() {
      // this.links = JSON.parse(res.data.assign_mods);
      switch (this.$store.state.user.user.usertypeID) {
        case 1:
          this.userType = "admin";

          break;
        case 2:
          if (this.$store.state.user.user.user_roleID == 5) {
            this.userType = "superadmin";
          } else {
            this.userType = "employee";
          }
          break;
        case 3:
          this.userType = "security";

          break;
      }
    },
    initialize() {
      // this.travelOrderTagged();
      this.getIfHasDirectHead();
      this.getMyDirectHead();
      this.loadMenu();
      this.coreTimeData();
      this.locatorData();
      this.travelorderData();
      this.leaveData();
      // this.getMyDirectHead();
      // let statuses = [1,3,5,6]
      // this.axiosCall("/dashboard/getAllWorkStatusCount", "POST", statuses).then((res) => {
      //   if (res){
      //       this.scheduledWorks = res.data.worksArray[0].work_detail_status_count
      //       this.dispatchWorks = res.data.worksArray[1].work_detail_status_count
      //       this.cancelledWorks = res.data.worksArray[2].work_detail_status_count
      //       this.completedWorks = res.data.worksArray[3].work_detail_status_count
      //       this.$refs.DoughnutChart1.renderGraph(res.data.total.total_works,res.data.worksArray[0].work_detail_status_count)
      //       this.$refs.DoughnutChart2.renderGraph(res.data.total.total_works,res.data.worksArray[1].work_detail_status_count)
      //       this.$refs.DoughnutChart3.renderGraph(res.data.total.total_works,res.data.worksArray[2].work_detail_status_count)
      //       this.$refs.DoughnutChart4.renderGraph(res.data.total.total_works,res.data.worksArray[3].work_detail_status_count)
      //   }
      // });
      // this.axiosCall("/dashboard/getAllTopClients", "GET").then((res) => {
      //   if (res){
      //       this.top_clients = res.data
      //   }
      // });
      // this.axiosCall("/dashboard/getAllWorkRequest", "GET",).then((res) => {
      //   if (res){
      //       res.data.forEach(item => {
      //         this.label.push(item.request_type_description)
      //         this.datas.push(item.work_request_count)
      //       });
      //     this.$refs.PieChart.renderGraph(this.datas,this.label)
      //   }
      // });
      // console.log(this.$store.getters.getIsAuthenticated);
    },
    getMyDirectHead() {
      this.axiosCall("/user-details/getMyDirectHead", "GET").then(
        (res) => {
          console.log(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getIfHasDirectHead() {
      this.axiosCall("/my-direct-head/getIfHasDirectHead", "GET").then(
        (res) => {
          // console.log("hasdirecthead", res.data);
          this.head_data = res.data;
        }
      );
    },
  },
  mounted() {
    // if (this.$store.state.expiryDate < Date.now()) {
    //   this.$store.dispatch("setUser", null);
    //   this.$store.dispatch("setIsAuthenticated", 0);
    //   this.render = true;
    //   this.$router.push("/");

    //   // location.reload();
    // }
    this.initialize();
  },
};
</script>
