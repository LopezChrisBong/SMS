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
    });
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderChart(this.chartData, {
          responsive: true,
          maintainAspectRatio: false,
        });
      },
    },
  },
};
</script>
