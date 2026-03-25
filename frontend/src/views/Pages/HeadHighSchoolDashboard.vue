<template>
  <v-container fluid>
    <v-row>
      <!-- Total Enrollees -->
      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Total Enrollees
              </div>
              <div class="text-h3 font-weight-bold">
                {{ enrollData }}
              </div>
            </div>

            <v-icon size="40" color="primary"> mdi-account-group </v-icon>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between">
            <span class="text-blue-darken-2">
              <v-icon size="18">mdi-gender-male</v-icon>
              Male: {{ mcount }}
            </span>

            <span class="text-pink-darken-2">
              <v-icon size="18">mdi-gender-female</v-icon>
              Female: {{ fmcount }}
            </span>
          </div>
        </v-card>
      </v-col>

      <!-- Teachers -->
      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Number of Teachers
              </div>
              <div class="text-h3 font-weight-bold">
                {{ countTeacher }}
              </div>
            </div>

            <v-icon size="40" color="green"> mdi-teach </v-icon>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between">
            <span class="text-blue-darken-2">
              <v-icon size="18">mdi-gender-male</v-icon>
              Male: {{ teacherm }}
            </span>

            <span class="text-pink-darken-2">
              <v-icon size="18">mdi-gender-female</v-icon>
              Female: {{ teacherf }}
            </span>
          </div>
        </v-card>
      </v-col>

      <!-- Rooms -->
      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="3" style="height: 165px">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Number of Rooms
              </div>
              <div class="text-h3 font-weight-bold">
                {{ countRoom }}
              </div>
            </div>

            <v-icon size="40" color="deep-purple">
              mdi-google-classroom
            </v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col cols="12" md="3">
        <v-select
          label="School Year"
          :items="schoolYears"
          v-model="schoolYear"
          outlined
          dense
        />
      </v-col> -->

      <v-col cols="12" md="3">
        <v-select
          label="Level"
          :items="levels"
          v-model="selectedLevel"
          outlined
          dense
          @change="changeData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <div class="d-flex justify-center">
            <h1>Total Enrollees</h1>
          </div>
          <div class="chart-wrapper">
            <div class="y-label">Number of Enrollees</div>

            <div class="chart-area">
              <line-chart v-if="forecastChart" :chartData="forecastChart" />
            </div>
          </div>

          <div class="text-center">Year</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="6">
        <v-card class="pa-4">
          <div class="d-flex justify-center">
            <h1>Number of Teachers</h1>
          </div>
          <div class="chart-wrapper">
            <div class="y-label">Teachers</div>

            <div class="chart-area">
              <line-chart :chartData="teacherForecastChart" />
            </div>
          </div>
          <div class="text-center">Year</div>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-card class="pa-4">
          <div class="d-flex justify-center">
            <h1>Number of Rooms</h1>
          </div>
          <div class="chart-wrapper">
            <div class="y-label">Rooms</div>

            <div class="chart-area">
              <line-chart :chartData="roomForecastChart" />
            </div>
          </div>
          <div class="text-center">Year</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div class="d-flex justify-center">
            <h1>Enrollees by Grade Level</h1>
          </div>
          <div class="chart-wrapper">
            <div class="y-label">Enrollees</div>

            <div class="chart-area">
              <BarChart
                :forecastData="gradeForecastChar"
                :selectedLevel="selectedLevel"
              />
            </div>
          </div>
          <div class="text-center">Year</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div class="d-flex justify-center">
            <h1>Student Gender Distribution</h1>
          </div>
          <pie-chart :chartData="genderChart" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "../../components/Charts/ForecastChart/LineChart.vue";
import BarChart from "../../components/Charts/ForecastChart/ForecastedBar.vue";
import PieChart from "../../components/Charts/ForecastChart/PieChart.vue";

