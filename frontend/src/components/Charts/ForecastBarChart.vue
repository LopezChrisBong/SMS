<template>
  <v-card class="pa-4 mt-4" style="width: 100%">
    <v-card-title>Teachers Needed Forecast</v-card-title>
    <div style="height: 350px">
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
      this.renderChartData();
    }
  },

  watch: {
    forecastData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.renderChartData();
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    renderChartData() {
      this.renderChart(
        {
          labels: this.forecastData.map((i) => i.schoolYear),
          datasets: [
            {
              label: "Teachers Needed",
              backgroundColor: "#43A047",
              data: this.forecastData.map((i) => i.teachersNeeded),
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
};
</script>
