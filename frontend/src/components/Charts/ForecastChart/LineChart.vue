<!-- <script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartData: Object,
  },

  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
};
</script> -->
<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartData: Object,
  },

  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMax: this.getMaxValue() * 1.2, // adds 20% headroom
            },
            gridLines: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            // gridLines: {
            //   display: false,
            // },
          },
        ],
      },
    });
  },

  methods: {
    getMaxValue() {
      let values = [];

      this.chartData.datasets.forEach((dataset) => {
        values = values.concat(dataset.data.filter((v) => v !== null));
      });

      return Math.max(...values);
    },
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderChart(this.chartData, {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  suggestedMax: this.getMaxValue() * 2.0,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        });
      },
    },
  },
};
</script>
