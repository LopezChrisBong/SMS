<template>
  <div class="mx-2">
    <v-card
      class="mt-2 rounded-xl"
      style="
        min-height: 85vh;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.4);
      "
    >
      <v-row class="mx-4">
        <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <v-card class="card-style" style="margin-top: 10pt">
            <v-row>
              <v-col cols="12" class="pt-16 text-center">
                <p class="text-h1">{{ enrollData }}/{{ verifyData }}</p>
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                  >Overall Enrolled Student / For Verification
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <v-card class="card-style" style="margin-top: 10pt">
            <v-row>
              <v-col cols="12" class="pt-16 text-center">
                <p class="text-h1">
                  {{
                    this.$store.state.user.user.assignedModuleID == 3
                      ? totalStudent
                      : totalStudentElementary
                  }}
                </p>
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                  >Projected Enrollment (Next SY)
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <ForecastLineChart
            :forecastData="
              $store.state.user.user.assignedModuleID == 3
                ? forecastData
                : forecastDataElementary
            "
          />
        </v-col>
        <v-col lg="6" xl="6" md="6" sm="12" xs="12"
          ><ForecastBarChart
            :forecastData="
              $store.state.user.user.assignedModuleID == 3
                ? forecastData
                : forecastDataElementary
            "
        /></v-col>
        <v-col cols="12">
          <div class="d-flex justify-center">
            <ForecastGradeBarChart
              :forecastData="
                $store.state.user.user.assignedModuleID == 3
                  ? forecastData
                  : forecastDataElementary
              "
            />
          </div>
        </v-col>
        <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <v-card class="card-style">
            <v-row>
              <v-col cols="12" class="pt-16">
                <PieChart :data="TeachingNonTeaching" />
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                  >Teaching Employee/ Non-Teaching Employee
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <v-card class="card-style">
            <v-row>
              <v-col cols="12" class="pt-16">
                <PieChart1 :data="maleFemale" />
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                  >Male Employee / Female Employee
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- <v-col lg="6" xl="6" md="6" sm="12" xs="12">
          <v-card class="card-style">
            <v-row>
              <v-col cols="12" class="pt-16">
                <LineChartVue :data="maleFemale" />
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                >
                  Number of teachers to be hired
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col> -->
        <v-col cols="12">
          <v-card class="card-style">
            <v-row>
              <v-col cols="12" class="pt-16">
                <AreaChart />
              </v-col>
              <v-col cols="12 ">
                <v-divider></v-divider>
                <v-list-item-title
                  color="#808191"
                  class="grey--text px-2 py-3 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                >
                  Enrollee Demographics
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import PieChart from "../../components/Charts/NewCharts/Pie.vue";
import PieChart1 from "../../components/Charts/NewCharts/Bar.vue";
import AreaChart from "../../components/Charts/AreaChart.vue";
// import LineChartVue from "../../components/Charts/LineChart.vue";
import ForecastLineChart from "../../components/Charts/ForecastLineChart.vue";
import ForecastBarChart from "../../components/Charts/ForecastBarChart.vue";
import ForecastGradeBarChart from "../../components/Charts/ForecastGradeBarChart.vue";
export default {
  components: {
    PieChart,
    PieChart1,
    AreaChart,
    // LineChartVue,
    ForecastLineChart,
    ForecastBarChart,
    ForecastGradeBarChart,
  },
  data: () => ({
    mini: false,
    upcoming_bdays: [],
    hasUpcomingBday: false,
    forecastData: [],
    forecastDataElementary: [],
    head_data: {},
    dispatchWorks: null,
    cancelledWorks: null,
    completedWorks: null,
    maleCnt: 0,
    femaleCnt: 0,
    maleFemale: {},
    datas: {},
    TeachingNonTeaching: {},
    label: [],
    top_clients: [],
    enrollData: null,
    verifyData: null,
    today: null,
    activeCalendar: null,
    tracked: {},
    totalStudent: null,
    totalStudentElementary: null,
    teaching: null,
    nonTeaching: null,
    demographics: [],
    isCalendarFocus: false,
    bdays: [],
    colors: ["#1867c0", "#fb8c00", "#000000"],
    category: ["Development", "Meetings", "Slacking"],
    data: [30, 12, 58, 44, 12, 46, 89, 67],
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    title: "Test chart",
    sideText: "Some data",
    color: ["#2D9CDB"],
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.events.forEach((e) => (map[e.date] = map[e.date] || []).push(e));
      return map;
    },
  },
  watch: {
    "$store.getters.getFilterSelected"() {
      this.initialize();
    },
  },
  methods: {
    initialize() {
      this.getTeachingNonTeachingCount();
      this.getMaleFemaleCount();
      this.getTotalEnrolledStudent();

      const moduleID = Number(this.$store.state.user.user.assignedModuleID);

      if (moduleID === 3 || moduleID === 21) {
        // this.getEnrollmentSummary();
        // this.getEnrollmentElementarySummary();
        this.getDataForForcastingHighSchool();
        this.getDataForForcastingElementary();
      }
    },
    getEnrollmentSummary() {
      this.axiosCall("/enroll-student/generate", "POST", {}).then((res) => {
        if (res) {
          console.log(res.data);
        }
      });
    },
    getEnrollmentElementarySummary() {
      this.axiosCall("/enroll-student/generateElementary", "POST", {}).then(
        (res) => {
          if (res) {
            console.log(res.data);
          }
        },
      );
    },
    getDataForForcastingHighSchool() {
      this.axiosCall(
        "/enroll-student/getDataForForcastingHighSchool",
        "GET",
      ).then((res) => {
        if (res) {
          // console.log("getDataForForcastingHighSchool", res.data);
          this.forecastData = res.data;
          this.totalStudent = res.data[1].totalStudents;
        }
      });
    },
    getDataForForcastingElementary() {
      this.axiosCall(
        "/enroll-student/getDataForForcastingElementary",
        "GET",
      ).then((res) => {
        if (res) {
          console.log("getDataForForcastingElementary", res.data);
          this.forecastDataElementary = res.data;
          this.totalStudentElementary = res.data[1].totalStudents;
        }
      });
    },

    getDayOnDate() {
      if (this.selectedDay) {
        let d = this.selectedDay.substr(8, 2);
        return parseInt(d);
      }
    },

    getBday(event, date) {
      this.isCalendarFocus = true;
      this.selectedDay = date;
      this.bdays = event;
      console.log(event, date);
    },

    open(event) {
      alert(event.title);
    },

    getMaleFemaleCount() {
      this.axiosCall("/user-details/getMaleFemaleCount", "GET").then(
        (res) => {
          console.log(res.data.female);
          if (res.data) {
            this.maleCnt = res.data.male;
            this.femaleCnt = res.data.female;
            this.maleFemale = {
              label: ["Male", "Female"],
              data: [res.data.male, res.data.female],
            };
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },

    getTeachingNonTeachingCount() {
      this.axiosCall("/user-details/getTeachingNon", "GET").then(
        (res) => {
          if (res.data) {
            this.nonTeaching = res.data.nonTeaching;
            this.teaching = res.data.teaching;
            this.TeachingNonTeaching = {
              label: ["Non-Teaching", "Teaching"],
              data: [res.data.nonTeaching, res.data.teaching],
            };
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },

    getTotalEnrolledStudent() {
      let filter = this.$store.getters.getFilterSelected;
      let userData = this.$store.state.user.status;
      this.axiosCall(
        "/enroll-student/getTotalEnrolledStudent/" + filter + "/" + userData,
        "GET",
      ).then(
        (res) => {
          if (res.data) {
            console.log("Data Enroled", res.data.enrolledData);
            console.log("Data Verify", res.data.verifyData);
            this.demographics = res.data;
            this.enrollData = res.data.enrolledData;
            this.verifyData = res.data.verifyData;
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },
  },
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },

  mounted() {
    this.initialize();
  },
};
</script>
