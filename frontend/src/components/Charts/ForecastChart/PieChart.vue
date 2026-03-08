<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: {
    chartData: Object,
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
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
};
</script>
