<template>
  <div class=" mx-2 ">
    <v-card class="">
      <v-row class=" mx-2">
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
                  class="grey--text px-2 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
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
                  class="grey--text px-2 text-subtitle-1 font-weight-medium w-full d-flex justify-center"
                  >Male Employee / Female Employee
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
export default {
  components: {
    PieChart,
    PieChart1,
  },
  data: () => ({
    mini: false,
    upcoming_bdays: [],
    hasUpcomingBday: false,
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
    today: null,
    activeCalendar: null,
    tracked: {},
    teaching: null,
    nonTeaching: null,
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
  methods: {
    initialize() {
      // this.getUpComingBdays();
      // this.getMaleFemaleCount();
      // this.getEmployeeStats();
      // this.getIfHasDirectHead();
      // this.getMyDirectHead();
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
    // getUpComingBdays() {
    //   this.axiosCall("/user-details/getBdayToday", "GET").then(
    //     (res) => {
    //       if (res) {
    //         this.today = res.data.today;
    //         this.activeCalendar = res.data.today;
    //         this.tracked = res.data.data;
    //         console.log("tracked", this.tracked);
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // },

    // shiftCalendar(move) {
    //   this.isCalendarFocus = false;
    //   let date = new Date(this.activeCalendar);
    //   if (move == "prev") {
    //     date.setMonth(date.getMonth() - 1);
    //   } else {
    //     date.setMonth(date.getMonth() + 1);
    //   }
    //   this.activeCalendar = date.toLocaleDateString();

    //   this.axiosCall("/user-details/shiftCalendar/" + date, "GET").then(
    //     (res) => {
    //       if (res) {
    //         this.today = res.data.today;
    //         this.tracked = res.data.data;
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // },

    // getMyDirectHead() {
    //   this.axiosCall("/user-details/getMyDirectHead", "GET").then(
    //     (res) => {
    //       console.log(res.data);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // },

    // getMyDirectHeadCount() {
    //   this.axiosCall("/my-direct-head/getMyDirectHeadCount", "GET").then(
    //     (res) => {
    //       if (res.data) {
    //         this.getIfHasDirectHead();
    //         Object.assign(this.head_data, { should_open: false });
    //       } else {
    //         this.getIfHasDirectHead();
    //         Object.assign(this.head_data, { should_open: true });
    //       }
    //     }
    //   );
    // },

    // getIfHasDirectHead() {
    //   this.axiosCall("/my-direct-head/getIfHasDirectHead", "GET").then(
    //     (res) => {
    //       console.log("hasdirecthead", res.data);
    //       this.head_data = res.data;
    //     }
    //   );
    // },

    // getEmployeeStats() {
    //   this.axiosCall("/user-details/getEmployeeStats", "GET").then(
    //     (res) => {
    //       if (res.data) {
    //         this.datas = {
    //           label: [
    //             "Permanent",
    //             "Temporary",
    //             "Casual",
    //             "COS",
    //             "JO",
    //             "Coterminous",
    //           ],

    //           data: [
    //             res.data.permanent,
    //             res.data.temporary,
    //             res.data.casual,
    //             res.data.COS,
    //             res.data.JO,
    //             res.data.coterminous,
    //           ],
    //         };
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // },

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
        }
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
        }
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
    this.getTeachingNonTeachingCount();
    this.getMaleFemaleCount();
  },
};
</script>
