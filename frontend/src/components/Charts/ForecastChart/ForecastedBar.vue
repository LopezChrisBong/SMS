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
      const formattedData = this.forecastData;

      const grades = [
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10",
        "Grade 11",
        "Grade 12",
      ];

      if (this.$data._chart) {
        this.$data._chart.destroy();
      }

      this.renderChart(
        {
          labels: formattedData.map((i) => i.schoolYear),
          datasets: grades.map((grade, index) => {
            const hue = index * 50;

            return {
              label: grade,
              data: formattedData.map(
                (i) => (i.grades && i.grades[grade]) || 0,
              ),
              backgroundColor: `hsl(${hue},70%,50%)`,
            };
          }),
        },
        {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            datalabels: {
              anchor: "center",
              align: "center",

              color: function (context) {
                const bg = context.dataset.backgroundColor;

                if (bg.includes("hsl")) {
                  const lightness = Number(bg.split(",")[2].replace("%)", ""));
                  return lightness < 60 ? "white" : "black";
                }

                return "white";
              },

              font: {
                weight: "bold",
                size: 12,
              },
            },
          },

          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }],
          },
        },
      );
    },
    getTextColor(hue) {
      const h = hue / 360;
      const s = 0.7;
      const l = 0.5;

      const a = s * Math.min(l, 1 - l);
      const f = (n) => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
      };

      const r = f(0);
      const g = f(8);
      const b = f(4);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      return brightness > 125 ? "black" : "white";
    },
  },
};
</script>
