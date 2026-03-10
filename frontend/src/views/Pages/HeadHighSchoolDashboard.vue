<template>
  <v-container fluid>
    <v-row>
      <v-col md="4">
        <v-card class="pa-4" style="height: 150px">
          <h3>Total Enrollees</h3>
          <h1>{{ enrollData }}</h1>
          <div>
            Male: {{ " " + mcount + " " }}| Female: {{ " " + fmcount + " " }}
          </div>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card class="pa-4" style="height: 150px">
          <h3>Number of Teachers</h3>
          <h1>85</h1>
          <div>Male: 35 | Female: 50</div>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card class="pa-4" style="height: 150px">
          <h3>Number of Rooms</h3>
          <h1>30</h1>
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
          <h3>Total Enrollees</h3>
          <line-chart v-if="forecastChart" :chartData="forecastChart" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="6">
        <v-card class="pa-4">
          <h3>Number of Teachers</h3>
          <line-chart :chartData="teacherForecastChart" />
        </v-card>
      </v-col>

      <v-col md="6">
        <v-card class="pa-4">
          <h3>Number of Rooms</h3>
          <line-chart :chartData="roomForecastChart" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <v-card class="pa-4">
          <h3>Enrollees by Grade Level</h3>
          <!-- <bar-chart :chartData="gradeChart" /> -->
          <BarChart :forecastData="gradeForecastChar" />
        </v-card>
      </v-col>

      <!-- <v-col md="6">
        <v-card class="pa-4">
          <h3>Employee Gender Distribution</h3>
          <pie-chart :chartData="genderChart" />
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "../../components/Charts/ForecastChart/LineChart.vue";
import BarChart from "../../components/Charts/ForecastChart/ForecastedBar.vue";
// import PieChart from "../../components/Charts/ForecastChart/PieChart.vue";

export default {
  components: {
    LineChart,
    BarChart,
    // PieChart,
  },

  data() {
    return {
      enrollData: null,
      schoolYear: null,
      selectedLevel: "Grade 7",
      gradeForecastChar: [],
      schoolYears: ["2023-2024", "2024-2025", "2025-2026"],
      levels: [
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
        "/enroll-student/getTotalEnrolledStudent/" + filter + "/" + userData,
        "GET",
      ).then(
        (res) => {
          if (res.data) {
            this.enrollData = res.data.enrolledData;
            this.fmcount = res.data.fmcount;
            this.mcount = res.data.mcount;
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

            this.genderChart = {
              labels: ["Male", "Female"],
              datasets: [
                {
                  data: [res.data.male, res.data.female],
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
      this.buildChart();
      this.buildTeacherForecastChart();
      this.buildRoomForecastChart();
    },

    buildChart() {
      const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

      const gradeData = this.allForecastData.filter(
        (d) => d.gradeyr_level === gradeNumber,
      );

      const labels = gradeData.map((d) => d.allYear);

      const actual = gradeData.map((d) => d.actual_students);

      const linear = gradeData.map((d) =>
        d.linear_regression ? Number(d.linear_regression) : null,
      );

      const smoothing = gradeData.map((d) => Number(d.exponential_smoothing));

      this.forecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Actual Students",
            data: actual,
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Linear Regression",
            data: linear,
            borderColor: "#66BB6A",
            borderDash: [5, 5],
            fill: false,
          },
          {
            label: "Exponential Smoothing",
            data: smoothing,
            borderColor: "#FFA726",
            borderDash: [8, 5],
            fill: false,
          },
        ],
      };
    },

    buildChartWithPoly() {
      const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

      const gradeData = this.allForecastData.filter(
        (d) => d.gradeyr_level === gradeNumber,
      );

      const labels = gradeData.map((d) => d.allYear);

      const actual = gradeData.map((d) => d.actual_students);

      const linear = gradeData.map((d) =>
        d.linear_regression ? Number(d.linear_regression) : null,
      );

      const smoothing = gradeData.map((d) => Number(d.exponential_smoothing));

      //   const polynomial = gradeData.map((d) =>
      //     d.polynomial_regression ? Number(d.polynomial_regression) : null,
      //   );
      const polynomial = gradeData.map((d) =>
        d.polynomial_regression && d.polynomial_regression !== 0
          ? Number(d.polynomial_regression)
          : null,
      );

      this.forecastChart = {
        labels,
        datasets: [
          {
            label: "Actual Students",
            data: actual,
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Linear Regression",
            data: linear,
            borderColor: "#66BB6A",
            borderDash: [5, 5],
            fill: false,
          },
          {
            label: "Polynomial Regression",
            data: polynomial,
            borderColor: "#AB47BC",
            borderDash: [2, 3],
            fill: false,
          },
          {
            label: "Exponential Smoothing",
            data: smoothing,
            borderColor: "#FFA726",
            borderDash: [8, 5],
            fill: false,
          },
        ],
      };
    },
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
    buildTeacherForecastChart() {
      const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

      const gradeData = this.teacherRoomForecastData.filter(
        (d) => d.gradeyr_level === gradeNumber,
      );

      const labels = gradeData.map((d) => d.allYear);

      this.teacherForecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Current Teachers",
            data: gradeData.map((d) => Number(d.teacher_count)),
            borderColor: "#42A5F5",
            fill: false,
          },
          {
            label: "Teachers Needed",
            data: gradeData.map((d) => Number(d.teachers_needed)),
            borderColor: "#EF5350",
            borderDash: [5, 5],
            fill: false,
          },
        ],
      };
    },
    buildRoomForecastChart() {
      const gradeNumber = Number(this.selectedLevel.replace("Grade ", ""));

      const gradeData = this.teacherRoomForecastData.filter(
        (d) => d.gradeyr_level === gradeNumber,
      );

      const labels = gradeData.map((d) => d.allYear);

      this.roomForecastChart = {
        labels: labels,
        datasets: [
          {
            label: "Current Rooms",
            data: gradeData.map((d) => Number(d.room_count)),
            borderColor: "#66BB6A",
            fill: false,
          },
          {
            label: "Rooms Needed",
            data: gradeData.map((d) => Number(d.classrooms_needed)),
            borderColor: "#FFA726",
            borderDash: [5, 5],
            fill: false,
          },
        ],
      };
    },
    formatForecastData(data) {
      const years = {};

      data.forEach((item) => {
        const year = item.allYear;
        const grade = `Grade ${item.gradeyr_level}`;
        const students = Number(item.forecasted_students) || 0;

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
