<template>
  <v-card class="pa-4 mt-4" style="width: 100%">
    <v-card-title>Total Students Forecast</v-card-title>
    <div style="height: 350px">
      <canvas ref="canvas"></canvas>
    </div>
  </v-card>
</template>

<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["forecastData"],

  watch: {
    forecastData: {
      immediate: true,
      deep: true,
      handler(newData) {
        if (!newData || !newData.length) return;

        this.renderChart(
          {
            labels: newData.map((i) => i.schoolYear),
            datasets: [
              {
                label: "Total Students",
                data: newData.map((i) => i.totalStudents),
                borderColor: "#1976D2",
                backgroundColor: "rgba(25,118,210,0.2)",
                fill: true,
                lineTension: 0.3,
                pointBackgroundColor: "#1976D2",
              },
            ],
          },
          {
            responsive: true,
            maintainAspectRatio: false,
          },
        );
      },
    },
  },
};
</script>
