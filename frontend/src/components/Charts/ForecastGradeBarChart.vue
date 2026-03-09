<template>
  <v-card class="pa-4 mt-4" style="width: 100%">
    <v-card-title>Grade Distribution Forecast</v-card-title>
    <div style="height: 400px">
      <canvas ref="canvas"></canvas>
    </div>
  </v-card>
</template>

<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["forecastData"],

  mounted() {
    if (this.forecastData && this.forecastData.length) {
      this.renderGradeChart();
    }
  },

  watch: {
    forecastData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.renderGradeChart();
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    renderGradeChart() {
      const grades =
        this.$store.state.user.user.assignedModuleID == 3
          ? [
              "Grade 7",
              "Grade 8",
              "Grade 9",
              "Grade 10",
              "Grade 11",
              "Grade 12",
            ]
          : [
              "Kindergarten",
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
            ];

      //  Destroy old chart if exists
      if (this.$data._chart) {
        this.$data._chart.destroy();
      }

      this.renderChart(
        {
          labels: this.forecastData.map((i) => i.schoolYear),
          datasets: grades.map((grade, index) => ({
            label: grade,
            data: this.forecastData.map(
              (i) => (i.grades && i.grades[grade]) || 0,
            ),
            backgroundColor: `hsl(${index * 50}, 70%, 50%)`,
          })),
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }],
          },
          legend: {
            labels: {
              fontColor: "black",
            },
          },
        },
      );
    },
  },
};
</script>