export default {
  components: {
    LineChart,
    BarChart,
    PieChart,
  },

  data() {
    return {
      enrollData: null,
      schoolYear: null,
      selectedLevel: "All",
      gradeForecastChar: [],
      countTeacher: null,
      teacherf: null,
      teacherm: null,
      countRoom: null,
      schoolYears: ["2023-2024", "2024-2025", "2025-2026"],
      levels: [
        "All",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10",
        "Grade 11",
        "Grade 12",
      ],

      gradeChart: {
        labels: ["7", "8", "9", "10", "11", "12"],
        datasets: [
          {
            label: "Students",
            data: [220, 230, 215, 225, 245, 250],
            backgroundColor: "#42A5F5",
          },
        ],
      },

      genderChart: {},
      maleCnt: 0,
      femaleCnt: 0,
      maleFemale: {},
      forecastChart: null,
      allForecastData: [],
      teacherRoomForecastData: [],
      teacherForecastChart: null,
      roomForecastChart: null,
      fmcount: null,
      mcount: null,
    };
  },
  watch: {
    "$store.getters.getFilterSelected"() {
      this.initialize();
    },
    forecastData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.renderGradeChart();
        }
      },
      deep: true,
      immediate: true,
    },
    selectedLevel() {
      this.renderGradeChart();
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getTotalEnrolledStudent();
      this.getMaleFemaleCount();
      this.getCombinedForecasts();
      this.getTeacherRoomNeedForecasts();
    },
    getTotalEnrolledStudent() {
      let filter = this.$store.getters.getFilterSelected;
      let userData = this.$store.state.user.status;
      this.axiosCall(
        "/enroll-student/getTotalEnrolledStudent/" +
          filter +
          "/" +
          userData +
          "/" +
          this.selectedLevel,
        "GET",
      ).then(
        (res) => {
          if (res.data) {
            this.enrollData = res.data.enrolledData;
            this.fmcount = res.data.fmcount;
            this.mcount = res.data.mcount;
            this.countTeacher = res.data.countTeacher;
            this.teacherf = res.data.teacherf;
            this.teacherm = res.data.teacherm;
            this.countRoom = res.data.countRoom;
            this.genderChart = {
              labels: ["Male", "Female"],
              datasets: [
                {
                  data: [res.data.mcount, res.data.fmcount],
                  backgroundColor: ["#42A5F5", "#EC407A"],
                },
              ],
            };
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },

    getMaleFemaleCount() {
      this.axiosCall("/user-details/getMaleFemaleCount", "GET").then(
        (res) => {
          console.log(res.data.female);

          if (res.data) {
            this.maleCnt = res.data.male;
            this.femaleCnt = res.data.female;
          }
        },
        (error) => {
          console.log(error);
        },
      );
    },

    getCombinedForecasts() {
      this.axiosCall("/enroll-student/getCombinedForecasts", "GET").then(
        (res) => {
          if (res.data) {
            this.allForecastData = res.data;
            // build chart for default grade
            this.buildChart();
          }
        },
      );
    },
    changeData() {
      this.initialize();
      this.buildChart();
      this.buildTeacherForecastChart();
      this.buildRoomForecastChart();
    },
    buildChart() {
      let gradeData = [];

      if (this.selectedLevel === "All") {
        const yearMap = {};

        this.allForecastData.forEach((d) => {
          const year = d.allYear;

          if (!yearMap[year]) {
            yearMap[year] = {
              year: year,
              actual: 0,
              forecast: 0,
              hasActual: false,
            };
          }

          if (d.actual_students !== null && d.actual_students !== undefined) {
            yearMap[year].actual += Number(d.actual_students);
            yearMap[year].hasActual = true;
          }

          yearMap[year].forecast += Number(d.forecasted_students);
        });

        gradeData = Object.values(yearMap).map((y) => ({
          year: y.year,
          actual: y.hasActual ? y.actual : null, // ⭐ this stops the line
          forecast: y.forecast,
        }));
      } else {
        const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

        gradeData = this.allForecastData
          .filter((d) => d.gradeyr_level === gradeNumber)
          .map((d) => ({
            year: d.allYear,
            actual: d.actual_students ? Number(d.actual_students) : null,
            forecast: Number(d.forecasted_students),
          }));
      }
      gradeData.sort((a, b) => a.year - b.year);
      const labels = gradeData.map((d) => d.year);

      const actual = gradeData.map((d) => d.actual);

      //  ONLY SHOW FORECAST AFTER ACTUAL
      // find last actual index
      const lastActualIndex = actual
        .map((v) => v !== null && v !== 0)
        .lastIndexOf(true);

      // build forecast dataset
      const smoothing = gradeData.map((d, i) => {
        if (i === lastActualIndex) return actual[i]; // connection point
        if (i > lastActualIndex) return d.forecast; // forecast values
        return null;
      });

      this.forecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Actual",
            data: actual,
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Forecasted",
            data: smoothing,
            borderColor: "#FFA726",
            borderDash: [8, 5],
            fill: false,
          },
        ],
      };
    },
    //     buildChart() {
    //   const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

    //   const gradeData = this.allForecastData.filter(
    //     (d) => d.gradeyr_level === gradeNumber,
    //   );

    //   const labels = gradeData.map((d) => d.allYear);

    //   const actual = gradeData.map((d) => d.actual_students);

    //   // const linear = gradeData.map((d) =>
    //   //   d.linear_regression ? Number(d.linear_regression) : null,
    //   // );

    //   const smoothing = gradeData.map((d) => Number(d.exponential_smoothing));

    //   this.forecastChart = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         // label: "Actual Students",
    //         label: "Actual",
    //         data: actual,
    //         borderColor: "#42A5F5",
    //         fill: false,
    //       },
    //       // {
    //       //   label: "Linear Regression",
    //       //   data: linear,
    //       //   borderColor: "#66BB6A",
    //       //   borderDash: [5, 5],
    //       //   fill: false,
    //       // },
    //       {
    //         // label: "Exponential Smoothing",
    //         label: "Forecasted",
    //         data: smoothing,
    //         borderColor: "#FFA726",
    //         borderDash: [8, 5],
    //         fill: false,
    //       },
    //     ],
    //   };
    // },

    // buildChart() {
    //   let gradeData = [];

    //   if (this.selectedLevel === "All") {
    //     const yearMap = {};

    //     this.allForecastData.forEach((d) => {
    //       const year = d.allYear;

    //       if (!yearMap[year]) {
    //         yearMap[year] = {
    //           year: year,
    //           actual: 0,
    //           forecast: 0,
    //         };
    //       }

    //       // sum actual
    //       if (d.actual_students) {
    //         yearMap[year].actual += Number(d.actual_students);
    //       }

    //       // sum exponential smoothing
    //       yearMap[year].forecast += Number(d.exponential_smoothing);
    //     });

    //     gradeData = Object.values(yearMap);
    //   } else {
    //     const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

    //     gradeData = this.allForecastData
    //       .filter((d) => d.gradeyr_level === gradeNumber)
    //       .map((d) => ({
    //         year: d.allYear,
    //         actual: d.actual_students,
    //         forecast: Number(d.exponential_smoothing),
    //       }));
    //   }

    //   const labels = gradeData.map((d) => d.year);
    //   const actual = gradeData.map((d) => d.actual);
    //   const smoothing = gradeData.map((d) => d.forecast);

    //   this.forecastChart = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: "Actual",
    //         data: actual,
    //         borderColor: "#42A5F5",
    //         fill: false,
    //       },
    //       {
    //         label: "Forecasted",
    //         data: smoothing,
    //         borderColor: "#FFA726",
    //         borderDash: [8, 5],
    //         fill: false,
    //       },
    //     ],
    //   };
    // },

    // buildChartWithPoly() {
    //   const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

    //   const gradeData = this.allForecastData.filter(
    //     (d) => d.gradeyr_level === gradeNumber,
    //   );

    //   const labels = gradeData.map((d) => d.allYear);

    //   const actual = gradeData.map((d) => d.actual_students);

    //   const linear = gradeData.map((d) =>
    //     d.linear_regression ? Number(d.linear_regression) : null,
    //   );

    //   const smoothing = gradeData.map((d) => Number(d.exponential_smoothing));

    //   //   const polynomial = gradeData.map((d) =>
    //   //     d.polynomial_regression ? Number(d.polynomial_regression) : null,
    //   //   );
    //   const polynomial = gradeData.map((d) =>
    //     d.polynomial_regression && d.polynomial_regression !== 0
    //       ? Number(d.polynomial_regression)
    //       : null,
    //   );

    //   this.forecastChart = {
    //     labels,
    //     datasets: [
    //       {
    //         label: "Actual Students",
    //         data: actual,
    //         borderColor: "#42A5F5",
    //         fill: false,
    //       },
    //       {
    //         label: "Linear Regression",
    //         data: linear,
    //         borderColor: "#66BB6A",
    //         borderDash: [5, 5],
    //         fill: false,
    //       },
    //       {
    //         label: "Polynomial Regression",
    //         data: polynomial,
    //         borderColor: "#AB47BC",
    //         borderDash: [2, 3],
    //         fill: false,
    //       },
    //       {
    //         label: "Exponential Smoothing",
    //         data: smoothing,
    //         borderColor: "#FFA726",
    //         borderDash: [8, 5],
    //         fill: false,
    //       },
    //     ],
    //   };
    // },
    getTeacherRoomNeedForecasts() {
      this.axiosCall("/enroll-student/getTeacherRoomNeedForecasts", "GET").then(
        (res) => {
          if (res.data) {
            this.teacherRoomForecastData = res.data;
            this.gradeForecastChar = this.formatForecastData(res.data);
            this.buildTeacherForecastChart();
            this.buildRoomForecastChart();
          }
        },
      );
    },
    // buildTeacherForecastChart() {
    //   const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

    //   const gradeData = this.teacherRoomForecastData.filter(
    //     (d) => d.gradeyr_level === gradeNumber,
    //   );

    //   const labels = gradeData.map((d) => d.allYear);

    //   this.teacherForecastChart = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: "Actual",
    //         data: gradeData.map((d) => Number(d.teacher_count)),
    //         borderColor: "#42A5F5",
    //         fill: false,
    //       },
    //       {
    //         label: "Forecasted",
    //         data: gradeData.map((d) => Number(d.teachers_needed)),
    //         borderColor: "#EF5350",
    //         borderDash: [5, 5],
    //         fill: false,
    //       },
    //     ],
    //   };
    // },
    buildTeacherForecastChart() {
      let gradeData = [];

      if (this.selectedLevel === "All") {
        const yearMap = {};

        this.teacherRoomForecastData.forEach((d) => {
          const year = d.allYear;

          if (!yearMap[year]) {
            yearMap[year] = {
              year: year,
              actual: 0,
              forecast: 0,
              hasActual: false,
            };
          }

          if (d.teacher_count !== null && d.teacher_count !== undefined) {
            yearMap[year].actual += Number(d.teacher_count);
            yearMap[year].hasActual = true;
          }

          yearMap[year].forecast += Number(d.teachers_needed || 0);
        });

        gradeData = Object.values(yearMap).map((y) => ({
          year: y.year,
          actual: y.hasActual ? y.actual : null, // ⭐ stops the line
          forecast: y.forecast,
        }));
      } else {
        const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

        gradeData = this.teacherRoomForecastData
          .filter((d) => d.gradeyr_level === gradeNumber)
          .map((d) => ({
            year: d.allYear,
            actual: d.teacher_count !== null ? Number(d.teacher_count) : null,
            forecast:
              d.teachers_needed !== null ? Number(d.teachers_needed) : null,
          }));
      }

      //  SORT YEARS
      gradeData.sort((a, b) => a.year - b.year);

      const labels = gradeData.map((d) => d.year);

      const actual = gradeData.map((d) => d.actual);

      //  FIND LAST ACTUAL INDEX
      const lastActualIndex = actual
        .map((v) => v !== null && v !== 0)
        .lastIndexOf(true);

      // ⭐ BUILD FORECAST DATASET
      const forecast = gradeData.map((d, i) => {
        if (i === lastActualIndex) return actual[i]; // connect lines
        if (i > lastActualIndex) return d.forecast; // forecast after
        return null;
      });

      this.teacherForecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Actual",
            data: actual,
            borderColor: "#42A5F5",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Forecasted",
            data: forecast,
            borderColor: "#EF5350",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
        ],
      };
    },
    // buildRoomForecastChart() {
    //   const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

    //   const gradeData = this.teacherRoomForecastData.filter(
    //     (d) => d.gradeyr_level === gradeNumber,
    //   );

    //   const labels = gradeData.map((d) => d.allYear);

    //   this.roomForecastChart = {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: "Actual",
    //         data: gradeData.map((d) => Number(d.room_count)),
    //         borderColor: "#66BB6A",
    //         fill: false,
    //       },
    //       {
    //         label: "Forecasted",
    //         data: gradeData.map((d) => Number(d.classrooms_needed)),
    //         borderColor: "#FFA726",
    //         borderDash: [5, 5],
    //         fill: false,
    //       },
    //     ],
    //   };
    // },
    buildRoomForecastChart() {
      let gradeData = [];

      if (this.selectedLevel === "All") {
        const yearMap = {};

        this.teacherRoomForecastData.forEach((d) => {
          const year = d.allYear;

          if (!yearMap[year]) {
            yearMap[year] = {
              year: year,
              actual: 0,
              forecast: 0,
              hasActual: false,
            };
          }

          // only add real room data
          if (d.room_count !== null && d.room_count !== undefined) {
            yearMap[year].actual += Number(d.room_count);
            yearMap[year].hasActual = true;
          }

          yearMap[year].forecast += Number(d.classrooms_needed || 0);
        });

        gradeData = Object.values(yearMap).map((y) => ({
          year: y.year,
          actual: y.hasActual ? y.actual : null, // ⭐ stops the line
          forecast: y.forecast,
        }));
      } else {
        const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

        gradeData = this.teacherRoomForecastData
          .filter((d) => d.gradeyr_level === gradeNumber)
          .map((d) => ({
            year: d.allYear,
            actual: d.room_count !== null ? Number(d.room_count) : null,
            forecast:
              d.classrooms_needed !== null ? Number(d.classrooms_needed) : null,
          }));
      }

      //  SORT YEARS
      gradeData.sort((a, b) => a.year - b.year);

      const labels = gradeData.map((d) => d.year);
      const actual = gradeData.map((d) => d.actual);

      //  FIND LAST ACTUAL INDEX
      const lastActualIndex = actual
        .map((v) => v !== null && v !== 0)
        .lastIndexOf(true);

      //  BUILD FORECAST DATASET
      const forecast = gradeData.map((d, i) => {
        if (i === lastActualIndex) return actual[i]; // connect point
        if (i > lastActualIndex) return d.forecast; // future forecast
        return null;
      });

      this.roomForecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Actual",
            data: actual,
            borderColor: "#66BB6A",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Forecasted",
            data: forecast,
            borderColor: "#FFA726",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
        ],
      };
    },
    // formatForecastData(data) {
    //   const years = {};

    //   data.forEach((item) => {
    //     const year = item.allYear;
    //     const grade = `Grade ${item.gradeyr_level}`;
    //     const students = Number(item.forecasted_students) || 0;

    //     if (!years[year]) {
    //       years[year] = {
    //         schoolYear: year,
    //         grades: {},
    //       };
    //     }

    //     years[year].grades[grade] = students;
    //   });

    //   return Object.values(years);
    // },
    formatForecastData(data) {
      const years = {};

      data.forEach((item) => {
        const year = item.allYear;
        const grade = `Grade ${item.gradeyr_level}`;
        const students = Number(item.actual_students) || 0;

        // skip future years with no actual data
        if (item.actual_students === null) return;

        if (!years[year]) {
          years[year] = {
            schoolYear: year,
            grades: {},
          };
        }

        years[year].grades[grade] = students;
      });

      return Object.values(years);
    },
  },
};
</script>
<style scoped>
.chart-wrapper {
  display: flex;
  align-items: center;
}

.y-label {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-weight: bold;
  width: 40px;
  text-align: center;
}

.chart-area {
  width: 100%;
}
</style>
